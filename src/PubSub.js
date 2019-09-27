/**
 * Created by root on 6/27/17.
 */
export default class PubSub{
    constructor(){
        this.events = {};

    }

    on(eventName, fn){

        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);

    }

    off(eventName, fn) {
        if (this.events[eventName]) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    }

    emit(eventName, data) {
        console.log('in emit: ', data);
        if (this.events[eventName]) {
            this.events[eventName].forEach(function(fn, i) {
                console.log(i, eventName, data);
                fn(data);
            });
        }
    }

};