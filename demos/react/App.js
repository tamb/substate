import React, { Component } from 'react';

import AppState from './state';
import Counter from './Counter';

class App extends Component {

    constructor(props){
        super(props);

        AppState.on('STATE_UPDATED', (ns)=>this.setState(ns));
        this.handleClick = this.handleClick.bind(this);
    }

    

    handleClick(){
        console.log('in handle click')
        AppState.emit('UPDATE_STATE', {
            clicks: (AppState.getProp('clicks') + 1)
        });
    }


    render() {
        return (
            <div>
                Hello World!
                <div>
                    <Counter handleClick={this.handleClick}/>
                </div>
            </div>
        );
    }
}

export default App;
