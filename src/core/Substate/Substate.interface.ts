import type { IPubSub } from '../PubSub/PubSub.interface';
import type { TSyncConfig, TUpdateMiddleware, TUserState } from './interfaces';

interface ISyncInstance {
  unsync: () => void;
}
interface ISubstateConfig<TState extends TUserState = TUserState> {
  name?: string;
  afterUpdate?: TUpdateMiddleware[];
  beforeUpdate?: TUpdateMiddleware[];
  currentState?: number;
  stateStorage?: TState[];
  defaultDeep?: boolean;
  maxHistorySize?: number;
  state?: TState;
}
interface ISubstate<TState extends TUserState = TUserState> extends IPubSub {
  name?: string;
  afterUpdate: TUpdateMiddleware[];
  beforeUpdate: TUpdateMiddleware[];
  currentState: number;
  stateStorage: TState[];
  defaultDeep: boolean;
  maxHistorySize: number;
  taggedStates: Map<string, { stateIndex: number; state: TState }>;
  // methods
  getState(index: number): TState;
  getCurrentState(): TState;
  getProp(prop: string): unknown;
  resetState(): void;
  updateState(action: Partial<TState>): void;
  sync(config: TSyncConfig): ISyncInstance;
  clearHistory(): void;
  limitHistory(maxSize: number): void;
  getMemoryUsage(): { stateCount: number; taggedCount: number; estimatedSizeKB: number | null };
  getTaggedState(tag: string): TState | undefined;
  getAvailableTags(): string[];
  jumpToTag(tag: string): void;
  removeTag(tag: string): void;
  clearTags(): void;
  // getters and setters
  hasMiddleware: boolean;
  hasTaggedStates: boolean;
}

export type { ISubstate, ISubstateConfig, ISyncInstance };
