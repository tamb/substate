import React from 'react';
import { render } from 'react-dom';

import NameChanger from './_NameChanger.js';
import AddName from './_AddName.js';


export default class App extends React.Component{
	constructor(props){
		super(props);

		this.state=this.props.appState.State.getCurrentState();
		this.bull = this.props.appState;

		this.updateName = this.updateName.bind(this);
		this.updateState = this.updateState.bind(this);
		this.removePerson = this.removePerson.bind(this);
		this.addPerson = this.addPerson.bind(this);
	}

	componentDidMount(){
		this.bull.Element.on('UPDATING_NAME', this.updateName);//kick off logic
		this.bull.Element.on('REMOVING_PERSON', this.removePerson);
		this.bull.Element.on('ADDING_PERSON', this.addPerson);

		this.bull.State.on('NAME_CHANGED', this.updateState);//kick off set state
		this.bull.State.on('PERSON_REMOVED', this.updateState);
		this.bull.State.on('PERSON_ADDED', this.updateState);
		
	}

	addPerson(data){
		console.log('ADD_PERSON: ', data);

		var obj = {
			type: 'PERSON_ADDED', 
			$ADD: {
				'people': {
					name: data.val
				}
			}
		};

		

		this.bull.Logic.emit('UPDATE_STATE', obj);
	}
	removePerson(data){

		//*OLD REMOVE*
		// var obj = {
		// 	type: 'PERSON_REMOVED'
		// }; 
		// obj['people.'+data.idx] = '$REMOVE';

		var obj = {
			type: 'PERSON_REMOVED',
			$REMOVE: [('people.'+data.idx)]
		};
		
		this.bull.Logic.emit('UPDATE_STATE', obj);

	}


	updateState(data){
		console.log('from Bull instance State: ',data)
		
		console.timeEnd('updateName')
		this.setState(data);
	}

	updateName(data){

		console.log(data);

		var key = 'people'+data.idx;

		var obj = {
			type: 'NAME_CHANGED'
		}; 
		obj['people.'+data.idx+'.name'] = data.val;
		console.log('from logic: ', obj);

		console.time('nameUpdate')
		this.bull.Logic.emit('UPDATE_CHUNK', obj);
	}

	render(){
		return (

			<div className="container">
				<div className="row">
					<div className="col-xs-12">
						<h1>
							Bull with React
						</h1>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12">
						<AddName bull={this.bull}/>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12">
						<div className="jumbotron">
							There are {this.state.people.length} people in this list
						</div>
					</div>
				</div>

				<div className="row">
					{this.state.people.map((cVal, cIndx)=>{
						
						return (
						
							<NameChanger key={cIndx} bull={this.bull} peopleIndex={cIndx} name={cVal.name}/>
							
						);
					})}
					
				</div>
			</div>

		)
	}
}