/**
 * Created with JetBrains WebStorm.
 * User: sprying
 * Date: 13-4-18
 * Time: 下午1:49
 * To change this template use File | Settings | File Templates.
 */
jQuery.fn.extend({
    inputTip: function (tip_msg,isGray) {
        var $this_temp = this,
            inpValue = '',
            arr_keyCode =[0,48,32,49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73,
                74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 96, 97, 98,
                99, 100, 101, 102, 103, 104, 105, 106, 107, 109, 110, 111, 186, 187, 189, 190, 191, 192, 219, 220, 221,229],
            tip_msg = tip_msg || '请输入内容',
            color_turned = '#b2b2b2';// 提示字体颜色
        $this_temp.val(tip_msg);
        var _clickFns = function () {
            $this_temp.css('color', color_turned);
            if (this.createTextRange) {
                var appText = this.createTextRange();
                appText.collapse();
                appText.select();
            } else if (this.setSelectionRange) {
                this.focus();
                this.setSelectionRange(0, 0);
            }
        };
        var _blurFns = function () {
            $this_temp.css('color', '');
        }
        var _keyDownFns = function (e) {
            if(arr_keyCode.indexOf(e.keyCode) !== -1) {
                $this_temp.css('color', '').val('').unbind('keydown', _keyDownFns).unbind('click', _clickFns);
                isGray && $this_temp.unbind('blur', _blurFns);
            }
            if(e.keyCode== 37||e.keyCode== 39)
                if (e.preventDefault)
                    e.preventDefault();
                else
                    e.returnValue = false;
        };
        var _keyUpFns = function () {
            if ($this_temp.val() == '') {
                inpValue = $this_temp.val();
                $this_temp.bind({click: _clickFns, keydown: _keyDownFns}).val(tip_msg).trigger('click');
                isGray && $this_temp.bind('blur',_blurFns);
            }else{
                inpValue = $this_temp.val();
            }
            $this_temp.data('inp_value',inpValue);
        };
        $this_temp.bind(
            {
                click: _clickFns,
                keydown: _keyDownFns,
                keyup: _keyUpFns
            }
        );
        isGray && $this_temp.bind('blur',_blurFns);
        if(!isGray){
            $this_temp.css('color',color_turned);
        }
        $this_temp.data('inp_value',inpValue);
    }
});