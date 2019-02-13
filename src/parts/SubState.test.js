import substate from './SubState';

/**
 * test that $type works
 */

const NAME = 'MyName';
const STATE = {
    name: 'Thomas',
    timeOfFun: new Date(),
    nested: {
        double: {
            reason: 'Just the start'
        }
    }
};

const A = new substate({
    defaultDeep: true,
    state: STATE
});

const B = new substate({
    name: NAME,
    state: STATE
});

/** initialization tests */
test('creates new instance of substate', ()=>{
    expect(A instanceof substate).toBe(true);
});

test('events to contain UPDATE_STATE on initialization', ()=>{
    expect(A.events.UPDATE_STATE).toHaveLength(1);
});

test('get props to return correct value', ()=>{
    expect(A.getProp('nested.double.reason')).toBe('Just the start');
});

test('getCurrentState returns current state', ()=>{
    expect(A.getCurrentState()).toMatchObject(STATE);
    A.emit('UPDATE_STATE', {timeOfFun: new Date()});
    expect(A.getCurrentState()).not.toMatchObject(STATE);
});

test('getState returns correct state from array', ()=>{
    expect(A.getState(0)).toMatchObject(STATE);
});

test('deep clonse works and does not alter older nested state',()=>{
    const NEWTEXT = 'This has changed';
    A.emit('UPDATE_STATE', {'nested.double.reason': NEWTEXT});
    expect(A.getState(0)).not.toBe(NEWTEXT);
});

test('callback fires for custom $type', ()=>{
    const myMock = jest.fn();
    const DATEUPDATED = 'DATE_UPDATED';
    A.on(DATEUPDATED, myMock);
    A.emit('UPDATE_STATE', {timeOfFun: new Date(), $type: DATEUPDATED});
    expect(myMock).toBeCalled();
});

test('callback for custom $type contains correct $type value', ()=>{
    const myMock = jest.fn();
    const DATEUPDATED = 'DATE_UPDATED';
    A.on(DATEUPDATED, myMock);
    A.emit('UPDATE_STATE', {timeOfFun: new Date(), $type: DATEUPDATED});
    expect(A.getProp('$type')).toBe(DATEUPDATED);
});