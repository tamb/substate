import type { TUserState } from '../interfaces';
import type { ISubstate } from '../Substate.interface';

function checkForFastPathPossibility(storeInstance: ISubstate, action: Partial<TUserState>) {
  return (
    !storeInstance.hasMiddleware && !action.$deep && !action.$tag && !storeInstance.hasTaggedStates
  );
}

export { checkForFastPathPossibility };
