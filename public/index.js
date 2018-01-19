import NeState from './appData/appData.js';
import config from './config.js';



//
//ultimately you need to do three things:
//  call [appInstance].Element.emit()
//  handle those in Logic ( via [appInstance].Element.on() ) and pass to State ( via [appInstance].Logic.emit('CHANGE')  -- you can write shortcuts for this )
//  handle in document ( via [appInstance].State.on('CHANGE', [handler]); )

//
//config IS WHAT IS NEEDED TO SET ALL THIS UP.


//
//THIS IS WHAT THE DEVELOPER IS RESPONSIBLE FOR
console.log(NeState);
var appStuff = new NeState(config);

window.appStuff = appStuff;


document.addEventListener('click', function(e) {
    appStuff.Element.emit('DOCUMENT_CLICK', appStuff.Element.action('document-click', e.screenX));
});


appStuff.State.on('CHANGE', function(action) {
    switch (action.type) {
        case 'document-click':
            document.getElementById('username').value = action.data;
            break;

        default:
            console.log('hit default')

    }
});