/**
 * @fileoverview 测试页面公共方法
 * @author sprying（方迎春）<sprying.fang@qq.com>
 **/
/**
 * 定义输出提示信息统一函数
 * @param {number,optional}width
 * @param {number,optional}height
 * @param {boolean,optional}isShowScroll
 * @returns {{write: Function, writeln: Function, clear: Function}}
 */
function buildConsole(width,height,isShowScroll) {
    var troggle = 1,
        newDom = document.createElement('div');
    newDom.setAttribute('id', 'hangDiv');
    newDom.style.cssText = 'border-radius: 10px;box-shadow: -5px -5px 7px 10px rgb(218, 233, 226);position: fixed;z-index: 10;' +
        'right: 50px;bottom: 55px;background-color: rgb(218, 233, 226);width: 150px;height: 160px;filter: alpha(Opacity=200);' +
        'opacity: 1;padding: 10px;overflow: hidden;';
    width?newDom.style.width = width + 'px':'';
    height?newDom.style.height = height + 'px':'';
    isShowScroll && (newDom.style.overflow = 'auto');
    var headHtml = '<div id="hangHead" style="width: 100%;height: 30px;line-height: 30px;border-bottom: 1px solid black;" class="dib-wrap">' +
        '打印信息<div style="width:16px;height: 16px;float:right;background-image:url(../images/ymPrompt/ico.gif);background-position: left top;" class="dib"></div></div>';
    //newDom.innerHTML = headHtml;
    document.body.appendChild(newDom);
    var doLayout = function () {
        if (newDom.scrollHeight > newDom.clientHeight) {
            newDom.scrollTop = newDom.scrollHeight - newDom.clientHeight;
        }
    };
    return {
        /**
         * 输出提示信息内容
         * @param {string}args
         * @return {Object} 输出信息对象
         */
        write: function (args) {
            if (troggle) {
                troggle--;
                newDom.innerHTML += '<span style="color: orangered">' + args + '</span> '; //空格是当args数字时，无法换行而准备
            } else {
                troggle++;
                newDom.innerHTML += '<span style="color: brown">' + args + '</span> ';
            }
            doLayout();
            return this;
        },
        /**
         * 按行输出提示信息内容
         * @param args
         * @return {Object} 输出信息对象
         */
        writeln: function (args) {
            if (troggle) {
                troggle--;
                newDom.innerHTML += '<span style="color: orangered">' + args + '</span><br/>'; //空格是当args数字时，无法换行而准备
            } else {
                troggle++;
                newDom.innerHTML += '<span style="color: brown">' + args + '</span><br/>';
            }
            doLayout();
            return this;
        },
        /**
         * 清空提示信息输出窗内容
         * @return {Object} 输出信息对象
         */
        clear: function () {
            newDom.innerHTML = '';
            return this;
        }

    }
}
var msgOut = buildConsole(500,300,true);
