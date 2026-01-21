import { createStore, type TUserState } from 'substate';

interface ICounterState extends TUserState {
    count: number;
    multipliedCount: number;
    isMultiplierEven: boolean;
}

const store = createStore<ICounterState>({
    name: 'counter',
    state: {
        count: 0,
        multipliedCount: 0,
        isMultiplierEven: false,
    },
    afterUpdate: [
        (store: any, action: Partial<ICounterState>) => {
            // Compute derived values after any state update
            const currentState = store.getCurrentState();
            const count = currentState.count;
            
            // Only update if count actually changed
            if (action.count !== undefined) {
                const multiplied = count * 3;
                const isMultiplierEven = multiplied % 2 === 0;
                
                // Update derived values in the same state update
                store.updateState({
                    multipliedCount: multiplied,
                    isMultiplierEven,
                    $type: 'DERIVED_UPDATE'
                });
            }
        }
    ]
});

export {
    store,
}