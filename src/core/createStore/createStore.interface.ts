import type { UpdateMiddleware } from '../Substate/Substate.interface';

interface ICreateStoreConfig<TState extends Record<string, unknown> = Record<string, unknown>> {
  name: string;
  state?: TState;
  defaultDeep?: boolean;
  beforeUpdate?: UpdateMiddleware<TState>[];
  afterUpdate?: UpdateMiddleware<TState>[];
  maxHistorySize?: number;
}

export type { ICreateStoreConfig };
