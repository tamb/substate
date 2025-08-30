import type { IState, ISubstate } from '../Substate.interface';

function checkForFastPathPossibility(
  storeInstance: ISubstate<IState>,
  action: Partial<IState> & IState
) {
  return (
    !storeInstance.hasMiddleware &&
    !action.$deep &&
    action.$tag === undefined &&
    !storeInstance.hasTaggedStates
  );
}

export { checkForFastPathPossibility };
