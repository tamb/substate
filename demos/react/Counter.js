import React, {Component} from 'react';
import AppState from './state';

// const addProps = specialProps => Wrapped => props => <Wrapped {...specialProps} {...props} />
// const withSpecialProps = addProps({ clicks: 10, name: 'Danny' })
// const SpecialCount = withSpecialProps(Counter)
// <SpecialCount name="Nanny" />

const mapToProps = (state, chunk)=> Comp => props =>{
    const newProps = {};
    for (let key in chunk){
        newProps[key] = state.getProp(chunk[key]);
    }
    return (<Comp {...newProps} {...props} />)
};

const Counter = (props) => {
    console.log('PROPS on I:', props)
    return (
        <div>
            clicks: {props.clicks}
            <button onClick={props.handleClick}>
                +
            </button>
        </div>
    );
}

export default mapToProps(AppState, {clicks: 'clicks'})(Counter);