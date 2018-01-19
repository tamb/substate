import React from 'react';
import { render } from 'react-dom';

import config from './react-config.js';
import Bull from '../appData/appData.js';
import App from './components/_App.js';

var AppState = new Bull(config);

window.reactState = AppState;

render(<App appState={AppState}/>,document.getElementById('root'));