$("#start_button").click(function(){
    if(leak !== null && leak !== undefined){
    }else{
        leak = new Leaker();
    }
    leak.init();
});

$("#destroy_button").click(function(){
    leak.destroy();
    leak = null;
});

var leak;