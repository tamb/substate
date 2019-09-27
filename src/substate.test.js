const {substate, mergeStores} = require('./substate');

const func1 =jest.fn(x => {
    x.count? x.count = ++x.count : x.count = 1;
});
const func2 =jest.fn(x => {
    x.count2? ++x.count2 : x.count2 = 1;
});

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
    name: 'HamburgerStore',
    defaultDeep: true,
    state: STATE,
    beforeUpdate: [func1],
    afterUpdate: [func2]

});

const B = new substate({
    name: NAME,
    state: STATE
});

/** initialization tests */
test('creates new instance of substate', ()=>{
    expect(A instanceof substate).toBe(true);
});

test('expects store to have name', ()=>{
    expect(A.name).toBe('HamburgerStore');
})

test('events to contain UPDATE_STATE on initialization', ()=>{
    expect(A.events.UPDATE_STATE).toHaveLength(1);
});

test('get props to return correct value', ()=>{
    expect(A.getProp('nested.double.reason')).toBe('Just the start');
});

test('getCurrentState returns current state and fires middleware', ()=>{
    expect(A.getCurrentState()).toMatchObject(STATE);
    A.emit('UPDATE_STATE', {timeOfFun: new Date()});
    expect(A.count).toBe(1);
    expect(A.count2).toBe(1);
    expect(A.getCurrentState()).not.toMatchObject(STATE);
});

test('getState returns correct state from array', ()=>{
    expect(A.getState(0)).toMatchObject(STATE);
});

test('deep clonse works and does not alter older nested state',()=>{
    const NEWTEXT = 'This has changed';
    A.emit('UPDATE_STATE', {'nested.double.reason': NEWTEXT});
    expect(A.count).toBe(2);
    expect(A.count2).toBe(2);
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



// mergeStores tests

const func3 =jest.fn(x => {
    x.count? x.count = ++x.count : x.count = 1;
});
const func4 =jest.fn(x => {
    x.count2? ++x.count2 : x.count2 = 1;
});

const func5 =jest.fn(x => {
    x.count? x.count = ++x.count : x.count = 1;
});
const func6 =jest.fn(x => {
    x.count2? ++x.count2 : x.count2 = 1;
});

const Curly = new substate({
    name: 'Alpha',
    state: {
        stooge: true,
    },
    beforeUpdate: [func5]
});

Curly.on('STATE_UPDATED', func3);

const Papa = new substate({
    name: 'Beta',
    state: {
        smurf: true
    },
    beforeUpdate: [func6]
});

Papa.on('STATE_UPDATED', func4);

const merged = mergeStores([Curly, Papa]);

test('merged stores should have merged state', ()=>{
    expect(merged.getProp('stooge')).toBe(true);
    expect(merged.getProp('smurf')).toBe(true);
});

test('merged stores should retain subscriptions', ()=>{
    expect(merged.events.STATE_UPDATED.length).toBe(2);
});

test('merged middleware will be called', ()=>{
    merged.emit('UPDATE_STATE', {stooge: false});
    expect(func3.mock.calls.length).toBe(1);
    expect(func4.mock.calls.length).toBe(1);
    expect(func5.mock.calls.length).toBe(1);
    expect(func6.mock.calls.length).toBe(1);

});

test('merged events will be called', ()=>{
    merged.emit('UPDATE_STATE', {smurf: false});
    expect(func3.mock.calls.length).toBe(2);
    expect(func4.mock.calls.length).toBe(2);
    expect(func5.mock.calls.length).toBe(2);
    expect(func6.mock.calls.length).toBe(2);
});

test('merged state has been updated', ()=>{
    expect(merged.getProp('stooge')).toBe(false);
    expect(merged.getProp('smurf')).toBe(false);
})

