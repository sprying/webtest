(function(){
    var _exports = [],
        index = 0;
    function define(fn){
        var exports = _exports[index++];
        var __head = document.head || document.getElementsByTagName('head')[0];
        var request = function(filePath){
            _exports[filePath]= exports;
            if(!_exports[filePath]){
                return _exports[filePath];
            }
            var n = document.createElement('script');
            n.type = 'text/javascript';
            n.src = filePath;
            n.onload = n.onreadystatechange = function() {
                // 加载成功后
                if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {

                }
            }
            __head.appendChild(n);
            return arguments.callee.call(null,arguments);
        };
        var str = fn.toString(),
            res = str.match(/request\(([\w]+)\w/);

        fn.call(null,request,exports);
    }
})()









