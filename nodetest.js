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

console.log(t.getCurrentState())