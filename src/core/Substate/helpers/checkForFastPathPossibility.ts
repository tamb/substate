import type { TState } from '../interfaces';
import type { ISubstate } from '../Substate.interface';

function checkForFastPathPossibility(storeInstance: ISubstate, action: Partial<TState>) {
  return (
    !storeInstance.hasMiddleware && !action.$deep && !action.$tag && !storeInstance.hasTaggedStates
  );
}

export { checkForFastPathPossibility };
