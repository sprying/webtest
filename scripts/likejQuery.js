/**
 * User: fangyc
 * Date: 13-5-12
 * Time: 上午7:19
 */
/*传入window变量原因：
　　使window变量由全局变量变为局部变量，不需要将作用域链回退到顶层作用域，以便更快的访问window。
在参数列表中增加undefined原因：
　　在自调用匿名函数的作用域内，确保undefined是真的未定义。*/
(function(win,undefined){
    var _Sprying = win.Sprying,
        Sprying = function (){
            return new Sprying.fn.init();
        };
    Sprying.fn = Sprying.prototype = {
        constructor:Sprying,
        Sprying:'0.0.1',
        init:function(){

        },
        test:function(){

        }
    };
    Sprying.fn.init.prototype = Sprying.fn;
    win.$ = win.Sprying
})(window)