import React from 'react';
import { render } from 'react-dom';

export default class NameChanger extends React.Component{

	constructor(props){
		super(props);

		this.nameUpdate = this.nameUpdate.bind(this);
		this.removePerson = this.removePerson.bind(this);
	}

	nameUpdate(e){
		var obj = {
			val: e.target.value,
			idx: this.props.peopleIndex
		};
		this.props.bull.Element.emit('UPDATING_NAME', obj);
	}

	removePerson(){
		var obj = {
			idx: this.props.peopleIndex
		}
		this.props.bull.Element.emit('REMOVING_PERSON', obj);

	}

	render(){
		return (

			<div className="col-lg-3 col-md-4 col-sm-6 person">
				<button onClick={this.removePerson} className="pull-right">
					x
				</button>
				<div className="row">
					<div className="col-xs-12">
						<p className="lead">
							Hello, {this.props.name}
						</p>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12">
						<div className="form-group">
							<label className="control-label">
								Change name:
								
							</label>
							<input className="form-control" onChange={this.nameUpdate}/>
						</div>
					</div>
				</div>
			</div>
		);
	}


}