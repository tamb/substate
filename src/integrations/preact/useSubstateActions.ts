import { useMemo } from 'preact/hooks';
import type { TUserState } from '../../core/Substate/interfaces';
import type { ISubstate } from '../../core/Substate/Substate.interface';

import type { SubstateActions } from './types';

// Simple state type alias
type State = TUserState;

/**
 * Preact hook that returns all Substate store methods bound to the provided store
 *
 * @param store - The Substate store instance
 * @returns Object containing all bound store methods
 *
 * @example
 * const {
 *   updateState,
 *   resetState,
 *   jumpToTag,
 *   clearHistory,
 *   sync
 * } = useSubstateActions(store);
 *
 * // Use the actions
 * updateState({ count: count + 1 });
 * jumpToTag('checkpoint-1');
 */
export function useSubstateActions<TState extends State = State>(
  store: ISubstate<TState>
): SubstateActions<TState> {
  return useMemo(
    () => ({
      // Core state methods
      updateState: store.updateState.bind(store),
      resetState: store.resetState.bind(store),
      getCurrentState: store.getCurrentState.bind(store),
      getState: store.getState.bind(store),
      getProp: store.getProp.bind(store),

      // History management
      clearHistory: store.clearHistory.bind(store),
      limitHistory: store.limitHistory.bind(store),
      getMemoryUsage: store.getMemoryUsage.bind(store),

      // Tagged states
      jumpToTag: store.jumpToTag.bind(store),
      getTaggedState: store.getTaggedState.bind(store),
      getAvailableTags: store.getAvailableTags.bind(store),
      removeTag: store.removeTag.bind(store),
      clearTags: store.clearTags.bind(store),

      // Sync functionality
      sync: store.sync.bind(store),

      // Event methods (from PubSub)
      on: store.on.bind(store),
      off: store.off.bind(store),
      emit: store.emit.bind(store),
    }),
    [store]
  );
}
