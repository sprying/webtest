// 重置表单，去掉所有错误提示
$.fn.gsResetForm = function () {
    if ($(this[0]).is('form')) {
        return this.validate().resetForm();
    }
};
var myValidate = function () {
};
myValidate.defaults = function (options) {
    $.validator.setDefaults($.extend({}, {
        onfocusout: function (element, event) {
            // modify by lho 去掉空格
            if (element.nodeName.toLowerCase() != 'select') {
                $(element).val($.trim(element.value));
            }

            if (!this.checkable(element)) {
                this.element(element);
            }
        },
        errorClass: "errormessage",
        errorPlacement: function (error, element) {
            var elem = $(element),
                elover = elem;
            if (elem.is(":checkbox")
                || elem.is(":radio")
                || (elem.is("select") && $.browser.msie && $.browser.version == "6.0" || elem
                .closest(".div_search").length > 0)) {
                elem.parent().addClass("errormessage");
                elover = elem.parent();
            }

            elover.mouseover(function () {
                if (!elover.hasClass("errormessage")) {
                    return;
                }
                var of = $(this).offset();
                var ms = $("<div class='emsgbox' id='emsgbox'>" + error.html() + "</div>").css({
                    left: of.left,
                    top: (of.top + $(this).outerHeight() + 3)
                });
                $("body").append(ms);
            }).mouseout(function () {
                    $("#emsgbox,.emsgbox").remove();
                })
        }
    }, options));

    /**
     * 正宗的校验方法在这里啦。
     */
    $.validator.prototype.check = function (element) {
        // 针对radio和checkbox做处理
        element = this.validationTargetFor(this.clean(element));
        var rules = $(element).rules(),
            dependencyMismatch = false;
        for (var method in rules) {
            var rule = {
                method: method,
                parameters: rules[method]
            };
            try {
                // 调用验证规则处理.
                var result = $.validator.methods[method].call(this, element.value.replace(/\r/g, ""), element,
                    rule.parameters);
                // if a method indicates that the field is optional and
                // therefore valid,
                // don't mark it as valid when there are no other rules
                if (result == "dependency-mismatch") {
                    dependencyMismatch = true;
                    continue;
                }
                dependencyMismatch = false;

                if (result == "pending") {
                    this.toHide = this.toHide.not(this.errorsFor(element));
                    return;
                }

                if (!result) {
                    this.formatAndAdd(element, rule);
                    $(element).trigger('error');
                    return false;
                }
            } catch (e) {
                this.settings.debug
                    && window.console
                && console.log("exception occured when checking element " + element.id + ", check the '"
                    + rule.method + "' method", e);
                throw e;
            }
        }
        setTimeout(function () {
            $(element).trigger('success');
        }, 0);

        if (dependencyMismatch)
            return;
        if (this.objectLength(rules))
            this.successList.push(element);

        return true;
    };

    $.extend($.validator.prototype, {
        validateForm: function () {
            var me = this;
            var errorElement = [];
            for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
                if (this.checkNew(elements[i]) === false) {
                    errorElement.push(elements[i]);
                }
            }
            $(errorElement).each(function () {
                me.element(this);
            });
            return errorElement.length ? false : true;
        },
        checkNew: function (element) {
            // 针对radio和checkbox做处理
            element = this.validationTargetFor(this.clean(element));
            var rules = $(element).rules();
            var dependencyMismatch = false;
            for (var method in rules) {
                if ($.validator.methods[method].call(this, element.value.replace(/\r/g, ""), element, rule.parameters) === false)
                    return false;
            }
            return true;
        }

    });

    $.fn.validateForm = function () {
        if ($(this[0]).is('form')) {
            return this.validate().validateForm();
        }
    };

    jQuery.extend(jQuery.validator.messages, {
        required: "必选字段",
        remote: "请修正该字段",
        email: "请输入正确格式的电子邮件",
        url: "请输入合法的网址",
        date: "请输入合法的日期",
        dateISO: "请输入合法的日期 (ISO).",
        number: "请输入合法的数字",
        digits: "只能输入整数",
        creditcard: "请输入合法的信用卡号",
        equalTo: "请再次输入相同的值",
        accept: "请输入拥有合法后缀名的字符串",
        maxlength: jQuery.validator.format("请输入一个长度最多是 {0} 的字符串"),
        minlength: jQuery.validator.format("请输入一个长度最少是 {0} 的字符串"),
        rangelength: jQuery.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
        range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
        max: jQuery.validator.format("请输入一个最大为 {0} 的值"),
        min: jQuery.validator.format("请输入一个最小为 {0} 的值")
    });

};
myValidate.init = function () {
    myValidate.defaults();
    // 对vd做默认值的替换，当出错时在INPUT中显示下划错，如果是RD和CD的话就在他的父级显示下错，然后对相关的对象做鼠标移上动作
    if (typeof(validateJson) != 'undefined') {
        var json_objs = validateJson[0]; // 数据放在一个长度为1的对象中
        for (var key in json_objs) {
            myValidate.createValidateUnit(key, json_objs[key]);
        }
    }
};

/**
 * <p>
 * 为页面元素动态添加验证规则
 * </p>
 *
 * @param key
 *            待添加元素的选择器字符串
 * @param methodName
 *            为添加的验证规则起的名字。
 * @param message
 *            验证规则的提示信息
 * @param func
 *            可选参数，为验证规则的实际调用方法，如果不些此方法，将通过MethodName找到之前设置的同名验证规则。
 */
myValidate.addRule = function (key, methodName, message, func) {
    if (!key || !methodName || !message)
        return;
    var $key = $(key);
    if (!$key || !$key.length)
        return;
    $($key[0].form).validate();
    if (func && typeof func == 'function') {
        $.validator.addMethod(methodName, func, message);
    }

    var rule = {
        messages: {}
    };
    rule[methodName] = true;
    rule.messages[methodName] = message;

    $key.each(function (index, el) {
        $(el).rules("add", rule);
    });
};

/**
 * <p>
 * 为元素动态删除验证规则
 * </p>
 *
 * @param key
 *            待添加元素的选择器字符串
 * @param methodName
 *            待删除的方法名
 */
myValidate.removeRule = function (key, methodName) {
    if (!key || !methodName)
        return;

    var $key = $(key);
    if (!$key || !$key.length)
        return;
    $($key[0].form).validate();

    $key.each(function (index, el) {
        $(el).rules("remove", methodName);
    });
};
/**
 * 添加控件校验
 * @param field 要校验的控件Id
 * @param json_objs 校验规则
 */
myValidate.createValidateUnit = function (field, json_objs) {
    var rules = "",
        message = "";
    for (var i = 0; i < json_objs.length; i++) {
        rules = rules + json_objs[i].method + ":true,";
        message = message + json_objs[i].method + ":'" + json_objs[i].errmsg + "'";
        if (i != json_objs.length - 1)
            message += ",";
        myValidate.addMethod(json_objs[i]);
    }
    myValidate.addClass(rules, message, field);
};
myValidate.addClass = function (rule, message, field) {
    var classStr = "{validate:{";
    classStr += rule;
    classStr = classStr + " messages:{" + message + "}}}";
    $("#" + field).addClass(classStr);
};
myValidate.addMethod = function (obj) {
    if ($.validator.methods[obj.method] == undefined) {
        jQuery.validator.addMethod(obj.method, function (value, element) {
            var result = true;
            value = $.trim(value);
            eval(obj.expresstion);
            return result;
        }, obj.errmsg);
    }
};
