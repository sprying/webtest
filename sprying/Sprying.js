;
/**
 * Sprying框架原型
 * 为了练习正则表达式，在实现选择器时绕了些弯路
 * 2013年4月15日7:36:52 添加文档渲染完成后要执行的函数
 * 2013年4月17日20:56:59 each原型方法的回调返回false时，就停止循环
 * 2013年4月19日7:30:09 添加isFunction判断、类数组转换数组toArray
 * 2013年4月27日13:18:53 解决IE8下兼容问题
 * 2013年4月28日8:23:32 解决IE7兼容模式下，选择器问题
 * 2013年5月6日6:35:47 解决文档渲染完成的多次调用（$(function(){})），并按序执行
 * 2013年5月11日0:22:31 解决Sprying.isArray类似工具函数无法调用问题；新增extend方法
 */
(function () {
    var AP = Array.prototype,
        OP = Object.prototype;
    var slice = AP.slice;
    Array.isArray || (Array.isArray = function(obj) {
        return OP.toString.call(obj) === '[object Array]';
    });
    AP.forEach || (AP.forEach = function(fn, context) {
        for (var i = 0, len = this.length >>> 0; i < len; i++) {
            if (i in this) {
                fn.call(context, this[i], i, this);
            }
        }
    });
    AP.map || (AP.map = function(fn, context) {
        var len = this.length >>> 0;
        var result = new Array(len);

        for (var i = 0; i < len; i++) {
            if (i in this) {
                result[i] = fn.call(context, this[i], i, this);
            }
        }

        return result;
    });
    AP.filter || (AP.filter = function(fn, context) {
        var result = [], val;

        for (var i = 0, len = this.length >>> 0; i < len; i++) {
            if (i in this) {
                val = this[i]; // in case fn mutates this
                if (fn.call(context, val, i, this)) {
                    result.push(val);
                }
            }
        }

        return result;
    });
    AP.every || (AP.every = function(fn, context) {
        for (var i = 0, len = this.length >>> 0; i < len; i++) {
            if (i in this && !fn.call(context, this[i], i, this)) {
                return false;
            }
        }
        return true;
    });
    AP.some || (AP.some = function(fn, context) {
        for (var i = 0, len = this.length >>> 0; i < len; i++) {
            if (i in this && fn.call(context, this[i], i, this)) {
                return true;
            }
        }
        return false;
    });
    AP.reduce || (AP.reduce = function(fn /*, initial*/) {
        if (typeof fn !== 'function') {
            throw new TypeError(fn + ' is not an function');
        }

        var len = this.length >>> 0, i = 0, result;

        if (arguments.length > 1) {
            result = arguments[1];
        }
        else {
            do {
                if (i in this) {
                    result = this[i++];
                    break;
                }
                // if array contains no values, no initial value to return
                if (++i >= len) {
                    throw new TypeError('reduce of empty array with on initial value');
                }
            }
            while (true);
        }

        for (; i < len; i++) {
            if (i in this) {
                result = fn.call(null, result, this[i], i, this);
            }
        }

        return result;
    });
    AP.reduceRight || (AP.reduceRight = function(fn /*, initial*/) {
        if (typeof fn !== 'function') {
            throw new TypeError(fn + ' is not an function');
        }

        var len = this.length >>> 0, i = len - 1, result;

        if (arguments.length > 1) {
            result = arguments[1];
        }
        else {
            do {
                if (i in this) {
                    result = this[i--];
                    break;
                }
                // if array contains no values, no initial value to return
                if (--i < 0)
                    throw new TypeError('reduce of empty array with on initial value');
            }
            while (true);
        }

        for (; i >= 0; i--) {
            if (i in this) {
                result = fn.call(null, result, this[i], i, this);
            }
        }

        return result;
    });
    AP.indexOf || (AP.indexOf = function(value, from) {
        var len = this.length >>> 0;

        from = Number(from) || 0;
        from = Math[from < 0 ? 'ceil' : 'floor'](from);
        if (from < 0) {
            from = Math.max(from + len, 0);
        }

        for (; from < len; from++) {
            if (from in this && this[from] === value) {
                return from;
            }
        }

        return -1;
    });
    AP.lastIndexOf || (AP.lastIndexOf = function(value, from) {
        var len = this.length >>> 0;

        from = Number(from) || len - 1;
        from = Math[from < 0 ? 'ceil' : 'floor'](from);
        if (from < 0) {
            from += len;
        }
        from = Math.min(from, len - 1);

        for (; from >= 0; from--) {
            if (from in this && this[from] === value) {
                return from;
            }
        }

        return -1;
    });

    /**
     *  解决IE兼容问题，实现通用ES5标准方法
     */
    var nEvent = {
        getTarget: function () {
            return this.target || this.srcElement;
        },
        preventDefault: function () {
            if (this.preventDefault)
                this.preventDefault();
            else
                this.returnValue = false;
        },
        stopPropagation: function () {
            if (this.stopPropagation) {
                Event.prototype.stopPropagation.apply(this);
            } else {
                this.cancelBubble = true;
            }
        },
        getRelatedTarget: function () {
            if (this.relatedTarget) {
                return this.relatedTarget;
            } else if (this.toElement) {
                return this.toElement;
            } else if (this.fromElement) {
                return this.fromElement;
            } else {
                return null;
            }
        },
        getButton: function () {
            if (document.implementation.hasFeature("MouseEvents", "2.0")) {
                return this.button;
            } else {
                switch (this.button) {
                    case 0:
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                        return 0;
                    case 2:
                    case 6:
                        return 2;
                    case 4:
                        return 1;
                }
            }
        },
        getWheelDelta: function () {
            if (this.wheelDelta) {
                return  (browser.name == "opera" && browser.version < 9.5) ?
                    -this.wheelDelta : this.wheelDelta;
            } else {
                return -this.detail * 40;
            }
        },
        getCharCode: function () {
            if (typeof this.charCode == "number") {
                return this.charCode;
            } else {
                return this.keyCode;
            }
        }
    };
    var _Sprying = window.Sprying,
        _$ = window.$,
        data_storage = {};
    window.$ = window.Sprying = function (selector) {
        return new Sprying(selector);
    };

    /**
     * 解决IE7以下对class选取兼容
     * http://www.cnblogs.com/rubylouvre/archive/2009/07/24/1529640.html
     * @param searchClass
     * @param node
     * @param tag
     * @returns {Array}
     */
    var getElementsByClassName = function (searchClass, node, tag) {
        if (document.getElementsByClassName) {
            var nodes = (node || document).getElementsByClassName(searchClass), result = [];
            for (var i = 0; node = nodes[i++];) {
                if (tag !== "*" && node.tagName === tag.toUpperCase()) {
                    result.push(node)
                } else {
                    result.push(node)
                }
            }
            return result
        } else {
            node = node || document;
            tag = tag || "*";
            var classes = searchClass.split(" "),
                elements = (tag === "*" && node.all) ? node.all : node.getElementsByTagName(tag),
                patterns = [],
                current,
                match,
                result = [];
            var i = classes.length;
            while (--i >= 0) {
                patterns.push(new RegExp("(^|\\s)" + classes[i] + "(\\s|$)"));
            }
            var j = elements.length;
            while (--j >= 0) {
                current = elements[j];
                match = false;
                for (var k = 0, kl = patterns.length; k < kl; k++) {
                    match = patterns[k].test(current.className);
                    if (!match)  break;
                }
                if (match)  result.push(current);
            }
            return result;
        }
    }

    /**
     * 生成数组，
     * @param arr 类数组对象 ，过滤不存在 null undefined
     * @returns {Array}
     * @private
     */
    var _buildArray = function (arr) {
        var ret = [], i, len;
        for (i = 0, len = arr.length; i < len; i++) {
            if (!arr[i]) continue;
            ret.push(arr[i]);
        }
        return ret;
    };

    /**
     * 找出参数二数组元素为参数一数组元素的子节点或相同
     * @param parent
     * @param children
     * @returns {Array}  从children中找出所有parent数组元素下的子节点
     * @private
     */
    var _obtainChild = function (parent, children) {
        var belongChild = [], upNode, i, i_len, j, j_len;
        for (i = 0, i_len = parent.length; i < i_len; i++) {
            if (!parent[i]) continue;
            for (j = 0, j_len = children.length; j < j_len; j++) {
                upNode = children[j];
                if (!upNode) continue;
                // arr2一层层向上找，直到为null
                while (upNode) {
                    if (upNode === parent[i]) {
                        belongChild.push(children[j]);
//                        delete arr2[j];
                        children.splice(i, 1);
                        break;
                    }
                    upNode = upNode.parentNode;
                }
            }
        }
        return belongChild;
    };

    /**
     * 获取两数组中共有的元素
     * @param arr1数组一
     * @param arr2数组二
     * @returns {Array}返回共有的元素
     * @private
     */
    var _buildCommon = function (arr1, arr2) {
        var comArray = [], i, j, i_len, j_len;
        for (i = 0, i_len = arr1.length; i < i_len; i++) {
            if (!arr1[i]) continue;
            for (j = 0, j_len = arr2.length; j < j_len; j++) {
                if (!arr2[j]) continue;
                if (arr1[i] === arr2[j]) {
                    comArray.push(arr1[i]);
                    // delete  arr2[j];
                    arr2.splice(j, 1);
                    break;
                }
            }
        }
        return comArray;
    };

    var _buildUnion = function (arr1, arr2) {
        return arr1.concat(arr2);
    };
    /**
     * 选取一层层限制的Dom
     * @param selector 类似body#aa.class.class2
     * @returns {null|Array}
     * @private
     */
    var _selectWord = function (selector) {
        var returns = [], births, matchStr = [], isAdded = 0, selContainer = new Array(3);
        // body、tr类似这类标签,只会在首部出现
        if (/^([\w_]+)/.test(selector)) {
            matchStr = /^([\w_]+)/.exec(selector);
            births = document.getElementsByTagName(matchStr[1]);
            // 将查找后Dom放入
            selContainer[0] = Sprying.toArray(births);
        }
        // .class.app
        if (/(?:\.[\w_]+)+/.test(selector)) {
            // IE8及以下不支持getElementsByClassName方法
            if (Sprying.browser.ie && parseInt(Sprying.browser.ie) == 8) {
                births = document.querySelectorAll(selector);
            } else if (Sprying.browser.ie && parseInt(Sprying.browser.ie) < 8) {
                matchStr = /\.([\w_]+(?:\.[\w_]+)*)/.exec(selector);
                births = getElementsByClassName(matchStr[1].replace(/\./, ' '), null, null);
            } else {
                matchStr = /\.([\w_]+(?:\.[\w_]+)*)/.exec(selector);
                // 结果转换成 class app
                births = document.getElementsByClassName(matchStr[1].replace(/\./, ' '));
            }
            // 将查找后Dom放入
//            selContainer[1] = [].slice.call(births, 0);
            selContainer[1] = Sprying.toArray(births);
        }
        // #id
        if (/#([\w_]+)/.test(selector)) {
            matchStr = /#([\w_]+)/.exec(selector);
            births = document.getElementById(matchStr[1]);
            selContainer[2] = Sprying.toArray(births ? [births] : [])
        }
        // 一层层过滤，得出共有的Dom
        return selContainer.reduce(_buildCommon);
    };

    /**
     * 选取层次关系的元素
     * @param arg 选取层次关系的元素
     * @returns {null|Array}
     * @private
     */
    var _selectBlock = function (arg) {
        var matches, queryResults = [];
        if (typeof arg === 'string' && /\s+/.test(arg)) {
            matches = arg.trim().split(/\s+/);
            for (var i = 0, len = matches.length; i < len; i++) {
                // 拆分子字符串处理
                queryResults[i] = _selectWord(matches[i]);
            }
            // 合并每个字串查找后的结果
            return queryResults.reduce(_obtainChild);
        } else {
            return _selectWord(arg);
        }
    };

    var _cacheDom = [];

    function Sprying(arg) {
        this.elems = new Array();
        this.arg = arg;
        var matches, queryResults = [];
        // 传入为Sprying对象
        if (arg instanceof Sprying) {
            return arg;
            // 传入为字符串且逗号相隔
        } else if (typeof arg === 'string' && /\s*,\s*/.test(arg)) {
            matches = arg.trim().split(/\s*,\s*/);
            for (var i = 0, len = matches.length; i < len; i++) {
                queryResults[i] = _selectBlock(matches[i]);
            }
            this.elems = queryResults.reduce(_buildUnion);
            // 传入为Dom
        } else if (arg.nodeType) {
            this.elems.push(arg);
            // 传入为函数
        } else if (typeof arg === 'function') {
            var fnCache = Sprying.domLoaded_Fns;
            fnCache.push(arg);
            if (!Sprying.isReady){
                Sprying.isReady = true;
                Sprying.ready(function () {
                    for (var i = 0, l = fnCache.length; i < l; i++) {
                        fnCache[i]();
                    }
                });
            }


            /*           if (!Sprying._EventTimer) {
                           Sprying._EventTimer = setTimeout(function () {
                               Sprying.ready(function () {
                                   for (var i = 0, l = fnCache.length; i < l; i++) {
                                       fnCache[i]();
                                   }
                               });
                           }, 0);
                       }
           */
        } else {
            // 进入层次选取
            this.elems = _selectBlock(arg);
        }
        // 实现类似$('#aa')[0]访问
        for (var i = 0, len = this.elems.length; i < len; i++) {
            this[i] = this.elems[i];
        }
        this.length = this.elems.length;
    }

    Sprying.fn = Sprying.prototype = {
        constructor: Sprying,
        /**
         * 实现绑定事件函数
         * @param type
         * @param handler
         * @returns {*}
         */
        bind: function (type, handler) {
            this.each(function (index) {
                var self = this, isBubble = true;
                ;
                var innerHandler = function (eve) {
                    var event = eve ? eve : window.event;
                    for (var val in nEvent) {
                        event[val] = nEvent[val];
                    }
                    isBubble = handler.call(self, event) || true;
                    if (!isBubble) {
                        event.stopPropagation();
                    }
                };
                if (this.addEventListener) {
                    this.addEventListener(type, innerHandler, false);
                } else if (this.attachEvent) {
                    this.attachEvent("on" + type, innerHandler);
                } else {
                    this["on" + type] = innerHandler;
                }
            });
            return this;
        },
        /**
         * 返回Dom对象
         * @param index
         * @returns {Element|null}
         */
        get: function (index) {
            return this.elems[index] || null;
        },
        /**
         * 对选择器选中的Sprying对象
         * @param fns
         * @returns {*}
         */
        each: function (fns) {
            for (var i = 0, l = this.elems.length; i < l; i++) {
                // 回调返回false,则跳出循环
                if (!(fns.call(this.elems[i], i) || true))
                    return this;
            }
            return this;
        },
        /**
         * 比较两选择器选中内容是否一样
         * @param arg
         * @returns {boolean}
         */
        is: function (arg) {
            if (this.length == (_buildCommon(this.elems, Sprying(arg))).length)
                return true;
            return false;
        },
        data: function (name, data) {
            this.each(function () {

            })
        }
    }
    Sprying.domLoaded_Fns = [];
    /**
     * 类数组判断
     * @param o
     * @returns {boolean}
     */
    Sprying.isArrayLike = function (o) {
        if (o &&
            typeof o === 'object' &&
            o.nodeType != 3 &&
            isFinite(o.length) &&
            o.length >= 0 &&
            o.length === Math.floor(o.length) &&
            o.length < 4294967296)
            return true;
        else
            return false;
    };
    /**
     * 数组判断
     * @param o
     * @returns {boolean}
     */
    Sprying.isArray = function (o) {
        return typeof o === "object" &&
            Object.prototype.toString.call(o) === "[object Array]";
    };
    /**
     * 函数判断
     * @param o
     * @returns {boolean}
     */
    Sprying.isFunction = function (o) {
        return Object.prototype.toString.call(o) === "[object Function]";
    };
    /**
     * 转换成数组
     * @param seq
     * @returns {Function|Array|string|Blob}
     */
    Sprying.toArray = function (seq) {
        var arr = new Array(seq.length);
        for (var i = seq.length; i-- > 0;)
            if (i in seq)
                arr[i] = seq[i];
        return arr;
    };

    /**
     * 以对象形式返回浏览器信息
     */
    Sprying.browser = (function () {
        var s = navigator.userAgent.toLowerCase()

        var match = /(webkit)[\/]([\w.]+)/.exec(s) ||
            /(opera)(?:.*version)?[\/]([\w.]+)/.exec(s) ||
            /(msie)([\w.]+)/.exec(s) ||
            !/compatible/.test(s) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(s) ||
            [];
        return {name: function () {
            return match[1] || "";
        }, version: function () {
            return match[2] || "0";
        }}
    })();
    /**
     * ie equals one of false|6|7|8|9 values, ie5 is fucked down.
     * Based on the method: https://gist.github.com/527683
     */
    Sprying.browser.ie = function () {
        var v = 4, //原作者的此处代码是3，考虑了IE5的情况，我改为4。
            div = document.createElement('div'),
            i = div.getElementsByTagName('i');
        do {
            div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
        } while (i[0]);
        return v > 5 ? v : false; //如果不是IE，之前返回undefined，现改为返回false。
    }();

    /**
     * 判断当前是否是严格模式
     */
    Sprying.isStrict = function () {
        return !this;
    };

    /**
     * Dom渲染完成后执行fn
     * http://www.planabc.net/2009/07/30/adddomloadevent/
     * @param fn
     */
    Sprying.ready = function (fn) {
        var done = false,
        // only fire once
            init = function () {
                if (!done) {
                    done = true;
                    fn();
                }
            };
        // polling for no errors
        (function () {
            try {
                // throws errors until after ondocumentready
                document.documentElement.doScroll('left');
            } catch (e) {
                setTimeout(arguments.callee, 50);
                return;
            }
            // no errors, fire
            init();
        })();
        // trying to always fire before onload
        document.onreadystatechange = function () {
            if (document.readyState == 'complete') {
                document.onreadystatechange = null;
                init();
            }
        };
    };
    /**
     * 还原变量命名空间
     * @param {boolean}arg 是否还原引入Sprying框架前的Sprying值
     * @returns {Function}
     */
    Sprying.noConfict = function (arg) {
        window.$ = _$;
        if (arg) {
            window.Sprying = _Sprying;
        }
        return function (str) {
            return new Sprying(str);
        }
    }
    Sprying.isNumber = function (value) {
        return !isNaN(value) && typeof value == 'number';
    };
    /**
     * 返回：null NaN undefined string number boolean
     * function Array String Object（包括一些自定义类型） 自定义类型
     */
    Sprying.type = function (o) {
        /**
         * 获取参数类型
         * 对象直接量、Object.create、自定义构造函数的类属性皆为Object;
         * 识别出原生类型 （内置构造函数和宿主对象）
         */
        function classOf(obj) {
            return Object.prototype.toString.call(obj).slice(8, -1);
        }

        /**
         * 返回函数的名字，可能为空串；不是函数，返回null
         */
        Function.prototype.getName = function () {
            if ("name" in this) return this.name;
            return this.name = this.toString().match(/function\s*([^(]*)\(/)[1];
        };
        var t, c, n;
        // 处理null值特殊情形
        if (o === null) return "null";
        // NaN：和自身值不相等
        if (o !== o) return "NaN";
        // 识别出原生值类型和函数、undefined
        if ((t = typeof o) !== "object") return t;
        // 识别出原生类型
        if ((c = classOf(o)) !== "Object") return c;
        // 返回自定义类型构造函数名字
        if (o.constructor && typeof o.constructor === "function" &&
            (n = o.constructor.getName()))
            return n;
        return "Object";
    };
    Sprying.extend = function(obj1,/*{object,optional}*/obj2){
            for(var i= 1,l=arguments.length;i<l;i++){
                var obj_from = arguments[i];
                for(var pro in obj_from){
                    if(!obj_from[pro]) continue;
                    obj1[pro] = obj_from[pro];
                }
            }
    };
    Sprying.extend = Sprying.fn.extend = function(obj){
        if(!obj) return null;
        for(var pro in obj){
            if(!obj[pro]) continue;
            this[pro] = obj[pro];
        }
    }
    Sprying.extend(window.Sprying,Sprying);
})();
