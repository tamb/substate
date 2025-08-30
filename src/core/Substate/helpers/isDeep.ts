import type { IState } from '../Substate.interface';

function isDeep(action: Partial<IState> & IState, defaultDeep: boolean) {
  return action.$deep !== undefined ? action.$deep : defaultDeep;
}

export { isDeep };
