/**
 * Created with JetBrains WebStorm.
 * User: sprying
 * Date: 1/11/14
 * Time: 11:17 PM
 * To change this template use File | Settings | File Templates.
 */
setTimeout(function(){
    $('#LELE_ShowDIV_UNIONtop').off('click').off('keydown').off('keypress').remove();
    $('#LELE_ShowDIV_UNIONtop').off('click').off('keydown').off('keypress').remove();
    $('[id*="__lgUnion_a"]').remove();
    $(document).off('keydown').off('keypress').off('keyup');
    document.onkeydown = document.onkeypress = document.onkeyup =null;
    window.onerror = function(){
        return false;
    }
    function getDomainFromUrl(url){
        var host = "null";
        if(typeof url == "undefined" || null == url)
            url = window.location.href;
        var regex = /.*\:\/\/([^\/]*).*/;
        var match = url.match(regex);
        if(typeof match != "undefined" && null != match)
            host = match[1];
        return host;
    }
    var url = document.location.url;
    url = getDomainFromUrl(url);
//    if(url == "play.baidu.com"){
//        var scr = document.getElementsByTagName('script');
//        var s = scr[scr.length-1];
//        s.parentNode.removeChild(s);
//        var s = scr[scr.length-1];
//        s.parentNode.removeChild(s);
//    }
},100);