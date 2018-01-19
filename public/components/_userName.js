function UserName(ref){
	var that = this;
	this.el = document.querySelector('.js-username');

	this.render = function(){
		that.el.value = ref.State.getProp('firstName');
	}

	this.el.addEventListener('keyup', function(e){
		ref.Element.emit('USERNAME_CHANGE', ref.Element.action('NEW_NAME', e.target.value))
	});

	this.el.addEventListener('change', function(e){
		ref.Element.emit('USERNAME_CHANGE', ref.Element.action('NEW_NAME', e.target.value))
	});

	ref.State.on('NEW_NAME', this.render);

	this.render();

}

export default UserName;