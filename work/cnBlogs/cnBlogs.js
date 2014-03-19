~function($,undefined){
    var body = $('.postBody');
    body.length && body[0].parentNode.insertBefore($('.postDesc')[0],body[0]);
    // weibo
    $("html").attr("xmlns:wb", "http://open.weibo.com/wb");
    $("head").append('<script src="http://tjs.sjs.sinajs.cn/open/api/js/wb.js" type="text/javascript" charset="utf-8"></script>');
    (function(){
        var funRef = arguments.callee;
        if(!$("#weiboLink").length){
            setTimeout(funRef,16);
        }else{
            $("#weiboLink").css("display", "none").after('<wb:follow-button uid="1678996537" type="red_1" width="67" height="24" style="vertical-align: middle;display: inline-block;"></wb:follow-button>');
        }
    })();
}(jQuery);