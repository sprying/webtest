var Leaker = function(){};

Leaker.prototype = {
    init:function(){
        console.log("Leaking an object: %o", this);
    },

    destroy: function(){

    }
};