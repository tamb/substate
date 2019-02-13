var substate = require('./index.js');


const t = new substate({
    defaultDeep: true,
    state: {
        name: 'Thomas',
        timeOfFun: new Date(),
        nested: {
            double: {
                reason: 'Just the start'
            }
        }
    }
});

console.log('INITIAL T:', t.getCurrentState());

t.emit('UPDATE_STATE', {'nested.double.reason': 'now the end!'});
console.log('SECOND T:', t.getCurrentState());



const b = new substate({
    state: {
        name: 'Thomas',
        timeOfFun: new Date(),
        nested: {
            double: {
                reason: 'Just the start'
            }
        }
    }
});

console.log('INITIAL B:',b.getCurrentState());

b.emit('UPDATE_STATE', {'nested.double.reason': 'now the end!', $deep: true});
console.log('SECOND B:', b.getCurrentState());
console.log('STATE ONE', b.stateStorage[0]);
console.log('STATE TWO', b.stateStorage[1])