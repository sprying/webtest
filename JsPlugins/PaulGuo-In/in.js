/*
    ********** In **********
    Project Home: http://injs.org

    Author: Guokai
    Gtalk: badkaikai@gmail.com
    Blog: http://benben.cc
    Licence: MIT License
    Version: 0.2.0-stable

    Philosophy: Just in time.
    Build: 110428120728
*/

~function() {
    var __head = document.head || document.getElementsByTagName('head')[0];
    // 存储所有js文件信息，每条以属性形式存储
    var __waterfall = {};
    // 是否已下载
    var __loaded = {};
    // 下载中
    var __loading = {};
    // 全局要加载资源
    var __globals = [];
    // 全局配置
    var __configure = {autoload: false, core: '', serial: false};
    var __in;

    /**
     * 以异步和无阻塞方式加载js和css文件
     */
    var __load = function(url, type, charset, callback) {
        // 加载失败时
        if(__loading[url]) {
            if(callback) {
                setTimeout(function() {
                    __load(url, type, charset, callback);
                }, 1);
                return;
            }
            return;
        }
        
        if(__loaded[url]) {
            if(callback) {
                callback();
                return;
            }
            return;
        }

        // 加载开始标志
        __loading[url] = true;
        
        var pureurl = url.split('?')[0];
        var n, t = type || pureurl.toLowerCase().substring(pureurl.lastIndexOf('.') + 1);
        
        if(t === 'js') {
            n = document.createElement('script');
            n.type = 'text/javascript';
            n.src = url;
            n.async = 'true';
            if(charset) {
                n.charset = charset;
            }
        } else if(t === 'css') {
            n = document.createElement('link');
            n.type = 'text/css';
            n.rel = 'stylesheet';
            n.href = url;
            __loaded[url] = true;
            __loading[url] = false;
            __head.appendChild(n);
            if(callback) callback();
            return;
        }

        // 绑定事件，事件以异步方式执行
        n.onload = n.onreadystatechange = function() {
            // 加载成功后
            if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                __loading[url] = false;
                __loaded[url] = true;
                console.log(url +',end:'+ (new Date))

                // 回调函数一般为下 轮要加载的js
                if(callback) {
                    callback();
                }
                
                n.onload = n.onreadystatechange = null;
            }
        };

        // 报错时，自动调用
        n.onerror = function() {
            __loading[url] = false;
            
            if(callback) {
                callback();
            }
            
            n.onerror = null;
        }
        // script添加文档后才开始加载
        __head.appendChild(n);
        console.log(url +',start:'+ (new Date))
    };
    
    /**
     * 分析依赖关系，会被"串行异步加载"调用
     *
         传入数组
         5,6,1,2,7,8

         元素间的依赖关系
         5
         6 1,2
         7 5
         8 7,6
         最终返回数组，其中包含递归调用
         [8,6,2,1,7,5,7,5,6,2,1]
     * @param array
     * @returns {Array}
     * @private
     */
    var __analyze = function(array) {
        var riverflow = [];

        for(var i = array.length-1; i >= 0; i--) {
            var current = array[i];

            if(typeof(current) === 'string') {
                if(!__waterfall[current]) {
                    console && console.warn && console.warn('In Error :: Module not found: ' + current);
                    continue;
                }

                riverflow.push(current);
                var relylist = __waterfall[current].rely;

                if(relylist) {
                    riverflow = riverflow.concat(__analyze(relylist));
                }
            } else if(typeof(current) === 'function') {
                riverflow.push(current);
            }
        }
        return riverflow;
    };
    
    /**
     * 串行异步加载
     * 会按顺序返回每个函数执行结果
     * @param blahlist 经过依赖函数处理的数组
     * @private
     */
    var __stackline = function(blahlist) {
        var o = this;

        this.stackline = blahlist;
        // 当前要加载的文件或函数
        this.current = this.stackline[0];
        // 返回的结果包
        this.bag = {returns: [], complete: false};

        this.start = function() {
            if(typeof(o.current) != 'function' && __waterfall[o.current]) {
                __load(__waterfall[o.current].path, __waterfall[o.current].type, __waterfall[o.current].charset, o.next);
            } else {
                // 执行函数，将结果压入结果包中
                o.bag.returns.push(o.current());
                o.next();
            }
        };

        this.next = function() {
            // 开始执行缓存数组中函数
            if(o.stackline.length == 1 || o.stackline.length < 1) {
                o.bag.complete = true;
                // 执行加载结束回调函数
                if(o.bag.oncomplete) {
                    o.bag.oncomplete(o.bag.returns);
                }
                return;
            }
            // 取出待加载数组中最前面元素
            o.stackline.shift();
            o.current = o.stackline[0];
            o.start();
        };
    };
    
    /**
     * 并行异步加载
     * @param {array}blahlist  待加载数组
     * @param callback 回调
     * @private
     */
    var __parallel = function(blahlist, callback) {
        var length = blahlist.length;
        // 每次调用时，length都自减1，直到当前待加载没有了，再执行回调函数
        var hook = function() {
            if(!--length && callback) callback();
        };

        // 如果待加载数组一开始就为空，就直接执行
        if(length == 0) {
            callback && callback();
            return;
        };

        // 循环执行待加载数组，这就是所谓并行产生地方
        for(var i = 0; i < blahlist.length; i++) {
            var current = __waterfall[blahlist[i]];
            
            if(typeof(blahlist[i]) == 'function') {
                blahlist[i]();
                hook();
                continue;
            }

            if(typeof(current) === 'undefined') {
                console && console.warn && console.warn('In Error :: Module not found: ' + blahlist[i]);
                hook();
                continue;
            }
            // 有依赖关系，就先执行依赖：把当前待加载的元素放到加载依赖函数的回调中
            if(current.rely && current.rely.length != 0) {
                __parallel(current.rely, (function(current) {
                    return function() {
                        __load(current.path, current.type, current.charset, hook);
                    };
                })(current));
            } else {
                __load(current.path, current.type, current.charset, hook);
            }
        }
    };
    
    // 添加待加载资源模板
    var __add = function(name, config) {
        if(!name || !config || !config.path) return;
        //添加到
        __waterfall[name] = config;
    };
    
    //添加多个待加载资源模板
    var __adds = function(config) {
        if(!config.modules) return;

        for(var module in config.modules) {
            if(config.modules.hasOwnProperty(module)) {
                var module_config = config.modules[module];

                // 这句重复
                if(!config.modules.hasOwnProperty(module)) continue;
                if(config.type && !module_config.type) module_config.type = config.type;
                if(config.charset && !module_config.charset) module_config.charset = config.charset;
                __add.call(this, module, module_config);
            }
        }
    };
    
    /**
     * 配置函数，对外暴露
     */
    var __config = function(name, conf) {
        __configure[name] = conf;
    };
    
    /**
     * 在页面中动态插入内联css样式
     * @param csstext
     * @private
     */
    var __css = function(csstext) {
        var css = document.getElementById('in-inline-css');
        
        if(!css) {
            css = document.createElement('style');
            css.type = 'text/css';
            css.id = 'in-inline-css';
            __head.appendChild(css);
        }
        
        if(css.styleSheet) {
            css.styleSheet.cssText = css.styleSheet.cssText + csstext;
        } else {
            css.appendChild(document.createTextNode(csstext));
        }
    };
    
    /**
     * 延时加载，第一个参数为延时时间，其它参数与_in一样
     * @private
     */
    var __later = function() {
        var args = [].slice.call(arguments);
        var timeout = args.shift();

        window.setTimeout(function() {
            __in.apply(this, args);
        }, timeout);
    };
    
    /**
     * 文档渲染完成再加载
     * @private
     */
    var __ready = function() {
        var args = arguments;

        __contentLoaded(window, function() {
            __in.apply(this, args);
        });
    };
    /**
     * 全局加载资源
     * @private 传入数组或类数组
     */
    var __global = function() {
        // 对传入的参数进行判断，分别处理
        var args = arguments[0].constructor === Array ? arguments[0] : [].slice.call(arguments);

        __globals = __globals.concat(args);
    };
    
    // mapping for `In`
    // This is the main function, also mapping for method `use`.

    var __in = function() {
        var args = [].slice.call(arguments);
        
        if(__globals.length) {
            args = __globals.concat(args);
        }
        // 串行异步加载
        if(__configure.serial) {
            if(__configure.core && !__loaded[__configure.core]) {
                args = ['__core'].concat(args);
            }

            var blahlist = __analyze(args).reverse();
            var stack = new __stackline(blahlist);

            stack.start();
            return stack.bag;
        }
        
        if(typeof(args[args.length-1]) === 'function') {
            var callback = args.pop();
        }
        
        if(__configure.core && !__loaded[__configure.core]) {
            __parallel(['__core'], function() {
                __parallel(args, callback);
            });
        } else {
            __parallel(args, callback);
        }
    };
    
    /**
     * 文档加载完成后执行函数fn ；实现与jQuery内部一样
     */
    var __contentLoaded = function(win,fn) {
        var done = false, top=true,
            doc = win.document, root = doc.documentElement,
            add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
            rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
            pre = doc.addEventListener ? '' : 'on',
            
            init = function(e) {
                if(e.type == 'readystatechange' && doc.readyState != 'complete') return;
                (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                if(!done && (done=true)) fn.call(win, e.type || e);
            },
            
            poll = function() {
                try {root.doScroll('left');} catch(e) {setTimeout(poll, 50);return;}
                init('poll');
            };
        
        if(doc.readyState == 'complete') {
            fn.call(win, 'lazy');
        } else {
            // createEventObject IE8及之前版本
            if(doc.createEventObject && root.doScroll) {
                try {top =! win.frameElement;} catch(e) {}
                if(top) poll();
            }

            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            win[add](pre + 'load', init, false);
        }
    }
    
    /*
     * 引入in.js时就执行，根据判断，
     * 可先加载core里js；后面的js都是异步加载的
     */
    void function() {
        var myself = (function() {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();

        var autoload = myself.getAttribute('autoload');
        var core = myself.getAttribute('core');
        
        if(core) {
            __configure['autoload'] = eval(autoload);
            __configure['core'] = core;
            __add('__core', {path: __configure.core});
        }
        
        // 自动加载core文件
        if(__configure.autoload && __configure.core) {
            __in();
        }
    }();
    
    // Bind the private method to in.

    __in.add = __add;
    __in.adds = __adds;
    __in.config = __config;
    __in.css = __css;
    __in.later = __later;
    __in.load = __load;
    __in.ready = __ready;
    __in.global = __global;
    __in.use = __in;

    this.In = __in;
}();
