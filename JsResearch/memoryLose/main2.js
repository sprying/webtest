$("#start_button").click(function(){
    if(leak !== null && leak !== undefined){
    }else{
        leak = new Leaker();
        leak.init("leaker 1", null);
    }
});

$("#destroy_button").click(function(){
    leak.destroy();
    leak = null;
});

var leak;