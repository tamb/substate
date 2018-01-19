/**
 * Created by root on 6/27/17.
 */
// Code goes here
function Promise(fn){
    var state = "pending";
    var deferredParam;
    var deferredFunc = null;

    function resolve(newValue){
        deferredParam = newValue;
        state = "resolved";

        if(deferredFunc){
            handle(deferredFunc);
        }
    }

    function handle(handler){
        if(state === "pending"){
            deferredFunc = handler;
            return;
        }

        if(!handler.onResolved){
            handler.resolve(deferredParam);
            return;
        }

        var ret = handler.onResolved(deferredParam);
        handler.resolve(ret);
    }

    this.then = function(onResolved){
        return new Promise(function(resolve){
            handle({
                onResolved: onResolves,
                resolve: resolve
            });
        });
    };

    fn(resolve);

}