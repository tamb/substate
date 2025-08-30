import type { IState } from '../Substate.interface';
import { requiresByString } from './requiresByString';

function canUseFastPath(action: Partial<IState> & IState) {
  let result = true;
  const keys = Object.keys(action);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (requiresByString(key) || key === '$deep' || key === '$type' || key === '$tag') {
      result = false;
      break;
    }
  }
  return result;
}

export { canUseFastPath };
