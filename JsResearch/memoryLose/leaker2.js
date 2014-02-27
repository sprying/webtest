var Leaker = function(){};

Leaker.prototype = {
    init:function(name, parent){
        this._name = name;
        this._parent = parent;
        this._child = null;
        this.createChildren();
    },

    createChildren:function(){
        if(this._parent !== null){
            // Only create a child if this is the root
            return;
        }
        this._child = new Leaker();
        this._child.init("leaker 2", this);
    },

    destroy: function(){

    }
};