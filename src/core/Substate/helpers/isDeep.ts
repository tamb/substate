import type { TUserState } from '../interfaces';

function isDeep(action: Partial<TUserState>, defaultDeep: boolean) {
  return action.$deep !== undefined ? action.$deep : defaultDeep;
}

export { isDeep };
