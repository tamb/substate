import SubState from 'substate';

const options = {
    name: 'myInstance', //name of Substate instance, name it like a variable
    currentState: 0,//start the current state at this index in the stateStorage
    stateStorage: null, // the entire array of state as it progressed
    saveOnChange: false,//this will save the state to localstorage
    pullFromLocal: false,//this will pull the currentState from the localStorage
    state: {count1: 0, count2: 0}//state to initialize the instance with
};

const mySubStateInstance = new SubState(options);

mySubStateInstance.init();


$('#button-1').click(function(){
    mySubStateInstance.emit('UPDATE_STATE', {count1: ++mySubStateInstance.getProp('count1')});
});

$('#button-2').click(function(){
    mySubStateInstance.emit('UPDATE_STATE', {type: 'CUSTOM_EVENT', count2: (mySubStateInstance.getProp('count2') +1)});
});

mySubStateInstance.on('STATE_UPDATED', updateView1);
mySubStateInstance.on('CUSTOM_EVENT', updateView2);


function updateView1(state){
    $('#view-my-count-1').text(state.count1);
}
function updateView2(state){
    $('#view-my-count-2').text(state.count2);
}

