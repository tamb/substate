/**
 * Created by root on 6/30/17.
 */
import notifyButtons from './components/_notifyButtons.js';
import header from './components/_header.js';
import clicks from './components/_totalClicks.js';
import username from './components/_userName.js';
import altToggle from './components/_altToggle.js';
import fyiModal from './components/_fyiModal.js';



const config = {
    name: 'Profile_App',
    logic: {
        name: 'Profile_Logic',
        init: function(ref) {

            ref.State.on('CHOSEN_BUTTON', function(f){
                console.log('Tom ', f);
            });
            //
            //logic for processing a click
            var processClick = function(data) {
                if (data) {
                    var obj = {};
                    obj.type = data.type;
                    obj.currentButton = data.data;
                    obj.buttonClicks = parseInt(appStuff.State.getProp('buttonClicks') + 1);

                    if (ref.State.getProp('countAltAmount')) {
                        obj.someClick = parseInt(appStuff.State.getProp('someClick') + 1);
                    }

                    if (obj.buttonClicks % 3 > 0) {
                        obj.headerColor = 'red';
                    } else {
                        obj.headerColor = 'blue';
                    }

                    appStuff.Logic.emit('UPDATE_STATE', obj);
                }
            }

            //
            //logic for processing a name change
            var processName = function(data) {

                data.firstName = data.data;
                appStuff.Logic.emit('UPDATE_STATE', data);
            }

            var processCheck = function(data) {

                var obj = {};
                obj.countAltAmount = data.target.checked;
                console.log('in process check: ', obj);
                ref.Logic.emit('UPDATE_STATE', obj);
            }

            var processNoShow = function(data) {
                var obj = {};
                obj.showFYIModal = data;
                ref.Logic.emit('UPDATE_STATE', obj);
            }


            ref.Element.on('NOTIFY_BUTTON_CLICK', processClick.bind(this));
            ref.Element.on('USERNAME_CHANGE', processName.bind(this));
            ref.Element.on('ALT_COUNT_TOGGLE', processCheck.bind(this));
            ref.Element.on('FYI_NOSHOW_CLICKED', processNoShow.bind(this));

        }
    },
    stateConfig: {
        name: 'Profile_State',
        state: {
            currentButton: 'You have not clicked a button',
            buttonClicks: 0,
            headerColor: 'blue',
            firstName: 'Thomas',
            someClick: 0,
            countAltAmount: true,
            showFYIModal: true

        }
//        ,
//        saveOnChange: true,
//        pullFromLocal: true

    },
    element: {
        name: 'Profile_Elements',
        init: function(ref) {

            this.notifyButtons;
            this.header;
            this.clicks = [];
            this.username;
            this.altToggle;
            this.fyiModal;
            this.currentState = ref.State.getCurrentState();


            var that = this;

            document.addEventListener('DOMContentLoaded', function() {
                that.notifyButtons = new notifyButtons(ref); //wire-up components;
                that.header = new header(ref);
                Array.prototype.slice.call(document.querySelectorAll('.js-button-clicks')).forEach(function(el) {
                    that.clicks.push(new clicks(ref, el.getAttribute('data-state'), el))
                });
                that.username = new username(ref);
                that.altToggle = new altToggle(ref, that.currentState);
                that.fyiModal = new fyiModal(ref);
            });
        }
    }
};
export default config;