import SubState from './SubState';

const sub = new SubState();

test('creates new instance of substate', ()=>{
    expect(sub instanceof SubState).toBe(true);
});

test('events to contain UPDATE_STATE on initialization', ()=>{
    expect(sub.events.UPDATE_STATE).toBe().not(null);
});