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
