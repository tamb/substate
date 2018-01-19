/**
 * Created by root on 6/30/17.
 */
import PubSub from './PubSub.js';

export default class Element extends PubSub{
    constructor(obj){
      super();
      
        if(/\s/.test(obj.name)){
            console.warn('|(\'0\')|: Your name has spaces in it!  Please use POJO key nameing conventions!'); 
        } else {
            this.name = obj.name || console.warn('|(\'0\')|: Please pass in a name for this PubSub instance. This will greatly help with debugging later.  If you are not concerned about this, maybe you don\'t need this bulls%!t?');
       
        }
        this.init = obj.init || console.warn('|(\'0\')|: There is no init for your element.executions config!  Maybe you don\'t need this bulls%!t?');
    }

    action(type, obj){
        if(type) {
           return {
               type: type,
               data: obj
           }
        } else {
            console.error('|(\'0\')|: Your action has no [type]!  Please fix this bulls%!t!');
        }
    }
}