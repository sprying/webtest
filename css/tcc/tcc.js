/**
 * @author by fangyc
 * @title 纳税人详细信息弹出窗基础组件
 * @dependency jQuery 弹出窗基础组件
 */
//设置装载状态
//setLoading({msg:"title",event:"close",showbar:true})
function setLoading(obj) {
    var _msg = obj.msg ? obj.msg : "loading..."; //默认信息
    var _event = obj.event ? obj.event : "show";//显示LOADING框就用SHOW. obj.event 为"close" 关闭 默认为显示
    var _clsbtn = obj.clsbtn ? obj.clsbtn : false;//显示关闭按钮默认为不显示
    var _showbar = true;//是否显示进度条 默认为true
    var _mask = !obj.mask ? false : true;
    var ie6 = false;
    if ($.browser.msie) {
        if ($.browser.version == "6.0") {
            ie6 = true;
        }
    }

    try {
        _showbar = obj.showbar;
        if (_showbar == undefined) {
            _showbar = true;
        }
    } catch (ee) {
        _showbar = true;
    }

    var getWinSize = function () {
        return [Math.max(document.body.scrollWidth, document.body.clientWidth), Math.max(document.body.scrollHeight, document.body.clientHeight)]
    };

    if (_event == "show") {
        if ($("setloading").length > 0) {
            $("#loadingmsg").html(_msg);
            showbar()
            return;
        }
    } else if (_event == "close") {
        closeLoading();
        return;
    }

    var str = '<div id="setloading"  class="setloading">';
    str = str + '<table   border="0" cellspacing="0" cellpadding="0" width="100%" id="loading">';
    str = str + '		<tr>';
    str = str + '		  <td width="100%" height="51" align="center"><div id="loadingclose"><span></span></div><div id="loadingmsg">' + _msg + '</div>';
    str = str + '			<div  class="loadingbar"></div></td>';
    str = str + '		</tr>';
    str = str + '	  </table>';
    str = str + '	</div>';

    var maskstr = "<div id='maskbottom' style='position:absolute;top:0;left:0;z-index:9999;background:#000;opacity:0.1;filter:alpha(opacity=10)'></div>" + ( ie6 ? ("<iframe id='maskiframebottom' src='javascript:function(){}' style='position:absolute;top:0;left:0;z-index:9998;opacity:0;filter:alpha(opacity=0);'></iframe>") : '');

    if (_mask) {
        $("body").prepend(maskstr);
        $("body").css("overflow", "hidden")
        $("#maskbottom,#maskiframebottom").width(getWinSize()[0]).height(getWinSize()[1]);
    }


    $("body").prepend(str);
    showbar();
    if (_clsbtn) {
        $("#loadingclose span").click(function () {
            closeLoading();
        })
    } else {
        $("#loadingclose").hide();
    }

    function showbar() {
        if (!_showbar) {
            $(".loadingbar").hide();
        } else {
            $(".loadingbar").show();
        }
    }

    function closeLoading() {
        $("#setloading").find("*").unbind();
        $("body").css("overflow", "");
        $("#setloading,#maskbottom,#maskiframebottom").remove();
    }

}
;this.iitms = this.iitms || {};
(function ($,iitms, undefined) {
    (function(iitms){
        function UUID() {
            this.id = this.createUUID();
        }

        UUID.prototype.valueOf = function () {
            return this.id;
        }
        UUID.prototype.toString = function () {
            return this.id;
        }
        UUID.prototype.createUUID = function () {
            var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
            var dc = new Date();
            var t = dc.getTime() - dg.getTime();
            var tl = UUID.getIntegerBits(t, 0, 31);
            var tm = UUID.getIntegerBits(t, 32, 47);
            var thv = UUID.getIntegerBits(t, 48, 59) + '1'; // version 1, security version is 2
            var csar = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
            var csl = UUID.getIntegerBits(UUID.rand(4095), 0, 7);

            var n = UUID.getIntegerBits(UUID.rand(8191), 0, 7) +
                UUID.getIntegerBits(UUID.rand(8191), 8, 15) +
                UUID.getIntegerBits(UUID.rand(8191), 0, 7) +
                UUID.getIntegerBits(UUID.rand(8191), 8, 15) +
                UUID.getIntegerBits(UUID.rand(8191), 0, 15); // this last number is two octets long
            return tl + tm + thv + csar + csl + n;
        }
        UUID.getIntegerBits = function (val, start, end) {
            var base16 = UUID.returnBase(val, 16);
            var quadArray = new Array();
            var quadString = '';
            var i = 0;
            for (i = 0; i < base16.length; i++) {
                quadArray.push(base16.substring(i, i + 1));
            }
            for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
                if (!quadArray[i] || quadArray[i] == '')
                    quadString += '0';
                else
                    quadString += quadArray[i];
            }
            return quadString;
        }
        UUID.returnBase = function (number, base) {
            return (number).toString(base).toUpperCase();
        }
        UUID.rand = function (max) {
            return Math.floor(Math.random() * (max + 1));
        }
        iitms.createUUID = new UUID();
    })(iitms);
    var objType = function(type) {
        return new Function('o', "return Object.prototype.toString.call(o)=='[object " + type + "]'")
    }; //判断元素类型
    $.extend(iitms,{
        isArray:function(){
            objType('Array');
        } ,
        isObj:function(){
            objType('Object');//判断元素是否数组、object
        }
    });

    // 弹出窗缓存，key：value；kew是查询条件，value是查询结果outData
    var cacheData = {},
    // 记录选中的纳税人
        selected = "",
    // 弹出窗默认展示数据
        outDataTemplate = {
            /*返回类型，如more、one、cx_noexist*/
            bzxx: "",
            /*提示信息内容*/
            msg: "",
            /*纳税人为空时，提示信息类型*/
            msgType: "",
            /*纳税人信息Json，是数组形式*/
            nsrxxJson: [],
            /*税费名称S(税)F(费)*/
            sfmc: "",
            /*业务类型代码*/
            ywlxDm: "",
            /*业务类型名称*/
            ywlxMc: "",
            /*自定义提示信息*/
            tipMsg: {qxTip: "${nsrOrJfr}主管税务机关为${swjg}，主管税务科所为${swkfj}" +
                "，不在操作员权限税务机关范围内，请${nsrOrJfr}到相应的税务机关办理业务。ps:来自页面自定义提示消息"},
            msgTitle: '提示信息'
        },
    // 调用组件传入参数的默认值
        inDataTemplate = {
            contextPath: "",
            fn: function (isEmpty, param) {
            },
            tipMsg: {},
            winClose: "before",
            ywlxKz: "",
            gwxh: "",
            zndm: "",
            gwssswjg: "",
            nsrsbh: "",
            isS: "",
            zgswjgDm: ""
        },
        /**
         * 生成弹出窗的Html
         */
            templateFac = function (template, jsonList) {
            var res = /([\w\W]*)\<repeat\>([\w\W]*)\<\/repeat\>([\w\W]*)/.exec(template);
            var tempArray = [], temp;
            for (var i = 0, l = jsonList.length; i < l; i++) {
                var nsrxx = jsonList[i];
                temp = res[2];
                for (var pro in nsrxx) {
                    var reg = new RegExp('\\$\\{' + pro + '\\}');
                    if (pro == 'djrq') {
                        temp = temp.replace(reg, nsrxx[pro].split(' ')[0]);
                    } else if (pro == 'dkdjBz' || pro == 'wtdzBz') {
                        temp = temp.replace(reg, nsrxx[pro] == "Y" ? "是" : "否");
                    } else {
                        temp = temp.replace(reg, nsrxx[pro]);
                    }
                }
                tempArray.push(temp);
            }
            return res[1] + '' + tempArray.join('') + '' + res[3];
        },
        popWin = {
            /**
             * 唯一性标志，由查询条件生成
             */
            __id: "",
            /*
             * 纳税人信息列表Html模板
             */
            __template_html: '<div class="cntntWin">\
            <div class="list_title"><div class="head">纳税人信息列表</div></div>\
            <table width="100%" border="0" cellpadding="0" cellspacing="0"  id="ddtable" class="list" freezeRowNum="1" freezeColumnNum="1">\
                <tbody><tr>\
                    <th width="5%"></th>\
                    <th>登记机关</th>\
                    <th style="width:150px">登记日期</th>\
                    <th>纳税人识别号</th>\
                    <th>纳税人名称</th>\
                    <th>组织机构代码</th>\
                    <th>税务登记类型</th>\
                    <th>临时税务登记类型</th>\
                    <th>纳税人状态</th>\
                    <th>登记注册类型</th>\
                    <th>行业</th>\
                    <th>注册地址行政区划</th>\
                    <th>注册所在地</th>\
                    <th>生产经营地址行政区划</th>\
                    <th style="width:150px">生产经营地址</th>\
                    <th>法定代表人姓名</th>\
                    <th>法定代表人证件名称</th>\
                    <th>法定代表人证件号码</th>\
                    <th>街道乡镇</th>\
                    <th>单位隶属关系</th>\
                    <th>主管税务机关</th>\
                    <th>主管税务所（科、分局）</th>\
                    <th>税收管理员</th>\
                    <th>代扣代缴</th>\
                    <th>委托代征</th>\
                    <th><div class="jyfw" id="jyfwTh">经营范围</div></th>\
                    <th>国家（地区）</th><th>增值税企业类型</th>\
                </tr></tbody>\
                <tbody id="mypzxx"><repeat><tr>\
                    <td><input type="radio" name="target_nsr" value="${nsrdzdah}"></td>\
                    <td>${djjgMc}</td>\
                    <td>${djrq}</td>\
                    <td>${nsrsbh}</td>\
                    <td>${nsrmc}</td>\
                    <td>${zzjgDm}</td>\
                    <td>${swdjlxMc}</td>\
                    <td>${lsSwdjlxMc}</td>\
                    <td>${nsrztMc}</td>\
                    <td>${djzclxMc}</td>\
                    <td>${hyMc}</td>\
                    <td>${zcdzXzqhSzMc}</td>\
                    <td>${zcszd}</td>\
                    <td>${scjydzZxqhSzMc}</td>\
                    <td>${scjydz}</td>\
                    <td>${fddbrXm}</td>\
                    <td>${fddbrSfzjzlMc}</td>\
                    <td>${fddbrSfzjHm}</td>\
                    <td>${jdxzMc}</td>\
                    <td>${dwLsgxMc}</td>\
                    <td>${zgSwjgMc}</td>\
                    <td>${zgSwskfjMc}</td>\
                    <td>${ssglyMc}</td>\
                    <td>${dkdjBz}</td>\
                    <td>${wtdzBz}</td>\
                    <td><div class="jyfw">${jyfw}</div></td>\
                    <td>${gjhdqszMc}</td>\
                    <td>${zzsqylxMc}</td>\
                </tr></repeat></tbody>\
            </table>\
            <div class="list_btdiv"><input type="button" value="确定" id="select_btn" class="bts_public"></div></div>',
            /**
             * ajax请求参数
             */
            __inData: {
            },
            /**
             * 后台返回的数据
             */
            __outData: {
            },
            /**
             * 转换提示信息模板
             * @param nsrxx
             */
            __convertTemplate: function (nsrxx) {
                var tipMsg = this.__outData.tipMsg,
                    zgSwjgMc = nsrxx.zgSwjgMc,
                    zgSwskfjMc = nsrxx.zgSwskfjMc,
                    sbSwskfjMc = nsrxx.sbSwskfjMc,
                    sbSwjgMc = nsrxx.sbSwjgMc;
                for (var msg in tipMsg) {
                    tipMsg[msg] = tipMsg[msg].replace(/\$\{nsrOrJfr\}/g, this.__outData.sfmc == 'S' ? "纳税人" : "缴费人");
                    tipMsg[msg] = tipMsg[msg].replace(/\$\{swjg\}/g, this.__outData.sfmc == 'S' ? zgSwjgMc : sbSwjgMc);
                    tipMsg[msg] = tipMsg[msg].replace(/\$\{swkfj\}/g, this.__outData.sfmc == 'S' ? zgSwskfjMc : sbSwskfjMc);
                    tipMsg[msg] = tipMsg[msg].replace(/\$\{ywlxMc\}/g, this.__outData.ywlxMc);
                    tipMsg[msg] = tipMsg[msg].replace(/\$\{ywlxDm\}/g, this.__outData.ywlxDm);
                    for (var nsrdetail in nsrxx) {
                        var regExp = new RegExp('\\$\\{' + nsrdetail + '\\}', 'g');
                        tipMsg[msg] = tipMsg[msg].replace(regExp, nsrxx[nsrdetail]);
                    }
                }
            },
            /**
             * 由电子档案号获取纳税人信息
             * @param nsrdzdah
             * @returns {*}
             */
            __getNsrByDzdah: function (nsrdzdah) {
                var out = this.__outData;
                for (var i = 0, l = out.nsrxxJson.length; i < l; i++) {
                    if (out.nsrxxJson[i].nsrdzdah == nsrdzdah) {
                        return out.nsrxxJson[i];
                    }
                }
                return {};
            },
            /**
             * 数据校验处理
             * @memberOf {TypeName}
             * @return {TypeName}
             */
            __checkForm: function () {
                var inData = this.__inData;
                inData.nsrsbh = $.trim(inData.nsrsbh);
                if (!inData.ywlxKz || !inData.nsrsbh || !inData.gwxh || !inData.zndm || !inData.gwssswjg || !inData.contextPath) {
                    return false;
                }
                if ((inData.isS == "F" || inData.isS == "D") && !inData.zgswjgDm) {
                    return false;
                }
                return true;
            },
            /**
             * 对象外暴方法，初始化弹出窗一系列操作
             * @param opt
             */
            init: function (opt) {
                this.__inData = $.extend({}, inDataTemplate, opt);
//                if(!this.__checkForm()){//本地化
//                    return;
//                }
                $.extend(true, this.__outData, outDataTemplate);
                // 设置自定义提示信息
                $.extend(this.__outData.tipMsg, this.__inData.tipMsg);
                this.__outData.winClose = this.__inData.winClose;
                this.__outData.fn = this.__inData.fn;
                // 不能将函数传递给ajax
                delete this.__inData.fn;
                // 组件根据查询条件生成的唯一性标识
                var iid = "ywlxKz:" + this.__inData.ywlxKz + ",isS:" + this.__inData.isS + ",nsrsbh:" +
                    this.__inData.nsrsbh + ",zgswjgDm:" + (this.__inData.zgswjgDm ? this.__inData.zgswjgDm : "");
                // 若缓存中不存在，则ajax请求数据
                if (!cacheData[iid]) {
                    this.__id = iid;
                    selected = "";
                    // ajax异步请求数据
                    this.__loadData();
                } else if (iid == this.__id) {
                    $.extend(this.__outData, cacheData[iid]);
                    this.__outputXx();
                } else {
                    // 从缓存加载数据到组件的对象
                    $.extend(this.__outData, cacheData[iid]);
                    selected = "";
                    this.__outputXx();
                }
            },
            /**
             * ajax异步请求输出数据
             */
            __loadData: function () {
                var me = this;
                $.ajax({
                    url: "./nsrxx.json",//**** 本地化
                    type: "GET",
                    data: this.__inData,
                    beforeSubmit: function () {
                        setLoading({
                            msg: '正在查询，请稍侯...',
                            event: "show",
                            showbar: true,
                            mask: true
                        });
                        return true;
                    },
                    success: function (data) {
                        setLoading({
                            msg: '正在查询，请稍侯...',
                            event: "close",
                            showbar: true,
                            mask: true
                        });
                        var out = me.__outData;
                        //data.nsrxxJson = $.parseJSON(data.nsrxxJson);//**** 本地化
                        //data = $.parseJSON(data);
                        // 将数据加载到outData
                        $.extend(out, data);
                        if (out.msgType && !(out.msgType in out.tipMsg)) {
                            out.tipMsg[out.msgType] = out.msg;
                        }
                        //me.__saveToCache();
                        me.__outputXx();
                    }
                });
            },
            /**
             * 将记录保存到缓存中
             */
            __saveToCache: function () {
                if (this.__outData.bzxx == "exist" && this.__outData.nsrxxJson.length > 1) {
                    var iid = "ywlxKz:" + this.__inData.ywlxKz + ",isS:" + this.__inData.isS + ",nsrsbh:" +
                        this.__inData.nsrsbh + ",zgswjgDm:" + (this.__inData.zgswjgDm ? this.__inData.zgswjgDm : "");
                    cacheData[iid] = $.extend({}, this.__outData);
                }
            },
            /**
             * 后台查询出数据处理
             */
            __outputXx: function () {
                // 后台查询失败则返回
                if (!this.__outData.bzxx) {
                    return;
                }
                var out = this.__outData,
                    nsrxx;
                if (out.bzxx == "exist") {
                    // 一条记录时
                    if (out.nsrxxJson.length == 1) {
                        nsrxx = out.nsrxxJson[0];
                        // 将模板转化成消息
                        this.__convertTemplate(nsrxx);
                        // 非阻断提示
                        if (nsrxx.tipField && nsrxx.tipField.charAt(0) == 'Y') {
                            out.msgType = "qxTip";
                            if ("qxTip" in out.tipMsg) {
                                API_Alert(out.msgTitle, out.tipMsg["qxTip"]);
                            }
                        }
                        if (nsrxx.tipField && nsrxx.tipField.charAt(1) == 'Y') {
                            out.msgType = "tsclTip";
                            if ("tsclTip" in out.tipMsg) {
                                API_Alert(out.msgTitle, out.tipMsg["tsclTip"]);
                            }
                        }
                        // 执行回调
                        out.fn.call(this, false, nsrxx, out.sfmc, out.fhzfc);
                        // 多条记录时
                    } else {
                        this.__showAlert();
                    }
                } else if (out.bzxx == "cx_noexist" || out.bzxx == "filter_noexist") {
                    // 返回结果为true，不弹出提示信息
                    if (out.fn.call(this, true, out.bzxx, out.sfmc, out.tipMsg[out.msgType])) {
                        return;
                    }
                    API_Alert(out.msgTitle, out.tipMsg[out.msgType]);
                    // 查询出错时
                } else if (data.bzxx == "cx_error") {
                    API_Showerrmsg({
                        minInfo: out.msg,
                        maxInfo: out.errorMsg
                    });
                }
            },
            /**
             * 弹出窗口
             */
            __showAlert: function () {
                var win_html = templateFac(this.__template_html, this.__outData.nsrxxJson),
                    me = this,
                    out = me.__outData;

                function fixedTable(win_html) {
                    var wrapTcc = document.getElementById('tccContainer');
                    if (!wrapTcc) {
                        wrapTcc = document.createElement('div');
                        document.body.appendChild(wrapTcc);
                        wrapTcc.style.position = "absolute";
                        wrapTcc.style.zIndex = '-1';
                    }
                    $(wrapTcc).attr('id', 'tccContainer').append(win_html);
                    eve = fixedFns();
                    return wrapTcc.innerHTML;
                }

                win_html = fixedTable(win_html);
                document.getElementById('tccContainer').innerHTML = '';
                // 弹出选择纳税人信息窗
                API_showMsg({
                    msg: win_html,
                    title: '纳税人详细信息',
                    width: 800,
                    height: 400,
                    handler: function () {
                        document.getElementById('tccContainer').innerHTML = '';
                    }
                });
                if (selected != "") {
                    $(':radio[name="target_nsr"][value="' + selected + '"]').attr("checked", true);
                } else {
                    $(':radio[name="target_nsr"]:eq(0)').attr("checked", true);
                }
                contWin.bindEvent();
                // 绑定点确认事件
                $('#select_btn').bind('click', function (e) {
                    var nsrdzdah = $(':radio[name="target_nsr"]:checked').val(),
                        nsrxx = me.__getNsrByDzdah(nsrdzdah),
                        isClosed = true,
                        tipField = nsrxx.tipField;
                    selected = nsrdzdah;
                    if (out.winClose.toLowerCase() === "after") {
                        isClosed = out.fn.call(me, false, nsrxx, out.sfmc, out.fhzfc);
                        isClosed == null ? true : !!isClosed;
                        if (isClosed) {
                            API_Win_closeself();
                        }
                    } else {
                        API_Win_closeself();
                        out.fn.call(me, false, nsrxx, out.sfmc, out.fhzfc);
                    }
                    // 权限非阻断提示
                    if (!!tipField && tipField.charAt(0) == "Y") {
                        // 将模板转化成消息
                        me.__convertTemplate(nsrxx);
                        out.msgType = "qxTip";
                        API_Alert(out.msgTitle, out.tipMsg[out.msgType]);
                    }
                });
            }
        },
        contWin = {
            fixedRowNum: 0,
            fixedColNum: 0,
            commonTable: '',
            dataTable: '',
            headTable: '',
            ColTable: '',
            tableId: '',
            outHtml: '',
            buildFixedTable: function (inHtml) {
                var rst = /[\w\W]*freezeRowNum\=((?:\d)+)[\w\W]*freezeColumnNum((?:\d)+)[\w\W]*/.exec(inHtml);
                this.tableId = /[\w\W]*id\=([\'\"]?)([\w\W]*)[$1] /.exec(inHtml)[2];
                this.fixedRowNum = rst[1];
                this.fixedColNum = rst[2];
                this.dataTable = $('<div id="' + this.tableId + 'dataTable">' + inHtml + '</div>');
                if (this.fixedRowNum && this.fixedColNum) {
                    this.commonTable = $('<div id="' + this.tableId + 'commonTable">' + inHtml + '</div>');
                }
                if (this.fixedRowNum) {
                    this.headTable = $('<div id="' + this.tableId + 'headTable">' + inHtml + '</div>');
                }
                if (this.fixedColNum) {
                    this.ColTable = $('<div id="' + this.tableId + 'ColTable">' + inHtml + '</div>');
                }
                this.dataTable.scroll(function (e) {
                    this.headTable && this.headTable.scrollLeft(this.headTable.scrollLeft());
                    this.ColTable && this.ColTable.scrollTop(this.ColTable.scrollTop());
                });
            },
            getHeight: function (table,param) {
                if(!iitms.isArray(param)){
                    return 0;
                }
                if(!iitms.isArray(table)){
                    table = $('#'+table) ;
                }
                var rowNum = this.fixedRowNum,
                    showHeight = 0;
                this.headTable.find('tr:lt(' + rowNum + ')').each(function (index, domElem) {
                    if(index>rowNum-1){
                         return false;
                    }
                    rowNum -= $(this).attr('rowspan')|| 0;
                    showHeight += $(this).find('td,th').height();
                })
            },
            bindEvent: function () {
                $('.cntntWin tr').live('mouseover', function (e) {
                    var $tgtTr = $(e.target).closest('tr'),
                        trNum = $tgtTr.prevAll().size() + 1;
                    $('.cntntWin tr').removeClass('overClr');

                    $('.cntntWin tr:nth-child(' + trNum + ')').addClass('overClr');
                })
                $('.cntntWin :radio').live('click', function (e) {
                    var $this = $(this),
                        trNum = 0;
                    if ($this.is(':checked')) {
                        trNum = $this.closest('tr').prevAll().size() + 1;
                        $('.cntntWin tr').removeClass('selClr');
                        $('.cntntWin tr:nth-child(' + trNum + ')').addClass('selClr');
                    }
                });
                var divTableData = $("#ddtable_tableData");
                var divTableHead = $("#ddtable_tableHead");
                var divTableColumn = $("#ddtable_tableColumn");
                divTableData.scroll(function () {
                    divTableHead != null && divTableHead.scrollLeft(divTableData.scrollLeft());

                    divTableColumn != null && divTableColumn.scrollTop(divTableData.scrollTop());
                });
                var maxLen = 0;
                $('.jyfw').each(function (index, e) {
                    var l = strlen($(this).text());
                    l > maxLen ? maxLen = l : '';
                })
                if (maxLen > 35) maxLen = 35;
                $('.jyfw').css('width', maxLen * 6.5 + 3);
            }
        };
    $.extend({
        alertNsrxx: function (opt) {
            popWin.init(opt);
        }
    });
})(jQuery,iitms);