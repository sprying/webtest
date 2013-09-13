(function ($, undefined) {
    var AlertNsrxx = function (opt) {
        this.opt = $.extend({}, this.defaults, opt);
    };
    AlertNsrxx.prototype = {
        constructor: AlertNsrxx,
        defaults: {
            contextPath: "",
            fn: function () {
            },
            emptyFn:function(msg,msgType,params){
                API_Alert("提示信息", msg);
            },
            winClose: "before",
            ywlxKz: "",
            qxControl:true,
            gwxh: "",
            znDm: "",
            gwswjg: "",
            nsrsbh:"",
            isS:"T",
            zgswjgDm:"",
            tipMsg:{}
        },
        searchNsr: function (qyxx_json, nsrdzdah) {
            for (var i = 0, l = qyxx_json.length; i < l; i++) {
                if (qyxx_json[i].nsrdzdah == nsrdzdah) {
                    return qyxx_json[i];
                }
            }
            return {};
        },
        showTcc: function (qyxx_json, obj,sfmc) {
            var qyxx_arr = [],
                me = this;
            qyxx_arr.push('<div class="listdiv nsrxxTcc">' +
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
                '<tbody id="mypzxx">');
            for (var i = 0, l = qyxx_json.length; i < l; i++) {
                qyxx_one = qyxx_json[i];
                qyxx_arr.push('<tr class="dwInfo">');
                qyxx_arr.push('<td align="center">' +
                    '<input type="radio" name="target_nsr">' +
                    '<input type="hidden" value="' + qyxx_one.nsrdzdah + '">' +
                    '</td>');
                qyxx_arr.push('<td align="center">' + qyxx_one.djjgMc + '</td>');//登记机关名称
                qyxx_arr.push('<td align="center">' + qyxx_one.djrq.split(' ')[0] + '</td>');//登记日期
                qyxx_arr.push('<td align="center">' + qyxx_one.nsrsbh + '</td>');//纳税人识别号
                qyxx_arr.push('<td align="center">' + qyxx_one.nsrmc + '</td>');//纳税人名称
                qyxx_arr.push('<td align="center">' + qyxx_one.zzjgDm + '</td>');//组织机构代码
                qyxx_arr.push('<td align="center">' + qyxx_one.swdjlxMc + '</td>');//税务登记类型
                qyxx_arr.push('<td align="center">' + qyxx_one.lsSwdjlxMc + '</td>');//临时税务登记类型代码
                qyxx_arr.push('<td align="center">' + qyxx_one.nsrztMc + '</td>');//纳税人状态
                qyxx_arr.push('<td align="center">' + qyxx_one.djzclxMc + '</td>');//登记注册类型
                qyxx_arr.push('<td align="center">' + qyxx_one.hyMc + '</td>');//行业
                qyxx_arr.push('<td align="center">' + qyxx_one.zcdzXzqhSzMc + '</td>');//注册地址行政区划数字代码
                qyxx_arr.push('<td align="center">' + qyxx_one.zcszd + '</td>');//注册所在地
                qyxx_arr.push('<td align="center">' + qyxx_one.scjydzZxqhSzMc + '</td>');//生产经营地址行政区划数字代码
                qyxx_arr.push('<td align="center">' + qyxx_one.scjydz + '</td>');//生产经营地址
                qyxx_arr.push('<td align="center">' + qyxx_one.fddbrXm + '</td>');//法定代表人姓名
                qyxx_arr.push('<td align="center">' + qyxx_one.fddbrSfzjzlMc + '</td>');//法定代表人身份证件种类
                qyxx_arr.push('<td align="center">' + qyxx_one.fddbrSfzjHm + '</td>');//法定代表人身份证件号码
                qyxx_arr.push('<td align="center">' + qyxx_one.jdxzMc + '</td>');//街道乡镇
                qyxx_arr.push('<td align="center">' + qyxx_one.dwLsgxMc + '</td>');//单位隶属关系
                qyxx_arr.push('<td align="center">' + qyxx_one.zgSwjgMc + '</td>');//主管税务机关
                qyxx_arr.push('<td align="center">' + qyxx_one.zgSwskfjMc + '</td>');//主管税务所（科、分局）
                qyxx_arr.push('<td align="center">' + qyxx_one.ssglyMc + '</td>');//税收管理员
                qyxx_arr.push('<td align="center">' + (qyxx_one.dkdjBz === "Y" ? "是" : "否") + '</td>');//代扣代缴标志
                qyxx_arr.push('<td align="center">' + (qyxx_one.wtdzBz === "Y" ? "是" : "否") + '</td>');//委托代征标志
                qyxx_arr.push('<td align="center">' + qyxx_one.jyfw + '</td>');//经营范围
                qyxx_arr.push('<td align="center">' + qyxx_one.gjhdqszMc + '</td>');//国家或地区名称
                qyxx_arr.push('<td align="center">' + qyxx_one.zzsqylxMc + '</td>');//增值税企业类型
                qyxx_arr.push('</tr>');
            }
            qyxx_arr.push('</tbody></table><div class="list_btdiv" style="width:100%">' +
                '<input type="button" value="确定" id="select_btn" class="bts_public"/>' +
                '</div></div>');
            API_showMsg({
                msg: qyxx_arr.join(''),
                title: '纳税人详细信息',
                width: 800,
                height: 400
            });
            $(':radio[name="target_nsr"]').bind("change",function(e){
                var $radio_sel = $(':radio[name="target_nsr"]:checked'),
                    nsrdzdah = $radio_sel.next().val(),
                    nsrxx = me.searchNsr(qyxx_json, nsrdzdah);
            });
            // 默认选中第一个单选
            $(':radio[name="target_nsr"]:eq(0)').attr("checked", true).trigger('change');

            // 为确认键绑定事件
            $('#select_btn').bind('click', function (e) {
                var $radio_sel = $(':radio[name="target_nsr"]:checked'),
                    nsrdzdah = $radio_sel.next().val(),
                    nsrxx = me.searchNsr(qyxx_json, nsrdzdah),
                    isClosed = true,
                    tipField = nsrxx.tipField;
                if (obj.winClose.toLowerCase() === "after") {
                    isClosed = obj.fn.call(this,false, nsrxx);
                    isClosed == null ? true : !!isClosed;
                    if (isClosed) {
                        API_Win_closeself();
                    }
                } else {
                    API_Win_closeself();
                    obj.fn.call(this, false, nsrxx);
                }
                // 权限非阻断提示
                if(!!tipField && tipField.charAt(0) == "Y"){
                    API_Alert("提示信息",(sfmc=="S"?"纳税人":"缴费人")+"主管税务机关为"+(sfmc=="S"?nsrxx.zgSwjgMc:nsrxx.sbSwjgMc)+
                        "，主管税务科所为"+(sfmc=="S"?nsrxx.zgSwskfjMc:nsrxx.sbSwskfjMc)+
                        "，不在操作员权限税务机关范围内，请"+(sfmc=="S"?"纳税人":"缴费人")+
                        "到相应的税务机关办理业务。");
                }
            });
        },
        init: function () {
            var opt = this.opt,
                me = this;
            if (!opt.nsrsbh) {
                return;
            }
            if (opt.isS && !opt.zgswjgDm){
                return;
            }
            $.ajax({
                url: opt.contextPath + "ui/initAjaxNsrxx.do",
                type: "POST",
                data: {nsrsbh: opt.nsrsbh, ywlxKz: opt.ywlxKz, gwxh: opt.gwxh, znDm: opt.znDm, gwssswjg: opt.gwswjg, isS:opt.isS, zgswjgDm:opt.zgswjgDm},
                success: function (data) {
                    // 一条记录时
                    me.nsrxxJson = $.parseJSON(data.nsrxxJson);
                    me.sfmc = data.sfmc;
                    if (data.bzxx == "one") {
                        var nsrxx = me.nsrxxJson[0];
                        // 非阻断提示
                        if(nsrxx.tipField && nsrxx.tipField.charAt(0) == 'Y'){
                            API_Alert("提示信息",(data.sfmc=="S"?"纳税人":"缴费人")+"主管税务机关为"+(data.sfmc=="S"?nsrxx.zgSwjgMc:nsrxx.sbSwjgMc)+
                                "，主管税务科所为"+(data.sfmc=="S"?nsrxx.zgSwskfjMc:nsrxx.sbSwskfjMc)+
                                "，不在操作员权限税务机关范围内，请"+(data.sfmc=="S"?"纳税人":"缴费人")+
                                "到相应的税务机关办理业务。");
                        }
                        // 执行回调
                        opt.fn.call(this, false,nsrxx);
                        // 多条记录时
                    } else if (data.bzxx == "more") {
                        me.showTcc(this.nsrxxJson, opt, data.sfmc);
                    } else if (data.bzxx == "cx_noexist") {
                        var isAlert = opt.fn.call(this, true,data.msgType);
                        if(isAlert){
                            return;
                        }
                        if(data.msgType in opt.tipMsg){
                            API_Alert("提示信息",opt.tipMsg[data.msgType]);
                        }else{
                            API_Alert("提示信息",data.message);
                        }
                    } else if (data.bzxx == "cx_error") {
                        API_Showerrmsg({
                            minInfo: "查询异常",
                            maxInfo: data.message
                        });
                    }
                }
            });
        }
    };
    $.extend({
        alertNsrxx:function(opt){
            var newTcc = new AlertNsrxx(opt);
            newTcc.init();
        }
    });
})(jQuery);