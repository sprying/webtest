/**
 * Created with JetBrains WebStorm.
 * User: sprying
 * Date: 12/27/13
 * Time: 5:01 PM
 * To change this template use File | Settings | File Templates.
 */
;
this.shixu || (this.shixu = {});
(function (shixu, undefined) {
    var curMemberId = '',
        config = {
            wrapperName: {
                tabs: 'tabList',
                msgWin: 'tab-content'
            },
            url: {
                initUrl: '',
                loopRequest: 'chat/loopRequest.html'
            },
            loopTime:5000
        },
        /**
         * 循环请求函数
         */
        loopReqFns,
        /**
         * 循环定时器名
         */
        loopTimer;

    $.extend(shixu, {
        adminName: shixu.adminName || "小三",
        tool: {
            setCookie: function (name, value) {
                var Days = 30;
                var exp = new Date();
                exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
                document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
            },
            getCookie: function (name) {
                var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg))
                    return (arr[2]);
                else
                    return null;
            },
            /**
             * 浏览器大小变化时事件
             * @param fn
             */
            bindResize: function (fn) {
                this.__eveCache.push(fn);
            },
            __eveCache: []

        }
    });
    (function () {
        var timeFns;
        window.onresize = function (even) {
            clearTimeout(timeFns);
            timeFns = setTimeout(function () {
                var arr = shixu.tool.__eveCache;
                for (var i = 0, len = arr.length; i < len; i++) {
                    arr[i].call(null, even);
                }
                arr.length = 0;
            }, 100);
        };

    })();

    function Member(id, name, headPic, lastNotice, postDate, unWatchedSum) {
        this.id = id;
        this.name = name;
        this.headPic = headPic;
        this.lastMsg = lastNotice;
        this.lastDate = postDate;
        this.unWatchedSum = unWatchedSum;
    }

    Member.prototype = {
        constructor: Member,
        buildTalkHtml: function () {

        },
        destroyTalkHtml: function () {

        }
    };
    $.extend(Member, {

    });
    var contact = {
            wrapper: 'contactList',
            searchUrl: 'chat/searchContact.html',
            memberList: [],
            focusTarget: '',
            initContact: function (data) {
                var contactArray = [];
                if (data) {
                    this.memberList.push(data);
                }
                for (var i = 0, l = this.memberList.length; i < l; i++) {
                    var member = this.memberList[i];
                    contactArray.push('<li class="list_item" data-memberid="' + member.id + '">' +
                        '<a href="javascript:void(0);" style="position:absolute; " class="avatar">' +
                        '<img src="' + member.headPic + '" class="lazyLoadImg loaded">' +
                        '</a><div style="position:static;margin:0 32px 0 50px">' +
                        '<p class="member_nick">' + member.name + '<span>(' + member.unWatchedSum + ')</span></p>' +
                        '<p class="member_msg text_ellipsis">' + member.lastMsg + '</p>' +
                        '</div><div style="position: absolute;right: 12px;top: 10px;float: right;width: 20px;display: inline-block;height: 40px;">' +
                        '<p style="color: #aaa;line-height: 17px;font-size: 12px;margin: 2px 0 0 0">' + member.lastDate + '</p>' +
                        '<img src="resources/default/img/online.png" style="width:12px;height:11px">' +
                        '</div></li>');
                }
                this.wrapper.html(contactArray.join(''));
            },
            searchMember: function (name) {
                var that = this;
                $.ajax({
                    url: that.searchUrl,
                    type: "post",
                    data: name,
                    success: function (data) {
                        that.initContact(data);
                    }
                });
            },
            triggerComings: function (data) {
            },
            changeFocus: function (member) {
            },
            pushItem: function (member) {
                this.memberList.unshift(member);
                this.initContact();
            },
            bindEvent: function () {
                var member,
                    memberList = this.memberList;
                this.wrapper.on('click', function (e) {
                    if (this.target.tagName == 'li') {
                        curMemberId = this.target['data - memberId'];
                        for (var i = 0, l = memberList.length; i < l; i++) {
                            if (memberList[i] == curMemberId) {
                                member = memberList[i];
                                break;
                            }
                        }
                    }
                    tabManager.makeList(member);
                });
            }
        },

        /**
         * 消息模版
         */
        templateManager = {
            wrapper: '',
            initMsg: function () {
            },
            addMsg: function () {
            },
            removeMsg: function () {
            },
            editMsg: function () {
            }
        },

        tabManager = {
            wrapper: '',
            /**
             * 标签页cookie存储名
             */
            cookieName: 'tabs',
            /**
             * 标签页数据
             */
            tabList: [],
            /**
             * 当前活跃的标签页
             */
            actMemberId: '',

            /**
             * 标签页最大容量，余下隐藏
             */
            maxShow: 0,

            /**
             * 从cookie初始化tab数据
             * @private
             */
            initData: function () {
                var cookieObj = $.parseJSON(shixu.tool.getCookie(this.cookieName)) || {};
                this.tabList.push(cookieObj.tabList || []);
                this.actMemberId = cookieObj.actMemberId || '';
                this.wrapper = $('#' + config.wrapperName.tabs);
                this.maxShow = Math.floor(this.wrapper.width() / 80);
                return this;
            },

            /**
             * 绘制tab标签列表
             */
            paintTabs: function () {
                var tempArr = [],
                    tabs = this.tabList,
                    actMemberId = this.actMemberId,
                // 下拉标签页关闭
                    droppingOff = true;
                for (var i = 0, len = this.tabList.length; i < len; i++) {
                    if (i >= this.maxShow && droppingOff) {
                        droppingOff = false;
                        tempArr.push('<li class="dropdown pull-right" style="position: absolute;right: 0;">' +
                            '<a href="#" class="dropdown-toggle" data-toggle="dropdown"><b class="caret"></b></a>' +
                            '<ul class="dropdown-menu" style="min-width:30px;">');
                    }
                    tempArr.push('<li' + (actMemberId == tabs[i].id ? 'class="active"' : '') + '><a href="#tab' + tabs[i].id + '" data-toggle="tab">' + tabs[i].name + '</a>' +
                        '<i class="icon-remove"></i>' +
                        '</li><span class="msgWarn"></span>');
                    droppingOff ? '' : tempArr.push('</ul></li>');
                }
                this.wrapper.html(tempArr.join(''));
            },

            /**
             * 整理列表makeList（a、初始化）
             */
            makeList: function (member) {
                var tabs = this.tabList,
                    actMemberId = this.actMemberId,
                    doFirstTag = true,
                    removePos = '';
                //  点击当前活跃用户
                if (curMemberId == this.actMemberId) return this;
                for (var i = 0, len = tabs.length; i < len; i++) {
                    if (i < this.maxShow && tabs[i].id == curMemberId) {
                        doFirstTag = false;
                    } else {
                        removePos = i;
                    }
                }
                if (doFirstTag) {
                    tabs.unshift({
                        id: member.id,
                        name: member.name,
                        unWatchedSum:member.unWatchedSum
                    });
                    removePos && tabs.splice(i, 1);
                }
                actMemberId = member.id;
                // 及时将标签信息存储到cookie
                shixu.tool.setCookie(this.cookieName, {
                    tabList: tabs,
                    actMemberId: actMemberId

                });
                return this;
            },

            /**
             * tab标签绑定事件
             */
            bindEvent: function () {
                var that = this,
                    tabs = this.tabList,
                    tab;
                that.wrapper.on('click', function (event) {
                    if (event.target.tagName == 'li') {
                        curMemberId = event.target['data - memberId'];
                        for (var i = 0, l = tabs.length; i < l; i++) {
                            if (tabs[i] == curMemberId) {
                                tab = tabs[i];
                                break;
                            }
                        }
                    }
                    that.makeList(tab);
                });
            },

            /**
             * 更新未读消息情况
             */
            doLoopRes: function (exContacts) {
                var tabs = exContacts.slice();
                for (var i = 0, len = tabs.length; i < len; i++) {
                    var sum = tabs[i].unWatchedSum;
                    if (sum && sum > 0) {
                        var tarTab = $('#tab' + tabs[i].id).find('span')[0];
                        if(tarTab.length) tarTab.html(sum);
                        else {
                            //...提升未显示到联系人列表
                            exContacts.split(i,1);
                            exContacts.split(0,tabs[i]);
                        }
                    }
                }
            },

            /**
             * 点击标签页、联系人发出的请求
             * @private
             */
            __doRequest: function () {

            },

            /**
             * 聊天窗口强制刷新页面或离开聊天窗口页面，带来两种情况的返回
             * @param curMember
             */
            initTabs: function (curMember) {
                var tabsArray = [];
                this.wrapper = $('#' + this.wrapper);
                this.__initData();
                this.maxShowSize = Math.floor($(this.wrapper).width() / 80);
                var len = this.tabList.length, l = 0;
                if (curMember && len > this.maxShowSize) {
                    for (var i = 0; i < len; i++) {
                        if (this.tabList[i].id == curMember.id) {
                            (i >= this.maxShowSize) ? this.addTab(curMember) : (this.tabActivated = i);
                        } else {
                            this.addTab(curMember);
                        }
                    }
                }
                len > this.maxShowSize ? (l = this.maxShowSize) : (l = len);
                for (var i = 0; i < l; i++) {
                    tabsArray.push(this.__buildTabHtml(this.tabList[i]));
                }
                if (len > this.maxShowSize) {
                    tabsArray.push('<li class="dropdown pull-right" style="position: absolute;right: 0;">' +
                        '<a href="#" class="dropdown-toggle" data-toggle="dropdown"><b class="caret"></b></a>' +
                        '<ul class="dropdown-menu" style="min-width:30px;">');
                    for (var i = 0, l = len - this.maxShowSize; i < l; i++) {
                        tabsArray.push(this.buildTabHtml(this.tabList[i], null));
                    }
                    tabsArray.push('</ul></li>');
                }
                this.wrapper.html(tabsArray.join(''));
            },

            resizeTab: function () {

            },
            /**
             * 添加到不在下拉列中的tab页
             * @param newTab
             */
            addTab: function (newTab) {
//                if(this.tabList.length>=this.maxShowSize){}
                this.tabList.unshift(newTab);
                this.tabActivated = 0;
                setCookie(this.cookieName, {
                    tabList: this.tabList,
                    tabActivated: this.tabActivated
                })
                this.initTabs();
            },
            /**
             * 通过联系人列表打开标签页
             * @param tarMember
             */
            openTabFromContact: function (tarMember) {
                var that = this;
                this.initTabs(tarMember);
                for (var i = 0, len = this.tabList.length; i < len; i++) {
                    if (this.tabList[i].id == tarMember.id) {

                    }
                }
            },
            __buildTabHtml: function (member) {
                return '<li' + (iid == member.id ? 'class="active"' : '') + '><a href="#tab' + member.id + '" data-toggle="tab">' + member.name + '</a>' +
                    '<i class="icon-remove"></i>' +
                    '</li><span class="msgWarn">'+
                    member
                    +'</span>';
            }
        },
        /**
         * 聊天消息对象
         */
            msgManager = {
            /**
             * 聊天记录的包裹Div
             */
            container: '',
            /**
             * 信息li的直接父节点
             */
            wrapper: '',
            /**
             * 请求的聊天记录Url
             */
            msgUrl: 'chat/msg.html',
            /**
             * 已读取过用户列表
             */
            readList: [],
            /**
             * 窗口当前用户
             */
            curMemberId: '',

            unReadCache: {},
            msgHistory: '',
            /**
             * 打开聊天窗口操作
             * @param curMemberId
             */
            openWin: function (curMemberId) {
                if (this.curMemberId == curMemberId) return;
                this.curMemberId = curMemberId;
                if (curMemberId in this.readList) {
                    this.__appendToWin();
                } else {
                    this.__buildWin()
                    this.readList.push(curMemberId);
                }
                this.wrapper.addClass('active');
            },
            /**
             * 页面初始化时，由传入的消息打开聊天窗口
             * @param member
             */
            initWin: function (member) {
                var curMemberId = member.id,
                    tempArr = [],
                    that = this;
                if (this.curMemberId == curMemberId) return;
                this.curMemberId = curMemberId;
                if (curMemberId in this.readList) {
                    this.wrapper = $('#' + this.curMemberId + 'MsgWin').find('.dialogs')[0];
                    $(data.msgList).each(function (index, value) {
                        tempArr.push(that.__buildBox(value));
                    });
                    this.wrapper.append(tempArr.join(''));
                } else {
                    this.container instanceof jQuery ? '' : this.container = $('#' + config.wrapperName.msgWin);
                    that.readList.push(memberId);
                    tempArr = ['<div class="tab-pane  active" id="',
                        this.curMemberId,
                        'MsgWin">',
                        '<div class="dialogs msgWindow">'];
                    $(member.msgList).each(function (index, value) {
                        tempArr.push(that.__buildBox(value));
                    });
                    this.container.html(tempArr.join(''));
                }
            },
            /**
             * 监听聊天客户的新来消息
             */
            doLoopRes: function (member) {
                //为空时返回
                if(!member || !member.id) return;
                var curMemberId = member.id,
                    tempArr = [],
                    that = this;
                // 已经切换到其它标签页
                if (this.curMemberId != curMemberId) {
                    this.unReadCache[curMemberId] = member;
                    return;
                }
                $(data.msgList).each(function (index, value) {
                    tempArr.push(that.__buildBox(value));
                });
                this.wrapper.append(tempArr.join(''));

            },
            /**
             * 向已有聊天记录窗口中填充最新消息
             * @private
             */
            __appendToWin: function () {
                this.wrapper = $('#' + this.curMemberId + 'MsgWin').find('.dialogs')[0];
                this.__doRequest('unReadMsg', function (data) {
                    this.wrapper.append(html);
                });
            },
            /**
             * 新生成一聊天窗口
             * @private
             */
            __buildWin: function () {
                this.container instanceof jQuery ? '' : this.container = $('#' + this.container);
                var tempArr = ['<div class="tab-pane  active" id="',
                    this.curMemberId,
                    'MsgWin">',
                    '<div class="dialogs msgWindow">'];
                this.__doRequest('allMsg', function (html) {
                    this.container.html(html);
                });
            },
            /**
             * 处理请求的方法
             * @param type
             * @param fn
             * @private
             */
            __doRequest: function (type, fn) {
                var that = this;
                $.ajax({
                    url: that.msgUrl,
                    type: "post",
                    data: {
                        memberId: that.curMemberId,
                        type: type
                    },
                    success: function (data) {
                        var tempArr = [];
                        $(data).each(function (index, value) {
                            tempArr.push(that.__buildBox(value));
                        });
                        fn.call(that, tempArr.join(''));
                    }
                });
            },
            /**
             * 从cookie中初始化未读消息
             * @private
             */
            __initData: function () {
                 this.unReadCache = shixu.tool.getCookie()
            },
            /**
             * 生成聊天Box
             * @param talk
             * @returns {string}
             * @private
             */
            __buildBox: function (talk) {
                var tempArr = [
                    '<div class="itemdiv dialogdiv"><div class="user"><img alt="',
                    talk.name,
                    '"\'s Avatar" src="',
                    talk.headPic,
                    '" />',
                    talk.isServe ? '<span class="label label-info arrowed arrowed-in-right">service</span>' : '',
                    '</div><div class="body"><div class="time"><i class="icon-time"></i> <span class="green">',
                    talk.time,
                    '</span></div><div class="name"><a href="#">',
                    talk.name,
                    '</a></div><div class="text">',
                    talk.content,
                    '</div></div></div>'];
                return tempArr.join('');
            }
        },

        allManager = {
            wrapper: '',
            allUrl: 'chat/allRequest.html',
            chatUrl: '',
            searchUrl: '',
            switchWin: function () {

            },
            initPage: function (memberId) {
                var that = this,
                    currentMember = memberId;
                $.ajax({
                    url: that.allUrl,
                    type: "post",
                    data: this.memberId,
                    success: function (data) {
                        contact.initContact(data.contactList);
                        templateManager.initMsg(data.msgTemplate);
                        tabManager.initTabs(data.curMember);
                    }
                });
            },
            listTemplate: function () {

            },
            /**
             * 循环发起有无未读消息请求
             */
            doLoopReq: function () {
                 loopTimer = setTimeout(function(){
                    loopReqFns= argument.caller;
                    $.ajax({
                        url: config.url.loopRequest,
                        type: "post",
                        data: curMemberId || '',
                        success: function (data) {
                            tabManager.doLoopRes(data.contactList);
                            contact.initContact(data.contactList);
                            msgManager.doLoopRes(data.curMember);
                            loopTimer = setTimeout(loopReqFns,config.loopTime);
                        },
                        error:function(){
                            loopTimer = setTimeout(loopReqFns,config.loopTime);
                        }
                    });
                },config.loopTime);

            },
            refreshTab: function () {

            }

        };
    shixu.chat = {
        currentMemberId: '',
        init: function (memberId) {
            var maxShow;
            if (memberId) curMemberId = memberId || '';
            $.ajax({
                url: config.url.allUrl,
                type: "post",
                data: this.memberId,
                success: function (data) {
                    contact.initContact(data.contactList);
                    templateManager.initMsg(data.msgTemplate);
                    tabManager.initData().makeList(data.curMember).bindEvent();
                    msgManager.initWin(data.curMember);
                    allManager.doLoopReq();
                }
            });
        },
        config: function (config) {
            $.extend({
                container: {

                },
                url: {
                    allUrl: ''
                }
            }, config);
        }
    };
    shixu.chat.init();
})(shixu);