/**
 *  实例化Person，产生person1对象，hasOwnProperty顾名思义，即是否为对象的自身属性
 */
var person1 = new Person("fangyc");
person1.age = 25;
console.log(person1.hasOwnProperty("name")); //true
console.log(person1.hasOwnProperty("sayInstance")); //true
console.log(person1.hasOwnProperty("age")); //true
console.log(person1.hasOwnProperty("country")); //false
console.log(person1.hasOwnProperty("sayName")); //false


function Person() {
}
var person = new Person();
person instanceof  Person; //true
Person.prototype.isPrototypeOf(person); //true,会在原型链上查

// 等价于 var foo = new Array(1, 56, 34, 12);
var arr = [1, 56, 34, 12];
console.log(arr.constructor === Array); // true
// 等价于 var Foo = new Function();
var Foo = function () {
};
console.log(Foo.constructor === Function); // true
// 由构造函数实例化一个obj对象
var obj = new Foo();
console.log(obj.constructor === Foo); // true

Foo.prototype = new Array();
console.log(obj.constructor === Foo); // true

// 将上面两段代码合起来，就得到下面的结论
console.log(obj.constructor.constructor === Function); // true

var o = { x:1};
o.hasOwnProperty("x");       // true
o.hasOwnProperty("y");       // false
o.hasOwnProperty("toString");// false: toString是继承的属性

var o = inherit({y:2});
o.x = 1;
o.propertyIsEnumerable("x"); // true
o.propertyIsEnumerable("y"); // false
Object.prototype.propertyIsEnumerable("toString"); // false: 不可枚举

Function.prototype.getName = function(){
    if("name" in this){
        return this.name;
    }
    return this.name = this.toString().match(/function\s*([^(]*)\(/)[1];
};

Object.prototype.__defineGetter__ = function(attributeName,hanlder){
    if(typeof(hanlder)=="string"){
        handler=new Function(hanlder);
    }
    else if(typeof(hanlder)=="function"){
        $owner = this;
        this[attributeName]={
            valueOf:function(){return hanlder.apply($owner, arguments)},
            toString:function(){return hanlder.apply($owner, arguments)}
        };
    }
    else throw new TypeError();
}
for (var obj1 in person1) {

}