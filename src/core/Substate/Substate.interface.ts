import type { IPubSub } from '../PubSub/PubSub.interface';
import type { TState, TSyncConfig, TUpdateMiddleware } from './interfaces';

interface ISyncInstance {
  unsync: () => void;
}
interface ISubstateConfig<TSubstateState extends TState = TState> {
  name?: string;
  afterUpdate?: TUpdateMiddleware[];
  beforeUpdate?: TUpdateMiddleware[];
  currentState?: number;
  stateStorage?: TSubstateState[];
  defaultDeep?: boolean;
  maxHistorySize?: number;
  state?: TSubstateState;
}
interface ISubstate<TSubstateState extends TState = TState> extends IPubSub {
  name?: string;
  afterUpdate: TUpdateMiddleware[];
  beforeUpdate: TUpdateMiddleware[];
  currentState: number;
  stateStorage: TSubstateState[];
  defaultDeep: boolean;
  maxHistorySize: number;
  taggedStates: Map<string, { stateIndex: number; state: TSubstateState }>;
  // methods
  getState(index: number): TSubstateState;
  getCurrentState(): TSubstateState;
  getProp(prop: string): unknown;
  resetState(): void;
  updateState(action: Partial<TSubstateState>): void;
  sync(config: TSyncConfig): ISyncInstance;
  clearHistory(): void;
  limitHistory(maxSize: number): void;
  getMemoryUsage(): { stateCount: number; taggedCount: number; estimatedSizeKB: number | null };
  getTaggedState(tag: string): TSubstateState | undefined;
  getAvailableTags(): string[];
  jumpToTag(tag: string): void;
  removeTag(tag: string): void;
  clearTags(): void;
  // getters and setters
  hasMiddleware: boolean;
  hasTaggedStates: boolean;
}

export type { ISubstate, ISubstateConfig, ISyncInstance };
