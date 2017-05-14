## javascript中继承的实现
### 常用实现
就是`class1.html`介绍的，`class2.html`比较少见，如果取个名字的话，叫原型继承吧

### 寄生组合继承
`prototype.html`这个例子主要讲里面写的最后一个例子，寄生组合继承，其实这里命名，在我后来都没遇到  
还有，如何实例对应的类，类原型的引用变化了，这个实例指向的原型会变吗？不会的。

### 最优雅的写法
`simple-inherit.html`这个继承是大牛写的，是我见过最简洁写法了，但是在工作中，一直没看到有人在用子类方法内，要用到父类方法，直接使用`this._super`方法，还有init方法construction，也只会调用一次。继承中构造函数保持在原型链中

### 最繁重的写法 
`complex-inherit.htm`，这个继承是功能最全面的，包括类实现里，怎么实现静态方法，但是它的语法糖太多了，`Extends`、`Implements`、`Statics`、`initialize`，继承中的构造函数提出来，放在当前类的构造函数中执行，new初始化钩子，是initialize，只会调用一次，继承中initialize也可以调用

### brix里的实现
`brix.html` 是[Brix Base](https://thx.github.io/brix-book/)里关于继承的实现，因为为了支持框架Brix Loader，所以继承里做了特殊处理，比如`options`参数，比如`__x_created_with`，继承中的构造函数提出来，放在当前类的构造函数中执行，new时初始化钩子，是created方法调用init、render，所以初始化语句可以放在init、render，按正常结果只调用一次，但这里调用了两次，重复了。

### magix里实现 
magix中View如何实现继承？也是类似brix，但它不包含任何语法糖，new初始化钩子，是
```
View.extend = function(props, statics, ctor) {
```
第三个参数ctor是初始化钩子，这里会多次调用

### 总结
为了实现类似`Person.extend`能生成新类，`extend`要向封装传入原型上方法，父类，静态方法，每次执行extend时要定义新类的构造函数。返回的新类也能extend再生成子类。   
封装内，将父类的构造函数和原型拆分。新类的构造函数执行父类的构造函数，新类的原型指向Object.create(父类的原型)。构造函数在实例化时才执行，原型链实现，在实现继承时就执行。
新类的构造函数中执行父类的构造函数，父类的构造函数再执行祖先的构造函数...，直到最顶层。最顶层构造函数可自由实现。在simple-inherit中是封装外面的Class，在brix中是首次直接赋值了extend方法的类。complex-inherit中，是由Class.create传入的。  
实例化类的时候，要自动执行初始化的操作，正常是在构造函数中实现的，extend封装里的构造函数是统一写死的，无法自由做一些初始化，要在构造函数里提供个钩子，构造函数执行这个钩子函数，钩子函数，在定义新类的时候传入，也就是`Person.extend`时传入。
钩子一般是定义在原型上的某方法，比如`initialize`方法，因为构造函数里是调父类的构造函数，一直到最顶层基类，也要多次执行构造函数内钩子吗？钩子是这样执行的`this.initialize.apply(this, arguments)`，this在每次执行时都不变的，也没必要多次执行，只要执行一次即可。并且只执行原型链中，第一个有钩子方法的原型，剩下的都不执行了。  
实现原型链继承时，要注意原型的constructor属性，为了子类方法能调父类方法，给每个类加个`superclass`属性，指向父类的原型对象。

## mix
```
	// https://g.alicdn.com/mm/pubplus/0.4.12/app_debug/exts/arale/class.js
    function mix(r, s, wl) {
      // Copy "all" properties including inherited ones.
      for (var p in s) {
        if (s.hasOwnProperty(p)) {
          if (wl && indexOf(wl, p) === -1) continue

          // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
          if (p !== 'prototype') {
            r[p] = s[p]
          }
        }
      }
    }
```

## extend在库里实现
### underscore
将后面对象的自有可枚举属性，拷贝到第一个对象，并返回第一个对象
```
  // http://g.alicdn.com/thx/brix-release/1.0.0-beta.9/underscore/underscore.js	
  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    if (!_.isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };
```
### jquery
支持深度拷贝，深拷贝除了支持对象还包括数组，改变第一个对象，并返回第一个对象
```
// http://g.alicdn.com/thx/brix-release/1.0.0-beta.9/jquery/dist/jquery.js
jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};  
```

## kissy1.3中有关对象的方法
### mix
改变并返回第一个参数，下面实现方法中MIX_CIRCULAR_DETECTION标记，感觉是为了调试，看deep了几次
```
		/*
         * for example:
         *     @example
         *     var t = {};
         *     S.mix({x: {y: 2, z: 4}}, {x: {y: 3, a: t}}, {deep: TRUE}) => {x: {y: 3, z: 4, a: {}}}, a !== t
         *     S.mix({x: {y: 2, z: 4}}, {x: {y: 3, a: t}}, {deep: TRUE, overwrite: false}) => {x: {y: 2, z: 4, a: {}}}, a !== t
         *     S.mix({x: {y: 2, z: 4}}, {x: {y: 3, a: t}}, 1) => {x: {y: 3, a: t}}
         */
        mix: function (r, s, ov, wl, deep) {
            if (typeof ov === 'object') {
                wl = ov['whitelist'];
                deep = ov['deep'];
                ov = ov['overwrite'];
            }
            var cache = [],
                c,
                i = 0;
            mixInternal(r, s, ov, wl, deep, cache);
            while (c = cache[i++]) {
                delete c[MIX_CIRCULAR_DETECTION];
            }
            return r;
        }
        
        
            function mixInternal(r, s, ov, wl, deep, cache) {
                if (!s || !r) {
                    return r;
                }
        
                if (ov === undefined) {
                    ov = TRUE;
                }
        
                var i = 0, p, keys, len;
        
                // 记录循环标志
                s[MIX_CIRCULAR_DETECTION] = r;
        
                // 记录被记录了循环标志的对像
                cache.push(s);
        
                if (wl) {
                    len = wl.length;
                    for (i = 0; i < len; i++) {
                        p = wl[i];
                        if (p in s) {
                            _mix(p, r, s, ov, wl, deep, cache);
                        }
                    }
                } else {
                    // mix all properties
                    keys = S.keys(s);
                    len = keys.length;
                    for (i = 0; i < len; i++) {
                        p = keys[i];
                        if (p != MIX_CIRCULAR_DETECTION) {
                            // no hasOwnProperty judge!
                            _mix(p, r, s, ov, wl, deep, cache);
                        }
                    }
                }
        
                return r;
            }
        
            function _mix(p, r, s, ov, wl, deep, cache) {
                // 要求覆盖
                // 或者目的不存在
                // 或者深度mix
                if (ov || !(p in r) || deep) {
                    var target = r[p],
                        src = s[p];
                    // prevent never-end loop
                    if (target === src) {
                        // S.mix({},{x:undefined})
                        if (target === undefined) {
                            r[p] = target;
                        }
                        return;
                    }
                    // 来源是数组和对象，并且要求深度 mix
                    if (deep && src && (S.isArray(src) || S.isPlainObject(src))) {
                        if (src[MIX_CIRCULAR_DETECTION]) {
                            r[p] = src[MIX_CIRCULAR_DETECTION];
                        } else {
                            // 目标值为对象或数组，直接 mix
                            // 否则 新建一个和源值类型一样的空数组/对象，递归 mix
                            var clone = target && (S.isArray(target) || S.isPlainObject(target)) ?
                                target :
                                (S.isArray(src) ? [] : {});
                            r[p] = clone;
                            mixInternal(clone, src, ov, wl, TRUE, cache);
                        }
                    } else if (src !== undefined && (ov || !(p in r))) {
                        r[p] = src;
                    }
                }
            }
```

### merge 
合并所有obj到返回新
```
        merge: function (var_args) {
            var_args = S.makeArray(arguments);
            var o = {},
                i,
                l = var_args.length;
            for (i = 0; i < l; i++) {
                S.mix(o, var_args[i]);
            }
            return o;
        },
```

### augment 
只对原型对象进行复制，改变并返回第一个参数
```
        augment: function (r, var_args) {
            var args = S.makeArray(arguments),
                len = args.length - 2,
                i = 1,
                ov = args[len],
                wl = args[len + 1];

            if (!S.isArray(wl)) {
                ov = wl;
                wl = undefined;
                len++;
            }
            if (!S.isBoolean(ov)) {
                ov = undefined;
                len++;
            }

            for (; i < len; i++) {
                S.mix(r.prototype, args[i].prototype || args[i], ov, wl);
            }

            return r;
        },
```
### extend 
继承的实现，跟上面封装的继承相比，还是有缺点的，首先新类的构造函数执行时候，父类的构造函数不会自动执行，总觉得superclass的指向的原型，中间多了一层
```
        extend: function (r, s, px, sx) {
            if (!s || !r) {
                return r;
            }

            var sp = s.prototype,
                rp;

            // add prototype chain
            rp = createObject(sp, r);
            r.prototype = S.mix(rp, r.prototype);
            r.superclass = createObject(sp, s);

            // add prototype overrides
            if (px) {
                S.mix(rp, px);
            }

            // add object overrides
            if (sx) {
                S.mix(r, sx);
            }

            return r;
        },
        
            function Empty() {
            }
            function createObject(proto, constructor) {
                var newProto;
                if (ObjectCreate) {
                    newProto = ObjectCreate(proto);
                } else {
                    Empty.prototype = proto;
                    newProto = new Empty();
                }
                newProto.constructor = constructor;
                return newProto;
            }
```