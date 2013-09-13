/**
 * @author by fangyc
 * @title 纳税人详细信息弹出窗基础组件
 * @dependency jQuery 弹出窗基础组件
 */
(function ($, undefined) {
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
            znDm: "",
            gwssswjg: "",
            nsrsbh: "",
            isS: "Y",
            zgswjgDm: ""
        },
        /**
         * 生成弹出窗的Html
         */
            buildHtml = (function () {
            var buffer = ['<tr class="dwInfo"><td align="center"><input type="radio" name="target_nsr" ',
                    'value="',
                    '',//电子档案号2
                    '"></td><td align="center">',
                    '',//登记机关名称4
                    '</td><td align="center">',
                    '',//登记日期6
                    '</td><td align="center">',
                    '',//纳税人识别号8
                    '</td><td align="center">',
                    '',//纳税人名称10
                    '</td><td align="center">',
                    '',//组织机构代码12
                    '</td><td align="center">',
                    '',//税务登记类型14
                    '</td><td align="center">',
                    '',//临时税务登记类型代码16
                    '</td><td align="center">',
                    '',//纳税人状态18
                    '</td><td align="center">',
                    '',//登记注册类型20
                    '</td><td align="center">',
                    '',//行业22
                    '</td><td align="center">',
                    '',//注册地址行政区划数字代码24
                    '</td><td align="center">',
                    '',//注册所在地26
                    '</td><td align="center">',
                    '',//生产经营地址行政区划数字代码28
                    '</td><td align="center">',
                    '',//生产经营地址30
                    '</td><td align="center">',
                    '',//法定代表人姓名32
                    '</td><td align="center">',
                    '',//法定代表人身份证件种类34
                    '</td><td align="center">',
                    '',//法定代表人身份证件号码36
                    '</td><td align="center">',
                    '',//街道乡镇38
                    '</td><td align="center">',
                    '',//单位隶属关系40
                    '</td><td align="center">',
                    '',//主管税务机关42
                    '</td><td align="center">',
                    '',//主管税务所（科、分局）44
                    '</td><td align="center">',
                    '',//税收管理员46
                    '</td><td align="center">',
                    '',//代扣代缴标志(qyxx_one.dkdjBz === "Y" ? "是" : "否")48
                    '</td><td align="center">',
                    '',//委托代征标志 (qyxx_one.wtdzBz === "Y" ? "是" : "否")50
                    '</td><td align="center">',
                    '',//经营范围52
                    '</td><td align="center">',
                    '',//国家或地区名称54
                    '</td><td align="center">',
                    '',//增值税企业类型56
                    '</td></tr>'],
                fixedHeader = '<div class="listdiv nsrxxTcc">' +
                    '<div class="list_title">' +
                    '<div class="head">' +
                    '纳税人信息列表' +
                    '</div>' +
                    '</div>' +
                    '<table width="100%" border="0" cellpadding="0" cellspacing="0"' +
                    'id="formlist" class="list">' +
                    '<tr>' +
                    '<th width="5%"></th>' +
                    '<th>登记机关</th>' +//登记机关名称
                    '<th style="width:150px">登记日期</th>' +//登记日期
                    '<th>纳税人识别号</th>' +//纳税人名称
                    '<th>纳税人名称</th>' +//纳税人识别号
                    '<th>组织机构代码</th>' +//组织机构代码
                    '<th>税务登记类型</th>' +//税务登记类型名称
                    '<th>临时税务登记类型</th>' +//临时税务登记类型名称
                    '<th>纳税人状态</th>' +//纳税人状态
                    '<th>登记注册类型</th>' +//登记注册类型
                    '<th>行业</th>' +//行业
                    '<th>注册地址行政区划</th>' +//注册地址行政区划
                    '<th>注册所在地</th>' +//注册所在地
                    '<th>生产经营地址行政区划</th>' +//生产经营地址行政区划
                    '<th style="width:150px">生产经营地址</th>' +//生产经营地址
                    '<th>法定代表人姓名</th>' +//法定代表人姓名
                    '<th>法定代表人证件名称</th>' +//法定代表人身份证件种类
                    '<th>法定代表人证件号码</th>' +//法定代表人身份证件号码
                    '<th>街道乡镇</th>' +//街道乡镇
                    '<th>单位隶属关系</th>' +//单位隶属关系代码
                    '<th>主管税务机关</th>' +//主管税务机关
                    '<th>主管税务所（科、分局）</th>' +//主管税务所（科、分局）
                    '<th>税收管理员</th>' +//税收管理员
                    '<th>代扣代缴</th>' +//代扣代缴
                    '<th>委托代征</th>' +//委托代征
                    '<th>经营范围</th>' +//经营范围
                    '<th>国家（地区）</th>' +//国家或地区数字代码
                    '<th>增值税企业类型</th>' +//增值税企业类型
                    '</tr>' +
                    '<tbody id="mypzxx">';
            return function (nsrxxJson, sfmc) {
                var nsrxx = {}, winHtml = [];
                winHtml.push(fixedHeader);
                for (var i = 0, len = nsrxxJson.length; i < len; i++) {
                    nsrxx = nsrxxJson[i];
                    buffer[2] = nsrxx.nsrdzdah;
                    buffer[4] = nsrxx.djjgMc;
                    buffer[6] = nsrxx.djrq.split(' ')[0];
                    buffer[8] = nsrxx.nsrsbh;
                    buffer[10] = nsrxx.nsrmc;
                    buffer[12] = nsrxx.zzjgDm;
                    buffer[14] = nsrxx.swdjlxMc;
                    buffer[16] = nsrxx.lsSwdjlxMc;
                    buffer[18] = nsrxx.nsrztMc;
                    buffer[20] = nsrxx.djzclxMc;
                    buffer[22] = nsrxx.hyMc;
                    buffer[24] = nsrxx.zcdzXzqhSzMc;
                    buffer[26] = nsrxx.zcszd;
                    buffer[28] = nsrxx.scjydzZxqhSzMc;
                    buffer[30] = nsrxx.scjydz;
                    buffer[32] = nsrxx.fddbrXm;
                    buffer[34] = nsrxx.fddbrSfzjzlMc;
                    buffer[36] = nsrxx.fddbrSfzjHm;
                    buffer[38] = nsrxx.jdxzMc;
                    buffer[40] = nsrxx.dwLsgxMc;
                    buffer[42] = nsrxx.zgSwjgMc;
                    buffer[44] = nsrxx.zgSwskfjMc;
                    buffer[46] = nsrxx.ssglyMc;
                    buffer[48] = (nsrxx.dkdjBz === "Y" ? "是" : "否");
                    buffer[50] = (nsrxx.wtdzBz === "Y" ? "是" : "否");
                    buffer[52] = nsrxx.jyfw;
                    buffer[54] = nsrxx.gjhdqszMc;
                    buffer[56] = nsrxx.zzsqylxMc;
                    winHtml.push(buffer.join(''));
                }
                winHtml.push('</tbody></table><div class="list_btdiv" style="width:100%">' +
                    '<input type="button" value="确定" id="select_btn" class="bts_public"/>' +
                    '</div></div>');
                return winHtml.join('');
            }
        })(),
        /**
         * 弹出窗对象
         */
        popWin = {
            /**
             * 根据查询条件，生成唯一性标志
             */
            __id: "",
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
             * 转换模板提示信息
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
             * 对象外暴方法，初始化弹出窗一系列操作
             * @param opt
             */
            init: function (opt) {
                this.__inData = $.extend({}, inDataTemplate, opt);
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
                } else if (iid = this.__id) {
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
             * ajax异步请求得输出数据
             */
            __loadData: function () {
                var me = this;
                $.ajax({
                    url: me.__inData.contextPath + "ui/initAjaxNsrxx.do",
                    type: "POST",
                    data: this.__inData,
                    success: function (data) {
                        var out = me.__outData;
                        data.nsrxxJson = $.parseJSON(data.nsrxxJson);
                        // 将数据加载到outData
                        $.extend(out, data);
                        if (out.msgType && !(out.msgType in out.tipMsg)) {
                            out.tipMsg[out.msgType] = out.msg;
                        }
                        me.__saveToCache();
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
                // 一条记录时
                var out = this.__outData,
                    nsrxx;
                if (out.bzxx == "exist") {
                    if (out.nsrxxJson.length == 1) {
                        nsrxx = out.nsrxxJson[0];
                        // 非阻断提示
                        if (nsrxx.tipField && nsrxx.tipField.charAt(0) == 'Y') {
                            // 将模板转化成消息
                            this.__convertTemplate(nsrxx);
                            out.msgType = "qxTip";
                            if ("qxTip" in out.tipMsg) {
                                API_Alert(out.msgTitle, out.tipMsg["qxTip"]);
                            }
                        }
                        // 执行回调
                        out.fn.call(this, false, nsrxx,out.sfmc);
                        // 多条记录时
                    } else {
                        this.__showAlert();
                    }
                } else if (out.bzxx == "cx_noexist") {
                    // 返回结果为true，不弹出提示信息
                    if (out.fn.call(this, true, out.msgType,out.sfmc)) {
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
                var win_html = buildHtml(this.__outData.nsrxxJson, this.__outData.sfmc),
                    me = this,
                    out = me.__outData;
                // 弹出选择纳税人信息窗
                API_showMsg({
                    msg: win_html,
                    title: '纳税人详细信息',
                    width: 800,
                    height: 400
                });
                if (selected != "") {
                    $(':radio[name="target_nsr"][value="' + selected + '"]').attr("checked", true);
                } else {
                    $(':radio[name="target_nsr"]:eq(0)').attr("checked", true);
                }
                // 绑定点确认事件
                $('#select_btn').bind('click', function (e) {
                    var nsrdzdah = $(':radio[name="target_nsr"]:checked').val(),
                        nsrxx = me.__getNsrByDzdah(nsrdzdah),
                        isClosed = true,
                        tipField = nsrxx.tipField;
                    selected = nsrdzdah;
                    if (out.winClose.toLowerCase() === "after") {
                        isClosed = out.fn.call(this, false, nsrxx,out.sfmc);
                        isClosed == null ? true : !!isClosed;
                        if (isClosed) {
                            API_Win_closeself();
                        }
                    } else {
                        API_Win_closeself();
                        out.fn.call(this, false, nsrxx,out.sfmc);
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
        }
    $.extend({
        alertNsrxx: function (opt) {
            popWin.init(opt);
        }
    });
})(jQuery);