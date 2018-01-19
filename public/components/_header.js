export default function(refToBS) {

    var BS = refToBS;
    var that = this;
    this.root;



    this.render = function(s) {
        console.log('in render ', s);
        that.root.innerText = BS.State.getProp('currentButton');
        that.root.style.color = BS.State.getProp('headerColor');
    }

    this.init = function() {
        that.root = document.querySelector('.js-header');
        this.render();
    }

    this.init();
    BS.State.on('CHOSEN_BUTTON', this.render);

}