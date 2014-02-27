function UseThis() {
    console.log(this === window);
    this.instancePro = 1;
}
UseThis.objPro = 2;
UseThis.objMethod = function () {
    console.log(this.objPro);
}
UseThis();//true 不管嵌套多深，执行函数时，函数内的this === window
console.log(instancePro);// 1
var useThis = new UseThis();//false 当前是A是个构造函数，构造函数内的this，是new创建的实例
console.log(useThis.instancePro);// 1
UseThis.objMethod();//1 当前函数是对象方法，this===A
var fn = UseThis.objMethod;
fn();//undefined

function buildHtml(args) {
    var template = ['<table><tr><td>',
        '',
        '</td><td>',
        '',
        '<td></td></tr></table>'];
    template[1] = args[0];
    template[3] = args[1];
    return template.join('');
}

//...
var template = ['<table><tr><td>',
    '',
    '</td><td>',
    '',
    '<td></td></tr></table>'];
function buildHtml(args) {
    template[1] = args[0];
    template[3] = args[1];
    return template.join('');
}
//...这里可以调用上面的代码

//...
buildHtml.template = ['<table><tr><td>',
    '',
    '</td><td>',
    '',
    '<td></td></tr></table>'];
function buildHtml(args) {
    var template = buildHtml.template;
    template[1] = args[0];
    template[3] = args[1];
    return template.join('');
}
//...这里可以调用上面的代码

var buildHtml = (function () {
    var template = ['<table><tr><td>',
        '',
        '</td><td>',
        '',
        '<td></td></tr></table>'];
    return function (args) {
        template[1] = args[0];
        template[3] = args[1];
        return template.join('');
    }
})();

var factorial = (function () {
    var cache = [];
    return function (num) {
        if (!cache[num]) {
            if (num == 0) {
                cache[num] = 1;
            }
            cache[num] = num * factorial(num - 1);
        }
        return cache[num];
    }
})();

function factorial(num) {
    if (num == 0) {
        return 1;
    }
    return num * aa(num - 1);
}

(function (window, undefined) {

    window.ymPrompt = {}; //

})(window);

function wrapFns() {
    var arr = [];
    for (var i = 10; i--;) {
        arr[i] = function () {
            return i;
        }
    }
    return arr;
}

var fns = wrapFns();
console.log(fns[10]()); // 值是多少？

var win = (function () {
    var fn1 = function () {
        },//私有方法
        pro = 1;//私有属性
    return {
        outFns1: function () {
            //TODO 调用fn1或pro
        },
        outFns2: function () {
            //TODO 调用fn1或pro
        }
    }
})();

function Construt() {
    this.aa = '1';
    this.fun1 = function () {
    };
    this.fun2 = function () {
    };
}

function Construt() {
    this.aa = '1';
}
Construt.prototype = {
    constructor: Construt,
    fun1: function () {
    },
    fun2: function () {
    }
}

var x = 5;
var example = {
    x: 100,
    a: function () {
        var x = 200;
        console.log('a context: %s, var x = %s', this.x, x);
    },
    b: function () {
        var x = 300;
        return function () {
            var x = 400;
            console.log('b context: %s, var x = %s', this.x, x);
        };
    },
    c: function () {
        var other = {
            x: 500
        };
        var execB = this.b().bind(other);
        execB();
        return execB;
    }
}
console.log('example.x:' + example.x);//100
example.a();//100,200
example.b()();//5,400
example.a.call({
    x: 9999
});//9999,200
var execB = example.c(); // 500,400
execB.call({
    x: 9999
}); //900,400

$(function () {
    //…
    outExport = function () {//初始化未经声明的变量，outExport成为全局变量，产生闭包
        //...
    };
    document.getElementById('zgswjg').addEventListener('click', function (event) {
    })
    //…
});



