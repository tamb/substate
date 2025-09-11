import type { TState } from '../interfaces';

function isDeep(action: Partial<TState>, defaultDeep: boolean) {
  return action.$deep !== undefined ? action.$deep : defaultDeep;
}

export { isDeep };
