import React from 'react';
import { render } from 'react-dom';

export default class AddName extends React.Component{
	constructor(props){
		super(props);

		this.bull = this.props.bull.Element;
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e){
		e.preventDefault();
		var el = document.getElementById('addName');
		var obj = {
			val: el.value
		}
		el.value = "";
		
		this.bull.emit('ADDING_PERSON', obj);
	}

	render(){
		return (

			<div>
				<form onSubmit={this.handleSubmit}>
					<div className="row">
						<fieldset>
							<div className="col-xs-12">
								<legend>
									Add a name
								</legend>
							</div>
							<div className="col-sm-6">
								<div className="form-group">
									<label htmlFor="addName" className="control-label">
										Name:
									</label>
									<input className="form-control" id="addName" type="text"/>
								</div>
							</div>
							<div className="col-sm-6">
								<button className="btn btn-success">
									Add name
								</button>
							</div>
						</fieldset>
					</div>
				</form>
			</div>

		);
	}
}