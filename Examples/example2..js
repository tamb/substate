import SubState from 'substate';

const options = {
    name: 'myInstance', //name of Substate instance, name it like a variable
    currentState: 0,//start the current state at this index in the stateStorage
    stateStorage: null, // the entire array of state as it progressed
    saveOnChange: false,//this will save the state to localstorage
    pullFromLocal: false,//this will pull the currentState from the localStorage
    state: {count: 0, howManyCounts: 1}//state to initialize the instance with
};

const mySubStateInstance = new SubState(options);

mySubStateInstance.init();


mySubStateInstance.on('STATE_UPDATED', showCount);


function showCount(){
    setTimeout(function(){

        if(mySubStateInstance.getProp('count') >= 10){
            console.log(mySubStateInstance.getProp('count'), ' ', mySubStateInstance.getProp('howManyCounts'));
            mySubStateInstance.emit('UPDATE_STATE', {count: 0, howManyCounts: ( mySubStateInstance.getProp('howManyCounts') +1 ) });
        } else {
            console.log(mySubStateInstance.getProp('count'));
            mySubStateInstance.emit('UPDATE_STATE', {count: (mySubStateInstance.getProp('count')+1)});
        }

    }, 1000);

}