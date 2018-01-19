function AltToggle(ref, currentState) {

    this.el = document.querySelector('.js-alt-toggle');
    this.ref = ref;

    this.el.addEventListener('change', function(e) {
        ref.Element.emit('ALT_COUNT_TOGGLE', e)
    });

    this.render(currentState);
}

AltToggle.prototype.render = function(data) {
    this.el.checked = data.countAltAmount;
}

export default AltToggle;