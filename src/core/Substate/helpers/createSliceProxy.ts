import type { ISubstate } from '../Substate.interface';
import type { TUpdateMiddleware, TUserState } from '../interfaces';

export type TSubstateSyncProxy<TShape> = TShape & {
  /**
   * Read/write the entire slice at this sync() path.
   * Useful for primitives: `store.sync('age').value`
   */
  value: TShape;
  batch(): TSubstateSyncProxy<TShape>;
  commit(): void;
  cancel(): void;
  with(
    attrs: TProxyAttributesConfig,
    callback?: (draft: TSubstateSyncProxy<TShape>) => void
  ): TSubstateSyncProxy<TShape>;
};

export type TProxySyncConfig = {
  beforeUpdate?: TUpdateMiddleware[];
  afterUpdate?: TUpdateMiddleware[];
};

export type TProxyAttributesConfig = {
  $tag?: string;
  $deep?: boolean;
  $type?: string;
  before?: TUpdateMiddleware[];
  after?: TUpdateMiddleware[];
};

type TPending = Record<string, unknown>;

type TSliceProxyInternal = {
  rootPath: string;
  // Explicit batching state (batch()/commit()/cancel())
  pending: TPending | null;
  // Buffered attributes to apply on next write/commit
  pendingAttributes: TProxyAttributesConfig | null;
  // Scoped middleware from sync() config (applies to all writes from this proxy)
  scopedBefore: TUpdateMiddleware[];
  scopedAfter: TUpdateMiddleware[];
  // Cached sub-proxies by property key
  childCache: Map<PropertyKey, unknown>;
};

const mutatingArrayMethods = new Set<PropertyKey>([
  'copyWithin',
  'fill',
  'pop',
  'push',
  'reverse',
  'shift',
  'sort',
  'splice',
  'unshift',
]);

function isObjectLike(value: unknown): value is Record<string, unknown> | unknown[] {
  return typeof value === 'object' && value !== null;
}

function joinPath(base: string, prop: PropertyKey): string {
  if (typeof prop === 'symbol') return base;
  const key = String(prop);
  if (base === '') return key;
  return `${base}.${key}`;
}

function snapshot(store: ISubstate, path: string): unknown {
  if (path === '') return store.getCurrentState();
  return store.getProp(path);
}

function buildActionPayload(
  pending: TPending,
  attributes: TProxyAttributesConfig | null
): Partial<TUserState> {
  const payload: Record<string, unknown> = { ...pending };
  if (attributes?.$deep !== undefined) payload.$deep = attributes.$deep;
  if (attributes?.$type !== undefined) payload.$type = attributes.$type;
  if (attributes?.$tag !== undefined) payload.$tag = attributes.$tag;
  return payload as Partial<TUserState>;
}

function runMiddleware(store: ISubstate, list: TUpdateMiddleware[], action: Partial<TUserState>): void {
  for (let i = 0; i < list.length; i++) list[i](store, action);
}

export function createSliceProxy<TShape = unknown>(
  store: ISubstate,
  rootPath: string | undefined,
  config: TProxySyncConfig = {}
): TSubstateSyncProxy<TShape> {
  const internal: TSliceProxyInternal = {
    rootPath: rootPath ?? '',
    pending: null,
    pendingAttributes: null,
    scopedBefore: config.beforeUpdate ?? [],
    scopedAfter: config.afterUpdate ?? [],
    childCache: new Map(),
  };

  const commitInternal = (): void => {
    if (!internal.pending) return;

    const attributes = internal.pendingAttributes;
    const action = buildActionPayload(internal.pending, attributes);

    // Scoped middleware from sync() config, plus any per-write attributes middleware
    runMiddleware(store, internal.scopedBefore, action);
    if (attributes?.before) runMiddleware(store, attributes.before, action);

    store.updateState(action);

    if (attributes?.after) runMiddleware(store, attributes.after, action);
    runMiddleware(store, internal.scopedAfter, action);

    internal.pending = null;
    internal.pendingAttributes = null;
  };

  const cancelInternal = (): void => {
    internal.pending = null;
    internal.pendingAttributes = null;
  };

  const withInternal = (
    attrs: TProxyAttributesConfig,
    callback?: (draft: TSubstateSyncProxy<TShape>) => void
  ): TSubstateSyncProxy<TShape> => {
    if (typeof callback === 'function') {
      // Temporary batch scope; auto-commit at end
      const prevPending = internal.pending;
      const prevAttrs = internal.pendingAttributes;

      internal.pending = {};
      internal.pendingAttributes = attrs;
      try {
        callback(proxy);
      } finally {
        commitInternal();
        // Restore previous state (should be null normally, but keep it safe)
        internal.pending = prevPending;
        internal.pendingAttributes = prevAttrs;
      }
      return proxy;
    }

    // Buffer for next write(s)
    internal.pendingAttributes = internal.pendingAttributes
      ? { ...internal.pendingAttributes, ...attrs }
      : { ...attrs };
    return proxy;
  };

  const batchInternal = (): TSubstateSyncProxy<TShape> => {
    if (!internal.pending) internal.pending = {};
    return proxy;
  };

  const handler: ProxyHandler<Record<string, unknown>> = {
    get(_target, prop) {
      // Introspection/symbols
      if (prop === Symbol.toStringTag) return 'SubstateSyncProxy';

      // Methods
      if (prop === 'value') return snapshot(store, internal.rootPath);
      if (prop === 'batch') return batchInternal;
      if (prop === 'commit') return commitInternal;
      if (prop === 'cancel') return cancelInternal;
      if (prop === 'with') return withInternal;
      if (prop === 'toJSON') return () => snapshot(store, internal.rootPath);

      const fullPath = joinPath(internal.rootPath, prop);
      const current = snapshot(store, fullPath);

      // Array method handling (mutating methods should commit a new array)
      const parentValue = snapshot(store, internal.rootPath);
      if (Array.isArray(parentValue) && mutatingArrayMethods.has(prop)) {
        return (...args: unknown[]) => {
          const latest = snapshot(store, internal.rootPath);
          const arr = Array.isArray(latest) ? latest : [];
          const copy = arr.slice();
          // @ts-expect-error - dynamic method access on array
          const result = copy[prop](...args);
          if (internal.pending) {
            internal.pending[internal.rootPath] = copy;
          } else {
            const action = buildActionPayload({ [internal.rootPath]: copy }, internal.pendingAttributes);
            runMiddleware(store, internal.scopedBefore, action);
            if (internal.pendingAttributes?.before) runMiddleware(store, internal.pendingAttributes.before, action);
            store.updateState(action);
            if (internal.pendingAttributes?.after) runMiddleware(store, internal.pendingAttributes.after, action);
            runMiddleware(store, internal.scopedAfter, action);
            internal.pendingAttributes = null;
          }
          return result;
        };
      }

      // Cache sub-proxies for object-like values; primitives return as-is
      if (isObjectLike(current)) {
        const cached = internal.childCache.get(prop);
        if (cached) return cached;
        const child = createSliceProxy(store, fullPath, {
          beforeUpdate: internal.scopedBefore,
          afterUpdate: internal.scopedAfter,
        });
        internal.childCache.set(prop, child);
        return child;
      }

      return current;
    },

    set(_target, prop, value) {
      if (typeof prop === 'symbol') return false;
      const fullPath = prop === 'value' ? internal.rootPath : joinPath(internal.rootPath, prop);

      if (internal.pending) {
        internal.pending[fullPath] = value;
        return true;
      }

      const action = buildActionPayload({ [fullPath]: value }, internal.pendingAttributes);

      runMiddleware(store, internal.scopedBefore, action);
      if (internal.pendingAttributes?.before) runMiddleware(store, internal.pendingAttributes.before, action);

      store.updateState(action);

      if (internal.pendingAttributes?.after) runMiddleware(store, internal.pendingAttributes.after, action);
      runMiddleware(store, internal.scopedAfter, action);

      internal.pendingAttributes = null;
      return true;
    },

    deleteProperty(_target, prop) {
      if (typeof prop === 'symbol') return false;
      const fullPath = joinPath(internal.rootPath, prop);
      // Setting to undefined matches Substate semantics for missing values (no delete op in updateState)
      if (internal.pending) {
        internal.pending[fullPath] = undefined;
        return true;
      }
      const action = buildActionPayload({ [fullPath]: undefined }, internal.pendingAttributes);
      runMiddleware(store, internal.scopedBefore, action);
      if (internal.pendingAttributes?.before) runMiddleware(store, internal.pendingAttributes.before, action);
      store.updateState(action);
      if (internal.pendingAttributes?.after) runMiddleware(store, internal.pendingAttributes.after, action);
      runMiddleware(store, internal.scopedAfter, action);
      internal.pendingAttributes = null;
      return true;
    },

    has(_target, prop) {
      if (typeof prop === 'symbol') return false;
      const base = snapshot(store, internal.rootPath);
      if (!isObjectLike(base)) return false;
      return prop in (base as Record<PropertyKey, unknown>);
    },

    ownKeys() {
      const base = snapshot(store, internal.rootPath);
      if (!isObjectLike(base)) return [];
      return Reflect.ownKeys(base as Record<PropertyKey, unknown>);
    },

    getOwnPropertyDescriptor(_target, prop) {
      const base = snapshot(store, internal.rootPath);
      if (!isObjectLike(base)) return undefined;
      const desc = Object.getOwnPropertyDescriptor(base as Record<PropertyKey, unknown>, prop);
      if (!desc) return undefined;
      // Proxies require configurable for reported props unless they exist on target; keep safe
      return { ...desc, configurable: true };
    },
  };

  // Proxy target is an empty object; traps read from store snapshot
  const proxy = new Proxy<Record<string, unknown>>({}, handler) as unknown as TSubstateSyncProxy<TShape>;
  return proxy;
}

