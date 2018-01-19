/**
 * Created by root on 6/30/17.
 */

function NotifyButtons(refToBS){
    var BS = refToBS;
    this.notifyButtons = Array.prototype.slice.call(document.querySelectorAll('.js-notify-btns'));

    this.notifyButtons.forEach(function(cVal, cIndex, cArr){
        cVal.addEventListener('click', function(e){
            BS.Element.emit('NOTIFY_BUTTON_CLICK', BS.Element.action( 'CHOSEN_BUTTON', e.target.innerText ));
        });
    });


    this.notify = function(obj){
        if(obj.type == "click-on-button") {
            alert(obj.data);
        }
    };

    

}

export default NotifyButtons