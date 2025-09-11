import { byString } from 'object-bystring';

import { EVENTS } from '../../consts';
import type { TState } from '../interfaces';
import { requiresByString } from './requiresByString';

function tempUpdate(newState: TState, action: Partial<TState>, defaultDeep: boolean): TState {
  const keys = Object.keys(action);

  const directKeys: string[] = [];
  const nestedKeys: string[] = [];

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (requiresByString(key)) {
      nestedKeys.push(key);
    } else {
      directKeys.push(key);
    }
  }

  for (let i = 0; i < directKeys.length; i++) {
    const key = directKeys[i];
    (newState as unknown as TState)[key] = action[key];
  }

  for (let i = 0; i < nestedKeys.length; i++) {
    const key = nestedKeys[i];
    byString(newState, key, action[key]);
  }

  if (!defaultDeep) (newState as TState).$deep = false; // reset $deep keyword
  (newState as TState).$type = action.$type || EVENTS.UPDATE_STATE; // set $type if not already set

  return newState;
}

export { tempUpdate };
