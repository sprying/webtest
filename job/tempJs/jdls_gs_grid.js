var myValidate = function() {
};
// 重置表单，去掉所有错误提示
$.fn.gsResetForm = function() {
    if ($(this[0]).is('form')) {
        return this.validate().resetForm();
    }
}
myValidate.defaults = function(options) {
    $.validator.setDefaults($.extend({}, {
        onfocusout : function(element, event) {
            // modify by lho 去掉空格
            if (element.nodeName.toLowerCase() != 'select') {
                $(element).val($.trim(element.value));
            }

            if (!this.checkable(element)) {
                this.element(element);
            }
        },
        errorClass : "errormessage",
        errorPlacement : function(error, element) {
            var elem = $(element);
            var elover = elem;
            if (elem.is(":checkbox")
                || elem.is(":radio")
                || (elem.is("select") && $.browser.msie && $.browser.version == "6.0" || elem
                .closest(".div_search").length > 0)) {
                elem.parent().addClass("errormessage");
                elover = elem.parent();
            }

            elover.mouseover(function() {
                if (!elover.hasClass("errormessage")) {
                    return;
                }
                var of = $(this).offset();
                var ms = $("<div class='emsgbox' id='emsgbox'>" + error.html() + "</div>").css({
                    left : of.left,
                    top : (of.top + $(this).outerHeight() + 3)
                });
                $("body").append(ms);
            }).mouseout(function() {
                    $("#emsgbox,.emsgbox").remove();
                })
        }
    }, options));

    /**
     * 正宗的校验方法在这里啦。
     */
    $.validator.prototype.check = function(element) {
        // 针对radio和checkbox做处理
        element = this.validationTargetFor(this.clean(element));
        var rules = $(element).rules();
        var dependencyMismatch = false;
        for (var method in rules) {
            var rule = {
                method : method,
                parameters : rules[method]
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
        setTimeout(function() {
            $(element).trigger('success');
        }, 0);

        if (dependencyMismatch)
            return;
        if (this.objectLength(rules))
            this.successList.push(element);

        return true;
    }

    $.fn.validateForm = function() {
        if ($(this[0]).is('form')) {
            return this.validate().validateForm();
        }
    };

    $.extend($.validator.prototype, {
        validateForm : function() {
            var me = this;
            var errorElement = [];
            for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
                if (this.checkNew(elements[i]) === false) {
                    errorElement.push(elements[i]);
                }
            }
            $(errorElement).each(function() {
                me.element(this);
            });
            return errorElement.length ? false : true;
        },
        checkNew : function(element) {
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

    jQuery.extend(jQuery.validator.messages, {
        required : "必选字段",
        remote : "请修正该字段",
        email : "请输入正确格式的电子邮件",
        url : "请输入合法的网址",
        date : "请输入合法的日期",
        dateISO : "请输入合法的日期 (ISO).",
        number : "请输入合法的数字",
        digits : "只能输入整数",
        creditcard : "请输入合法的信用卡号",
        equalTo : "请再次输入相同的值",
        accept : "请输入拥有合法后缀名的字符串",
        maxlength : jQuery.validator.format("请输入一个长度最多是 {0} 的字符串"),
        minlength : jQuery.validator.format("请输入一个长度最少是 {0} 的字符串"),
        rangelength : jQuery.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
        range : jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
        max : jQuery.validator.format("请输入一个最大为 {0} 的值"),
        min : jQuery.validator.format("请输入一个最小为 {0} 的值")
    });

};
myValidate.init = function() {
    myValidate.defaults();
    // 对vd做默认值的替换，当出错时在INPUT中显示下划错，如果是RD和CD的话就在他的父级显示下错，然后对相关的对象做鼠标移上动作
    if (typeof(validateJson) != 'undefined') {
        var json_objs = validateJson[0]; // 数据放在一个长度为1的对象中
        for (var key in json_objs) {
            myValidate.createValidateUnit(key, json_objs[key]);
        }
    }
}

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
myValidate.addRule = function(key, methodName, message, func) {
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
        messages : {}
    };
    rule[methodName] = true;
    rule.messages[methodName] = message;

    $key.each(function(index, el) {
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
myValidate.removeRule = function(key, methodName) {
    if (!key || !methodName)
        return;

    var $key = $(key);
    if (!$key || !$key.length)
        return;
    $($key[0].form).validate();

    $key.each(function(index, el) {
        $(el).rules("remove", methodName);
    });
}

myValidate.createValidateUnit = function(field, json_objs) {
    var rules = "";
    var message = "";
    for (var i = 0; i < json_objs.length; i++) {
        rules = rules + json_objs[i].method + ":true,";
        message = message + json_objs[i].method + ":'" + json_objs[i].errmsg + "'";
        if (i != json_objs.length - 1)
            message += ",";
        myValidate.addMethod(json_objs[i]);
    }
    myValidate.addClass(rules, message, field);
}
myValidate.addClass = function(rule, message, field) {
    var classStr = "{validate:{";
    classStr += rule;
    classStr = classStr + " messages:{" + message + "}}}";
    $("#" + field).addClass(classStr);
}
myValidate.addMethod = function(obj) {
    if ($.validator.methods[obj.method] == undefined) {
        jQuery.validator.addMethod(obj.method, function(value, element) {
            value = StringUtil.trimSpace(value);
            var result = true;
            eval(obj.expresstion);
            return result;
        }, obj.errmsg);
    }
}
/**
 * 税友，个税， 表格组件
 * @author: ywx
 */
(function($) {
	$.extend($.fn, {
		jdlsGrid: function(options) {

			//选择器为选择到有效Html节点，则直接返回。
			if(!this.length)
				return;

			var gdlsGrids = [], //表格组件对象数组
			gdlsGridObj;	//用于临时存储单个表格组件对象
			this.each( function() {
				$domEl = $(this);
				//组件可接受table 或 tbody作为目标html节点。
				if($domEl.is('table')) {
					var $tbodys = $domEl.find('tbody');
					if($tbodys.length) {
						$tbodys.each( function() {
							getjdlsGrid(this);
						});
					} else {
						getjdlsGrid($domEl[0]);
					}
				}

				if($domEl.is('tbody')) {
					getjdlsGrid($domEl[0]);
				}
			});
			function getjdlsGrid(dom) {
				gdlsGridObj = $.data(dom, 'gdlsGrid');
				if(! gdlsGridObj) {
					gdlsGridObj = new jdlsGrid($.extend({},options, {
						'domEl':dom
					}));
					$.data(dom, 'gdlsGrid', gdlsGridObj);
				}
				gdlsGrids.push(gdlsGridObj);
			}

			return gdlsGrids[0];
		},
		addRow: function(row) {
			return this.length && $(this[0]).jdlsGrid().addRow(row);
		},
		removeRow: function(row) {
			return this.length && $(this[0]).jdlsGrid().removeRow(row);
		},
		validateTable : function(row) {
			if(this.length) {
				return $(this[0]).jdlsGrid().validateTable(row);
			}
		},
		getTableJsonData : function(row) {
			return this.length && $(this[0]).jdlsGrid().getTableJsonData(row);
		},
		setRowValue: function(row, data) {
			return this.length && $(this[0]).jdlsGrid().setRowValue(row, data);
		},
		reload : function(data) {
			return this.length && $(this[0]).jdlsGrid().reload(data);
		}
	});

	jdlsGrid = function(options) {
		var me = this;

		me.options = $.extend({}, jdlsGrid.defaults, options);
		myValidate.defaults();
		$($(me.options.domEl).closest('form')).validate();
		getRowTemplate.call(me);	//获得增行模板吗，初始化rowLength属性。
		if(me.options.configData && typeof me.options.configData === 'object') {
			me.reload(me.options.configData);
		}

		// 待添加组建初始化部分。
		rowCellInit.call(me);
		// 待添加和元素验证部分。
		cellValidateInit.call(me);
		setDefaultButtonAction.call(me);
		$("." + me.options.addRowClass, me.options.domEl).live('click', function(e) {
			me.addRow(); 	//默认增行事件相应函数。
		});
		$("." + me.options.removeRowClass, me.options.domEl).live('click', function(e) {
			me.removeRow($(e.target).closest('tr')); 	//默认增行事件相应函数。
		});
	};
	$.extend(jdlsGrid, {
		defaults: {
			domEl:null,
			rowTemplate:null,
			addRowClass:'addRow',
			removeRowClass:'removeRow',
			rowDefaultValue: {},	//新增行，表单默认值。
			widgetsInit: null,
			cellValidateInit: null,	 //初始化表格内的校验规则。当增加新行时，自动为新行添加。
			length:0,				 //表格总行数。
			onLoadBefore:null,
			onLoadAftre:null,
			onAddRowBefore:null,
			onAddRowAfter:null,
			onRemoveRowBefore:null,
			onRemoveRowAfter:null,
			onValidateTableBefore:null,
			onValidateTableAfter:null,
			onSetRowValueBefore:null,
			onSetRowValueAfter:null,
			nameIndexFunc:null
		},
		prototype: {
			/**
			 * 增行
			 */
			addRow: function (datas, nameIndexFunc) {
				var me = this;
				var rows = [];
				//无参数，则默认增加一个空行。
				if(!datas) {
					datas = {};
				}
				if(typeof datas === 'function') {
					nameIndexFunc = datas;
				}
				//如果onAddRowBefore 事件返回false则直接结束addRow操作。
				if(!freeAction.call(me, 'onAddRowBefore', datas)) {
					return me;
				}

				if(datas instanceof Array) {
					$(datas).each( function(index, data) {
						rows.push( tableAddRow.call(me) );
						$.extend(data, me.options.rowDefaultValue, data); 		// 新增行初始值。
						me.setRowValue(me.options.length - 1, data);
					})
				} else {
					rows.push( tableAddRow.call(this) );
					$.extend(datas, me.options.rowDefaultValue, datas); 			// 新增行初始值。
					this.setRowValue(me.options.length - 1, datas);
				}
				//动态增加验证内容需要体检验证一下，否则提示框不提示。
				$(rows).each( function() {
					me.validateTable(this);
				});
				freeAction.call(me, 'onAddRowAfter', datas, rows)
				return me;

			},
			/**
			 * @method removeRow 删除行功能。
			 * @param row 可以是 Number/domElement 或者为空。
			 */
			removeRow: function(row) {
				var me = this;
				if(row === undefined) {
					row = $('tr',this.options.domEl);
				}
				if( typeof row === 'number') {
					row = $('tr', this.options.domEl)[row];
				}

				if(this.options.removeMsg) {
					API_Alertgb("提示","确定要删除此行？", function(flag) {
						return flag && remove();
					});
				} else {
					remove();
				}
				function remove() {
					//onRemoveRowBefore 事件返回false则直接结束removeRow操作。
					if(!freeAction.call(me, 'onRemoveRowBefore', row)) {
						return me;
					}

					$(row).each( function(index, tr) {
						$(tr).next('tr').prepend($(tr).find('.titleTh'));
						if(index < $('tr', me.options.domEl).length - 1) {
							$(tr).remove();
						} else {
							me.setRowValue(tr, {
								'input[type=text],input[type=password], input[type=radio], input[type=checkbox], select, textarea':''
							});
						}

					});
					me.options.length = $("tr",me.options.domEl).length;
					setDefaultButtonAction.call(me);
					freeAction.call(me, 'onRemoveRowAfter');
				}

				return this;
			},
			validateTable: function(row ) {
				var result = true;
				if(row === undefined) {
					row = $('tr',this.options.domEl);
				}
				if( typeof row === 'number') {
					row = $('tr',this.options.domEl)[row];
				}

				//如果onValidateTableBefore 事件返回false则直接结束 validateTable 操作。
				if(!freeAction.call(this, 'onValidateTableBefore', row)) {
					return this;
				}
				for(selector in this.options.cellValidateInit) {
					var $form = $(selector,row).closest('form');
					$(selector,row).each( function() {
						if($form.validate().check( this ) === false) {
							result = false;
						}
					});
				}
				freeAction.call(this, 'onValidateTableAfter',row, result);
				return result;
			},
			getTableJsonData: function(row) {
				var jsonData = {};
				if(row === undefined) {
					row = $('tr',this.options.domEl);
				}
				if(typeof row === 'number') {
					row = $('tr',this.options.domEl)[row];
				}

				row.each( function(index,tr) {
					jsonData[index] = getRowData(tr);
				});
				return jsonData;
			},
			/**
			 * @method setRowValue设置行数据。
			 */
			setRowValue: function(row, data) {
				if(arguments.length == 0)
					return this;
				if(arguments.length == 1) {
					data = row;
					row = $(this.options.domEl);
				}
				if(typeof row === 'number')
					row = $('tr',this.options.domEl)[row];

				//如果 onSetRowValueBefore 事件返回false则直接结束 setRowValue 操作。
				if(!freeAction.call(this, 'onSetRowValueBefore', row, data)) {
					return this;
				}
				for( key in data) {
					var $key = $(key, $(row));
					if(!$key || !$key.length)
						continue;
					$key.each( function() {
						if(/radio|checkbox/i.test(this.type)) {
							$(this).attr("checked",false);
							$(data[key]).each( function(index, val) {
								$(this).filter('[value="' + val + '"]').attr("checked",true);
							});
						} else {
							$(this).val(data[key]);
						}

					});
				}
				freeAction.call(this, 'onSetRowValueAfter',row, data);

				return this;

			},
			/**
			 * @method reload 重载表格。
			 */
			reload: function(data) {
				//如果 onLoadBefore 事件返回false则直接结束 reload 操作。
				if(!freeAction.call(this, 'onLoadBefore', data)) {
					return this;
				}

				this.removeRow();
				this.addRow(data);

				freeAction.call(this, 'onLoadAfter', data);

				return this;
			}
		}
	});

	/**
	 * 获取增行模板。
	 */
	function getRowTemplate() {
		if( this.options.domEl ) {
			var $lastTr = $("tr:last",this.options.domEl);
			this.options.rowTemplate = $lastTr.clone();
			this.setRowValue(this.options.rowTemplate, {
			'input[type=text],input[type=password], input[type=radio], input[type=checkbox], select, textarea':''
			});
			this.options.length = $("tr",this.options.domEl).length;
		}
	}

	function getRowData(tr) {
		var $tr = $(tr),
		resultJson = {};
		$('input[type="text"], input[type="password"], input[type="radio"], input[type="checkbox"], select, textarea'
		, $tr).each( function(index, el) {
			if(/radio|checkbox/i.test(el.type)) {
				var checkedTag = $('[name="' + el.name + '"]:checked',$tr);
				var value = null;
				if(checkedTag.length >= 2) {
					value = [];
					checkedTag.each( function(index, tag) {
						value.push(tag.value);
					});
				} else if(checkedTag.length == 1) {
					value = checkedTag.val();
				}
				resultJson[ $(el).attr("name")] = value;
			} else {
				resultJson[$(el).attr("id") || $(el).attr("name")] = $(el).val();
			}
		});
		return resultJson;
	}

	function tableAddRow() {
		var lastTr = this.options.rowTemplate.clone();
		this.options.length += 1;
		lastTr.find('.titleTh').remove();
		changeName(lastTr, this.options.length, this.options.nameIndexFunc);
		$(this.options.domEl).append(lastTr);	//通过模板生成新行
		$('tr:first>.titleTh', this.options.domEl).attr('rowspan', this.options.length)
		//TODO 待添加组建初始化部分。
		rowCellInit.call(this, lastTr);
		//TODO 待添加和元素验证部分。
		cellValidateInit.call(this, lastTr);

		setDefaultButtonAction.call(this);
		return lastTr;
	}

	function changeName(tr, index, nameIndexFunc) {
		index = nameIndexFunc ? nameIndexFunc() : index ;
		$('input, select, textarea', tr).each( function() {
			this.id = this.id.toString().replace(/\d+/g,index);
			this.name = this.name.toString().replace(/\d+/g,index);
		});
	}

	function rowCellInit( row ) {
		var me = this;
		if(row === undefined) {
			row = $('tr',me.options.domEl);
		}
		if(typeof row === 'number') {
			row = $('tr', me.options.domEl)[row];
		}
		if(me.options.widgetsInit && typeof me.options.widgetsInit === 'object') {
			var widgetsInit = me.options.widgetsInit;
			for(selector in widgetsInit) {
				$(selector,row).each( function() {
					widgetsInit[selector].call(me, this);
				});
			}
		}

	}

	function cellValidateInit(row) {
		if(row === undefined) {
			row = $('tr',this.options.domEl);
		}
		if(typeof row === 'number') {
			row = $('tr', this.options.domEl)[row];
		}

		if(this.options.cellValidateInit && typeof this.options.cellValidateInit === 'object') {
			var cellValidateInit = this.options.cellValidateInit;
			for(validate in cellValidateInit) {
				var validateOption = cellValidateInit[validate]
				$(validateOption).each( function() {
					myValidate.addRule($(validate, row), this['methodName'], this['message'], this['func']);
				});
			}

		}
	}

	function freeAction () {
		if(arguments.length) {
			var method = arguments[0];
			var array = Array.prototype.slice.call(arguments, 1);
			if(this.options[method]
			&& typeof this.options[method] === 'function'
			&& this.options[method].apply(this, array) === false)
				return false;
		}
		return true;
	}

	function setDefaultButtonAction() {
		var me = this;
		var $addRow = $("." + me.options.addRowClass, me.options.domEl);
		if($addRow.length > 0 ) {
			$addRow.hide();
			$($addRow[$addRow.length - 1]).show();
		}
	}

})(jQuery);




var data = {"data":[{
	"trs":[{
		"tds": {
			"CLASS": {
				"value":"a"
			},
			"NAME": {
				"value":"afsd"
			},
			"ID": {
				"value":"1"
			}
		},
		"opt":null
	},{
		"tds": {
			"CLASS": {
				"value":"a"
			},
			"NAME": {
				"value":"sdaf"
			},
			"ID": {
				"value":"2"
			}
		},
		"opt":null
	}],
	"name":"students",
	"sword":"SwordGrid"
}]};

// 增加任职情况表格组件
var rzqkgrid = $("#rzqkxx").jdlsGrid( {
    removeMsg : true,
    addRowClass : 'addRowRzqk',
    removeRowClass : 'removeRowRzqk'
});