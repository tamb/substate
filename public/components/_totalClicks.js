function TotalClicks(bull, field, el){

	var that = this;
	this.buttonClicks = el;

	this.render = function(){
		that.buttonClicks.innerText = bull.State.getProp(field).toString();
	}

	bull.State.on('CHOSEN_BUTTON', this.render);

	this.render();
}
export default TotalClicks;