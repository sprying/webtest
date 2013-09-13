/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-3-18
 * Time: 下午2:06
 * To change this template use File | Settings | File Templates.
 */
this.fangyc = this.fangyc ||{};
(function(F,undefined){

    // 判断当前是否是严格模式
    F.isStrict = function(){return !this;};
    /**
     * desc 判断类型
     * @param o
     * @returns {string}
     */
    F.classof = function (o){
        if(o===null) return "Null";
        if(o===undefined) return "Underfined";
        return Object.prototype.toString.call(o).slice(8,-1);
    };

    /**
     * @desc 判断是否为Array
     * @type {*|Function}
     */
    F.isArray = Function.isArray||function(o){
        return typeof o ==="object" &&
            Object.prototype.toString.call(o) === "[object Array]";
    }

    /**
     * @desc 反函数
     * @param f：函数
     * @returns {Function}
     */
    F.not = function (f) {
        return function () {
            var result = f.apply(this, arguments);
            return !result;
        }
    }
})(fangyc);

fangyc.not()
