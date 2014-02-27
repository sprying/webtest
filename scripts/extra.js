/**
 * @fileOverview 封装繁琐的内部操作，提供简化的Api
 * @author <a href="mailto:sprying.fang@gmail.com">sprying</a>
 */
/**
 * IE版本检测 Based on the method: https://gist.github.com/527683
 * ie版本号，6-最新版本；false时，表示非IE浏览器
 */
var ie = function () {
    var v = 4, //原作者的此处代码是3，考虑了IE5的情况，我改为4。
        div = document.createElement('div'),
        i = div.getElementsByTagName('i');
    do {
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
    } while (i[0]);
    return v > 5 ? v : false; //如果不是IE，之前返回undefined，现改为返回false。
}();

/**
 * 原型式继承,生成的新对象继承传入对象
 * @param {Object} p 原对象
 * @returns {Object} 返回新建对象
 */
function inherit(p) {
    if (p == null)
        throw TypeError();
    if (Object.create) {
        return Object.create(p);
    }
    var t = typeof p;
    if (t !== "object" && t !== "function")
        throw TypeError();
    function f() {
    }

    f.prototype = p;
    return new f();
}

/**
 * ES5.0支持bind函数，ES3.0不支持bind,这里在ES3中模拟实现，能应用于大部分场景，
 * 如有问题，欢迎一起探讨
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
 */
Function.prototype.bind || (Function.prototype.bind = function (that) {
    var target = this;

    // If IsCallable(func) is false, throw a TypeError exception.
    // 个人觉得没用
    if (typeof target !== 'function') {
        throw new TypeError('Bind must be called on a function');
    }

    var boundArgs = slice.call(arguments, 1);

    function bound() {
        // 返回的bind函数被当构造函数
        if (this instanceof bound) {
            var self = createObject(target.prototype);
            var result = target.apply(
                self,
                boundArgs.concat(slice.call(arguments)));
            // Object(result) === result 判断调用返回是不是对象
            return Object(result) === result ? result : self;
        }
        // 返回的bind函数以一般函数形式调用
        else {
            return target.apply(
                that,
                boundArgs.concat(slice.call(arguments)));
        }
    }

    // NOTICE: The function.length is not writable.
    bound.length = Math.max(target.length - boundArgs.length, 0);

    return bound;
});


/**
 * 获取参数类型
 * 对象直接量、Object.create、自定义构造函数的类属性皆为Object;
 * 识别出原生类型 （内置构造函数和宿主对象）
 * @param {*} o 所有的数据类型
 * @returns {string} 类型名
 */
function classOf(o) {
    if (o === null) return "Null";
    if (o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8, -1);//[Object Array]
}

/**
 * 返回函数的名字，可能为空串
 * @returns {String} 函数名
 */
Function.prototype.getName = function () {
    if ("name" in this) return this.name;
    return this.name = this.toString().match(/function\s*([^(]*)\(/)[1];
};

/**
 * 以字符串形式返回o的类型
 * @param {*} o 任意类型的变量
 * @returns {String} 类型名称
 */
function type(o) {
    var t, c, n;
    if (o === null) return "null";
    if (o !== o) return "nan";
    if ((t = typeof o) !== "object") return t;
    if ((c = classOf(o)) !== "Object") return c;
    if (o.constructor && typeof o.constructor === "function" &&
        (n = o.constructor.getName()))
        return n;
    return "Object";
}

/**
 * @desc 文本范围类
 * @param from
 * @param to
 * @constructor
 */
function Range(from, to) {
    this.from = from;
    this.to = to;
}
Range.prototype = {
    includes: function (x) {
        return this.from <= x && this.to >= x;
    },
    foreach: function (f) {
        for (var x = Math.ceil(this.from); x <= this.to; x++) {
            f(x);
        }
    },
    toString: function () {
        return "(" + this.from + "..." + this.to + ")";
    }
};

/**
 * @name Set
 * @class Set类，仿照Java中的Set，故Set内的元素不会重复，有添加、删除、是否包括方法
 * @constructor
 * @example
 * var set = new Set(1,"set contains string",function(){},[],{});
 */
function Set() {
    this.values = {

    };//this指代对象,既非Set.prototype又非Set; 而是new 的一个Set.prototype的对象
    this.n = 0;
    this.add.apply(this, arguments);
}
/**
 * 添加一个个实参“值”，在实例中，以对象形式保存“属性：值”
 * @returns {Set} 返回当前对象
 */
Set.prototype.add = function () {
    for (var i = 0, len = arguments.length; i < len; i++) {
        var val = arguments[i];
        var str = Set._v2s(val);
        if (!this.values.hasOwnProperty(str)) {
            this.values[str] = val;
            this.n++;
        }
    }
    return this;
};
/**
 * 删除指定的value的Set元素，由值定位属性名，删除values对象中相应属性
 * @returns {Set}返还该对象
 */
Set.prototype.remove = function () {
    for (var i = 0, len = arguments.length; i < len; i++) {
        var str = Set._v2s(arguments[i]);
        if (this.values.hasOwnProperty(str)) {
            delete this.values[str];
            this.n--;
        }
        return this;
    }
};
/**
 * Set中是否存在value的元素，根据实参值定位属性名，查询values对象是否有相应属性
 * @param {*} val 待检测的元素
 * @returns {boolean} 是否存在
 */
Set.prototype.contains = function (val) {
    return this.values.hasOwnProperty(Set._v2s(val));
};
/**
 * Set的元素个数
 * @returns {number} set中的元素个数
 */
Set.prototype.size = function () {
    return this.n;
};
/**
 * 对set每个元素，执行函数，此函数的第一个参数是当前元素
 * @param {function} f 函数引用
 * @param {object} [context=null] 函数执行的上下文h
 */
Set.prototype.foreach = function (f, context) {
    for (var s in this.values) {
        if (this.values.hasOwnProperty(s)) {
            f.call(context || {}, this.values[s]);
        }
    }
};
/**
 * 生成各种类型值的唯一索引
 * @param {*} val 各种类型值
 * @returns {string} 索引名
 * @private
 */
Set._v2s = function (val) {
    switch (val) {
        case undefined:
            return 'u';
        case null:
            return 'n';
        case true:
            return 't';
        case false:
            return 'f';
        default :
            switch (typeof val) {
                case 'number':
                    return '#' + val;
                case 'string':
                    return '' + val;
                default :
                    return '@' + objectId(val);
            }
    }
    function objectId(o) {
        var prop = "|**objectid**|";
        if (!o.hasOwnProperty(prop)) {
            o[prop] = Set._v2s.next++;
        }
        return o[prop];
    }
};
/**
 * 自增的起始值
 */
Set._v2s.next = 100;

/**
 * Object原型添加extend方法，并指定方法属性的特性
 * extend方法，可将参数对象中所有自有的属性拷贝至最初原型中,除了在原型中已存在的
 */
try {
    Object.defineProperty(Object.prototype, "extend", {
        writable: true,
        enumerable: false,
        configurable: true,
        value: function (o) {
            var names = Object.getOwnPropertyNames(o);
            for (var index in names) {
                if (names[index] in this) continue;//this指向具体的实例对象
                var desc = Object.getOwnPropertyDescriptor(o, names[index]);
                Object.defineProperty(this, names[index], desc);
            }
        }
    });
} catch (ex) {
    console.log(ex);
    console.log("创建Object.prototype.extend失败");
}


/**
 * Copy the enumerable properties of p to o, and return o.
 * If o and p have a property by the same name, o's property is overwritten.
 * This function does not handle getters and setters or copy attributes.
 * @param {Object} o
 * @param {Object} p
 * @returns {Object}
 */
function copy(o, p) {
    if (p == null) throw TypeError;
    for (var prop in p) {
        o[prop] = p[prop];
    }
    return o;
}

/**
 * 深拷贝
 * @param {Object} o
 * @param {Object} p
 * @returns {Object}
 */
function deepCopy(o, p) {
    if (p == null) throw TypeError;
    for (var prop in p) {
        var type = typeof prop;
        if (type == "object") {
            o[prop] = (prop.prototype.constructor === Array) ? [] : {};
            arguments.callee(o[prop], p[prop]);
        } else {
            o[prop] = p[prop];
        }
    }
    return o;
}

/**
 * 扩展Set的标准转换方法
 */
copy(Set.prototype, /** @lends Set.prototype*/ {
    toString: function () {
        var s = "{",
            i = 0;
        this.foreach(function (v) {
            s += (i++ > 0 ? "," : "") + v;
        });
        return s += "}";
    },
    toLocaleString: function () {
        var s = "{",
            i = 0;
        this.foreach(function (v) {
            if (v != null) {
                v = v.toLocaleString();
            }
            s += (i++ >= 0 ? "," : "") + v;
        })
        return s += "}";
    },
    toArray: function () {
        var a = [];
        this.foreach(function (v) {
            a.push(v);
        });
        return a;
    }
})
/**
 * 比较两Set的对象是否相等，相等最基本条件是包含一样的元素
 * @param {Set} that 要比较的对象
 * @returns {boolean} 是否相等
 */
Set.prototype.equals = function (that) {
    if (this === that) return true;
    if (!(that instanceof Set))  return false;
    if (this.size() != that.size())  return false;
    try {
        this.foreach(function (v) {
            if (!that.contains(v))   throw false;
        });
        return true;
    } catch (x) {
        if (x === false) return false;
        throw x;
    }
}

/**
 * 实参对象表示类的每个实例的名字和值
 * @param namesToValues
 * @returns {Function}
 */
function enumeration(namesToValues) {
    var enumeration = function () {
        throw "Can't Instantiate Enumerations";
    }

    var proto = enumeration.prototype = {
        constructor: enumeration,
        toString: function () {
            return this.name;
        },
        valueOf: function () {
            return this.value;
        },
        toJSON: function () {
            return this.name;
        }
    };
    enumeration.values = [];
    for (var name in namesToValues) {
        var e = inherit(proto);
        e["name"] = name;
        e["value"] = namesToValues[name];
        enumeration[name] = e;
        enumeration.values.push(e);
    }
    enumeration.foreach = function (fn, context) {
        for (var i = 0, len = enumeration.values.length; i < len; i++) {
            fn.call(context, enumeration.values[i]);
        }
    };
    return enumeration;
}
/**
 * 插入Html元素
 * @param  {Node} parent 父元素
 * @param {Node} child 插入元素
 * @param {Number} n 插入位置
 */
function insertAt(parent, child, n) {
    if (n < 0 || n > parent.childNodes.length) throw new Error('invaild index');
    if (n === parent.childNodes.length) parent.appendChild(child);
    else child.insertBefore(parent.childNodes[n]);
}
/**
 * Dom元素的文本值
 * @param {Node} element Dom元素
 * @param {String} value 设置的文本值
 * @returns {*}
 */
function textContent(element, value) {
    var content = element.textContent;
    if (value === undefined) {
        return content || element.innerText;
    } else {
        content ? element.textContent = value : element.innerText = value;
    }
}
/**
 * 绑定事件
 * @function
 * @type Function
 * @param {String} 事件类型
 */
var addEvent = (function () {
    if (window.addEventListener) {
        return function (type, element, fns) {
            element.addEventListener(type, fns, false);
        }
    }
    if (window.attachEvent) {
        return function (type, element, fns) {
            element.attachEvent("on" + type, fns);
        }
    }
    return function (type, element, fns) {
        element["on" + type] = fns;
    }
})();
/**
 * Firefox的Dom添加innerText属性支持
 */
(function () {
    if (!(/Firefox/.test(window.navigator.userAgent))) return;

    function innerTextGetter() {
        return this.textContent;
    }

    function innerTextSetter(value) {
        this.textContent = value;
    }

    if (Object.defineProperty) {
        Object.defineProperty(HTMLElement.prototype, 'innerText', {
            get: innerTextGetter,
            set: innerTextSetter,
            enumerable: false,
            configurable: true
        });
    } else {
        HTMLElement.prototype.__defineGetter__("innerText", innerTextGetter);
        HTMLElement.prototype.__defineSetter__("innerText", innerTextSetter);
    }
})();
/**
 * 从指定的开始位置截取数组到末尾
 * @param seq {Array|Object} 数组或类数组
 * @param begIndex {Number} 截取的
 * @returns {Array} {Array} 数组
 */
Array.fromSequence = function (seq, begIndex) {
    var arr = [];
    var arrayIndex = 0;
    for (var i = seq.length; i-- > begIndex;)
        if (i in seq)
            arr[arrayIndex++] = seq[i];
    return arr;
};
function sortrows(table, n, order, comparator) {
    var tbody = table.tBodies[0];
    var rows = tbody.getElementsByTagName("tr");
    // 以下在IE8下不支持
    //rows = Array.prototype.slice.call(rows,1);
    rows = Array.fromSequence(rows, 1);
    rows.sort(function (row1, row2) {
        var cell1 = row1.getElementsByTagName("td")[n];
        var cell2 = row2.getElementsByTagName("td")[n];
        var val1 = cell1.innerText;
        var val2 = cell2.innerText;
        if (comparator) return comparator(val1, val2);
        if (val1 > val2) return order;
        if (val1 < val2) return 0 - order;
        return 0;
    })

    for (var rowObj in rows)
        tbody.appendChild(rows[rowObj]);
}
function makeSortable(table) {
    var headers = document.getElementsByTagName("th");
    for (var i = 0, len = headers.length; i < len; i++) {
        (function (n) {
            var order = 0;
            headers[n].onclick = function () {
                order = (order + 1) % 2;
                sortrows(table, n, order == 0 ? -1 : 1);
            };
        })(i)
    }
}
/**
 * 获取浏览器的类型和版本信息
 * @type {Object}
 */
var browser = (function () {
    var s = navigator.userAgent.toLowerCase()

    var match = /(webkit)[\/]([\w.]+)/.exec(s) ||
        /(opera)(?:.*version)?[\/]([\w.]+)/.exec(s) ||
        /(msie)([\w.]+)/.exec(s) ||
        !/compatible/.test(s) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(s) ||
        [];
    return {name: match[1] || "", version: match[2] || "0"};
})();

/**
 * 查询窗口滚动条位置
 * @param w
 * @returns {*}
 */
function getScrollOffsets(w) {
    var w = w || window;
    // 除了IE8及更早版本
    if (w.pageXOffset != null) return {x: w.pageXOffset, y: w.pageYOffset};
    var d = w.document;
    //标准模式下或任何浏览器下
    if (document.compatMode == "CSS1Compat")
        return {x: d.documentElement.scrollLeft, y: document.documentElement.scrollTop}
    //怪异模式下 缺少类似<!DOCTYPE html>声明
    return {x: d.body.scrollLeft, y: d.body.scrollHeight}
}

/**
 * 获取视窗大小
 * @param w
 * @returns {*}
 */
function getViewportSize(w) {
    var w = w || window;

    //除了IE8及更早版本
    if (w.innerWidth != null) return {w: w.innerWidth, h: w.innerHeight};

    var d = w.document;
    //标准模式下或任何浏览器下
    if (document.compatMode == "CSS1Compat") {
        return {w: d.documentElement.clientWidth, h: d.documentElement.clientHeight}
    }
    //怪异模式下
    return {w: d.body.clientWidth, h: d.body.clientHeight}
}

/**
 * 获取元素相对文档位置
 * @param e
 * @returns {{x: number, y: number}}
 */
function getElementPostion(e) {
    var x = 0, y = 0;
    for (var ex = e; ex != null; ex = ex.offsetParent()) {
        x += ex.offsetLeft;
        y += ex.offsetTop;
    }
    return {x: x, y: y}
}

var EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeHandler: function (element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },
    getEvent: function (event) {
        return event ? event : window.event;
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    preventDefault: function (event) {
        if (event.preventDefault)
            event.preventDefault();
        else
            event.returnValue = false;
    },
    stopPropagation: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    //只有mouseover和mouseout事件才有这属性
    getRelatedTarget: function (event) {
        if (event.relatedTarget) {
            return event.relatedTarget;
        } else if (event.toElement) {
            return event.toElement;
        } else if (event.fromElement) {
            return event.fromElement;
        } else {
            return null;
        }
    },
    // 鼠标事件的按钮属性
    getButton: function (event) {
        if (document.implementation.hasFeature("MouseEvents", "2.0")) {
            return event.button;
        } else {
            switch (event.button) {
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0; //主鼠标按钮
                case 2:
                case 6:
                    return 2; //  次鼠标按钮
                case 4:
                    return 1; //滚轮
            }
        }
    },
    getWheelDelta: function (event) {
        if (event.wheelDelta) {
            return  (browser.name == "opera" && browser.version < 9.5) ?
                -event.wheelDelta : event.wheelDelta;
        } else {
            return -event.detail * 40;
        }
    },
    getCharCode: function (event) {
        if (typeof event.charCode == "number") {
            return event.charCode;
        } else {
            return event.keyCode;
        }
    }
};

/**
 * 判断类数组
 * @param {*} o
 * @returns {boolean}
 */
function isArrayLike(o) {
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
}
/**
 * 判断数组
 * @param {*} o
 * @returns {boolean}
 */
function isArray(o) {
    return typeof o === "object" &&
        Object.prototype.toString.call(o) === "[object Array]";
}
/**
 * 判断函数
 * @param o
 * @returns {boolean}
 */
var isFunction = function (o) {
    return Object.prototype.toString.call(o) === "[object Function]";
};
/**
 * 早期的ie有bug，即屏蔽的不可枚举属性，不存在for in中
 */
Object.keys || (Object.keys = (function () {
    var hasDontEnumBug = !{toString: ''}.propertyIsEnumerable('toString');
    var DontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
    ];
    var DontEnumsLength = DontEnums.length;

    return function (o) {
        if (o !== Object(o)) {
            throw new TypeError(o + ' is not an object');
        }

        var result = [];

        for (var name in o) {
            if (Object.prototype.hasOwnProperty.call(o, name)) {
                result.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (Object.prototype.hasOwnProperty.call(o, DontEnums[i])) {
                    result.push(DontEnums[i]);
                }
            }
        }

        return result;
    };
})());

(function (window, undefined) {
    /**
     * 渲染完成后待执行的队列
     * @type {Array}
     */
    var readyList = [],
        /**
         * Dom渲染完成标志
         */
            isReady = 0,
        /**
         * 绑定渲染事件标志
         */
            readyBound = false,
        init,
        bindReady,
        readyWait = 1;
    /**
     * DOM渲染完成后初始化
     * @param wait
     * @returns {number}
     */
    init = function (wait) { // A third-party is pushing the ready event forwards
        if (wait === true) {
            readyWait--;
        } // Make sure that the DOM is not already loaded
        if (!readyWait || (wait !== true && !isReady)) { // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            // 确保body元素存在，这个操作是防止IE的bug
            if (!document.body) {
                return setTimeout(init, 1);
            }
            // dom渲染完成标志设置为true
            isReady = true; // If a normal DOM Ready event fired, decrement, and wait if need be
            if (wait !== true && --readyWait > 0) {
                return;
            } // 绑定的渲染完成后的执行函数
            if (readyList) { // 全部执行
                var fn, i = 0,
                    ready = readyList; // 重置
                readyList = null;
                while ((fn = ready[i++])) {
                    fn.call(document);
                }
            }
        }
    }; // 初始化readyList事件处理函数队列
    // 兼容不同浏览对绑定事件的区别
    bindReady = function () {
        if (readyBound) {
            return;
        }
        readyBound = true; // $(document).ready()的嵌套调用时
        // readyState: "uninitalized"、"loading"、"interactive"、"complete" 、"loaded"
        if (document.readyState === "complete") { // 让它异步执行，使这个ready能延迟
            return setTimeout(init, 1);
        } // Mozilla, Opera and webkit
        // 兼容事件，通过检测浏览器的功能特性，而非嗅探浏览器
        if (document.addEventListener) { // 使用事件回调函数
            document.addEventListener("DOMContentLoaded",
                function () {
                    document.removeEventListener("DOMContentLoaded", arguments.callee, false);
                    init();
                },
                false); // 绑定回调到load,使之能一定执行
            window.addEventListener("load", init, false); // IE
        } else if (document.attachEvent) { // 确保在load之前触发onreadystatechange,
            // 针对iframe情况，可能有延迟
            document.attachEvent("onreadystatechange",
                function () { // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                    if (document.readyState === "complete") {
                        document.detachEvent("onreadystatechange", arguments.callee);
                        init();
                    }
                });
            // 绑定回调到一定执行能load事件
            window.attachEvent("onload", init); // 如果是IE且非iframe情况下
            // 持续的检查，看看文档是否已准备
            var toplevel = false;
            try {
                toplevel = window.frameElement == null;
            } catch (e) {
            }
            (function () {
                if (document.documentElement.doScroll && toplevel) {
                    if (isReady) {
                        return;
                    }
                    try { // If IE is used, use the trick by Diego Perini
                        // http://javascript.nwbox.com/IEContentLoaded/
                        document.documentElement.doScroll("left");
                    } catch (e) {
                        setTimeout(arguments.callee, 1);
                        return;
                    } // 执行在等待的函数
                    init();
                }
            })();
        }
    };
    window.ready = function (fn) { // 绑定上监听事件
        bindReady(); // 如果dom已经渲染
        if (isReady) { // 立即执行
            fn.call(document); // 否则，保存到缓冲队列，等上面的监听事件触发时，再全部执行
        } else if (readyList) { // 将回调增加到队列中
            readyList.push(fn);
        }
    };
})(window);
function addEvent(element, type, handler) {
    Event.prototype.getTarget = function () {
        return this.target || this.srcElement;
    };
    Event.prototype.preventDefault = function () {
        if (this.preventDefault)
            this.preventDefault();
        else
            this.returnValue = false;
    };
    Event.prototype.stopPropagation = function () {
        if (this.stopPropagation) {
            this.stopPropagation();
        } else {
            this.cancelBubble = true;
        }
    };
    Event.prototype.getRelatedTarget = function () {
        if (this.relatedTarget) {
            return this.relatedTarget;
        } else if (this.toElement) {
            return this.toElement;
        } else if (this.fromElement) {
            return this.fromElement;
        } else {
            return null;
        }
    };
    Event.prototype.getButton = function () {
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
    };
    Event.prototype.getWheelDelta = function () {
        if (this.wheelDelta) {
            return  (browser.name == "opera" && browser.version < 9.5) ?
                -this.wheelDelta : this.wheelDelta;
        } else {
            return -this.detail * 40;
        }
    };
    Event.prototype.getCharCode = function () {
        if (typeof this.charCode == "number") {
            return this.charCode;
        } else {
            return this.keyCode;
        }
    };

    var event = 0;
    var intializeHandle = function (eve) {
        event = eve ? eve : window.event;
        handler.call(element, event);
    };
    if (element.addEventListener) {
        element.addEventListener(type, intializeHandle, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + type, intializeHandle);
    } else {
        element["on" + type] = intializeHandle;
    }
}
/**
 * 原型继承，利用原型链实现继承，当然原型链继承有很多种形式，这是效果最好的，配合借用父构造函数一起使用
 * YUI中extend也是如此
 * @param {Function} superType 父引用类型
 * @param {Function} subType 子引用类型
 */
function extend(superType, subType) {
    var F = function () {
    };
    F.prototype = superType.prototype;
    subType.prototype = new F();
    subType.prototype.constructor = subType;
    subType.superClass = superType.prototype;
    if (superType.prototype.constructor == Object.prototype.constructor) {
        superType.prototype.constructor = superType;
    }
}

/**
 * augment扩充类
 * @param {Object} receivingClass
 * @param {Object} givingClass
 */
function argument(receivingClass,givingClass){
    if(arguments[2]){
        for(var i = 2,len = arguments.length;i<len;i++){
            receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
        }
    }else{
        for(var method in givingClass.prototype){
            if(!receivingClass.prototype[method]){
                receivingClass.prototype[method] = givingClass.prototype[method];
            }
        }
    }
}

