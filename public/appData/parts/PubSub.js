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
        if (this.events[eventName]) {
            this.events[eventName].forEach(function(fn) {
                fn(data);
            });
        }
    }

    react(eventName, data, fn){
      this.events[eventName] = this.events[eventName] || [];  
      this.events[eventName].push(fn);

      if (this.events[eventName]) {
        this.events[eventName].forEach(function(fn) {
          fn(data);
        });
      }

    }

    reactOnce(eventName, data, fn){

      this.events[eventName] = this.events[eventName] || [];
      this.events[eventName].push(fn);
      
      if (this.events[eventName]) {

        var array = this.events[eventName].sort().filter(function(item, pos, ary) {
          return !pos || item != ary[pos - 1];
        });

        array.forEach(function(fn) {
          fn(data);
        });

      }
    
    }

};