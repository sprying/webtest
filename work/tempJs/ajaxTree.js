/**
 * User: fangyc
 * Date: 13-8-21
 * Time: 下午4:36
 */
if (!$.grsds) {
    $.grsds = {};
}
$.grsds.ajaxTree = {};
$.grsds.ajaxTree.gHiddenValue = '';// 监听树的change事件
$.grsds.ajaxTree.defaults = {
    contextPath: '',// url根路径
    dm: '',// 代码表名
    hiddenName: '',// 自定义hidden名
    onClick: null,// 自定义click事件
    onSuccess: null,// ajax成功事件
    clearButton: false,// 设置’-清空选择-’按钮，true显示（同时文本框显示“-请选择-”）;false不显示//默认false
    chosePlease: false,// 设置‘-请选择-’
    cBoxFlg: false, // true:复选;false:单选,默认false
    clickFolderMode: 1,// 1：目录可选(点击选中)；2：目录不可选(点击展开)；3：目录可选（点击选中和展开）。默认1
    initHiddenValue: '',// 初始化hidden的值
    afterClearFunc: null,// 点击清空按钮的后续事件
    valueChangeFunc: null,// 改变值的绑定事件，若选择的值与原来相等则不触发
    key: '',// 树的根节点
    znDm: '',// 职能代码
    gwxh: '',// 岗位序号
    gwswjg: '',// 岗位税务机关
    sfzj: false,// 是否显示总局
    sfsj: false,// 是否显示岗位税务机关上级
    qxLimit: true,// 默认true:附加权限控制
    minExpandLevelValue: null,// 根节点是否可折叠，默认2可折叠
    districtFlag: true,// 区县限制标志,false为最低只显示到区县级
    firstNodeChoosed: false,// 初始化时第一个节点选中
    onlyNodeChoosed: false,// 当数据节点只有一个的时候，是否初始化选中它
    displayScale: 3,// 树的级数
    countyBelow: false// 是否区县及其以下显示。设置true时，前提条件：要求非权限，传入key为直辖市或区县的上级及其以下，
    //且districtFlag:false与countyBelow:true不能同时存在
};
$.fn.extend({
    ajaxTree: function (userOpt) {
        if ($(this).length == 0) {
            return;
        }
        // 用户配置覆盖默认配置
        var opt = $.extend({}, $.grsds.ajaxTree.defaults, userOpt);
        var gHiddenValue = $.grsds.ajaxTree.gHiddenValue;
        var cptTarget = $(this);
        // 给input套上一个div，grsdsDynaTree类为该div添加小箭头背景
        if (!cptTarget.parent().is("div.grsdsDynaTree")) {
            cptTarget.wrap("<div class='grsdsDynaTree'style='width:" + cptTarget.outerWidth(true) + "px'></div>");
            cptTarget.css("margin-right", "45px");
        }
        var cptId = $(this).attr("id");
        cptTarget.attr("readonly", "readonly");
        // var args = cptTarget.attr('name').split(".");
        // var treeTarget = '#'+ cptId + 'Tree';
        var hiddenName;
        if (opt.hiddenName) {
            hiddenName = opt.hiddenName;
        } else {
            hiddenName = $(this).attr('name') + 'Data';
        }
        var formObj = cptTarget.parents("form");
        var minExpandLevelValue = opt.minExpandLevelValue || opt.qxLimit ? 1 : 2;
        cptTarget.after("<div id='" + cptId + 'Tree' + "' class='divtree'> </div>");
        var treeTarget = $("#" + cptId + "Tree");
        // treeTarget.css("width",cptTarget.css("width"));
        // var widPix = $(cptTarget).css("width").replace("px",'');
        // var hetPix = $(cptTarget).css("height").replace("px",'');
        // $(treeTarget).css("height",Number(hetPix)>200?$(cptTarget).css("height"):"200px");
        // treeTarget.css("width",Number(widPix)>150?$(cptTarget).css("width"):"150px");
        treeTarget.dynatree({
            autoFocus: false,
            checkbox: opt.cBoxFlg,
            selectMode: 3,// 针对多选
            // autoCollapse: true,
            clickFolderMode: opt.clickFolderMode,
            activeVisible: false,
            minExpandLevel: minExpandLevelValue,
            initAjax: {
                url: opt.contextPath + "/ui/initAjaxTree.do",
                data: {
                    dm: opt.dm,
                    qxLimit: opt.qxLimit,
                    key: opt.key,
                    znDm: opt.znDm,
                    gwxh: opt.gwxh,
                    sfzj: opt.sfzj,
                    sfsj: opt.sfsj,
                    initHiddenValue: opt.initHiddenValue,
                    gwswjg: opt.gwswjg,
                    districtFlag: opt.districtFlag,
                    displayScale: opt.displayScale,
                    cptId: cptId,
                    mode: "funnyMode",
                    countyBelow: opt.countyBelow
                },
                dataType: "json",
                success: function (data, textStatus) {
                    // 第一个节点选中
                    if (opt.firstNodeChoosed && !opt.initHiddenValue) {
                        setTimeout(function () {
                            // rootNode是内置的根节点
                            var rootNode = treeTarget.dynatree("getRoot");
                            if (!rootNode.childList || rootNode.childList.length === 0) {
                                return;
                            }
                            var firstNode = rootNode.childList[0];
                            cptTarget.val(firstNode.data.title);
                            cptTarget.after("<input type='hidden' name='" + hiddenName + "' value='"
                                + firstNode.data.key + "'>");
                            if (opt.onClick) {
                                opt.onClick(firstNode, event);
                            }
                        }, 0);
                    }
                    // 唯一节点选中
                    else if (opt.onlyNodeChoosed && !opt.initHiddenValue) {// 如果不是回显
                        var fetchOnlyNode = function (node) {
                            if (!node.childList || node.childList.length !== 1) {// 没有【直接子节点】或【直接子节点】个数不为1
                                return false;
                            } else {
                                var cnode = node.childList[0];// 只有一个【直接子节点】
                                if (!cnode.childList || cnode.childList.length === 0) {// 检查这个【直接子节点】是不是叶子节点
                                    return cnode;
                                } else {
                                    return arguments.callee.call(null, cnode);
                                }
                            }
                        }
                        setTimeout(function () {
                            var rootNode = treeTarget.dynatree("getRoot");
                            var oNode = fetchOnlyNode.call(null, rootNode);
                            if (oNode) {
                                var onlyNode = oNode;
                                cptTarget.val(onlyNode.data.title);
                                cptTarget.after("<input type='hidden' name='" + hiddenName
                                    + "' value='" + onlyNode.data.key + "'>");
                                if (opt.onClick) {
                                    opt.onClick(onlyNode, event);
                                }
                            }
                        }, 0);

                    } else {
                        var node = treeTarget.dynatree("getActiveNode");
                        if (node == null) {
                            opt.initHiddenValue = "";
                        } else {
                            cptTarget.val(node.data.title);
                            //var scrollTop = $('.dynatree-active').scrollTop();
                        }
                        cptTarget.after("<input type='hidden' name='" + hiddenName + "' value='"
                            + opt.initHiddenValue + "'>");

                        if (opt.chosePlease) {
                            if (!opt.initHiddenValue) {
                                cptTarget.val('-请选择-');
                            }
                        }
                    }
                    // 税务机关联动
                    opt.onSuccess && opt.onSuccess(data);
                    opt.swryLink && getSwryAjax(opt);
                    opt.yhzdylxLink && queryYhzdylbAjax(opt);
                    opt.jdxzLink && getJdxzAjax(opt);
                    opt.sbjbjgLink && querySbjbjgAjax(opt);
                }
            },
            onClick: function (node, event) {
                event.stopPropagation();
                // 如果目录不可选并且该节点为目录节点（非叶子节点），执行组件默认事件，展开子节点
                if ((opt.clickFolderMode == 2) && (node.data.isFolder)) {
                    return;
                }
                // 点击的对象类型'title'点到中文上
                if (node.getEventTargetType(event) == 'title') {
                    cptTarget.val(node.data.title);
                    $("input[name='" + hiddenName + "'][type='hidden']").remove();
                    cptTarget.after("<input type='hidden' name='" + hiddenName + "' value='" + node.data.key
                        + "'>");

                    // $("#"+__gIntId).focus();
                    treeTarget.css("display", "none");
                    if (opt.onClick) {
                        opt.onClick(node, event);
                    }
                    // var gHiddenValue =
                    // treeTarget.gHiddenValue;//每个树对象对应一个全局值
                    // treeTarget[cptId+'gHiddenValue'] = '';
                    // treeTarget.swjgTreegHiddenValue = '';
                    // 值改变时
                    if (gHiddenValue !== node.data.key) {
                        if (opt.valueChangeFunc) {
                            opt.valueChangeFunc();
                            opt.valueChangeFunc.call(cptTarget);
                        }
                        gHiddenValue = node.data.key;
                    }
                    $(cptTarget).removeClass("errormessage");
                    var cptTarRange = $(cptTarget)[0].createTextRange();
                    cptTarRange.collapse(false);
                    cptTarRange.select();
                }

            },
            onSelect: function (flag, dtnode) {
                event.stopPropagation();
                var selectedNodes = dtnode.tree.getSelectedNodes();
                var selectedTitles = $.map(selectedNodes, function (node) {
                    // if(node.data.isFolder==true){
                    // return;
                    // }
                    return node.data.title;
                });

                // 如果一个大类被选中了，那么不用把这下面的所有的key传到后台，只传这个大类的key
                for (var i = 0; i < selectedNodes.length; i++) {
                    if ((selectedNodes[i]) && (selectedNodes[i].data.isFolder)) {
                        for (var j = i + 1; j < selectedNodes.length; j++) {
                            if (selectedNodes[j].isDescendantOf(selectedNodes[i])) {
                                delete selectedNodes[j];
                            }
                        }
                    }
                }
                var selectedKeys = $.map(selectedNodes, function (node) {
                    if (!node) {
                        return;
                    }
                    return node.data.key;
                });
                cptTarget.val(selectedTitles.join(","));
                $("input[name='" + hiddenName + "'][type='hidden']").each(function (i) {
                    $(this).remove();
                });
                for (var i = 0; i < selectedKeys.length; i++) {
                    cptTarget.after("<input type='hidden' name='" + hiddenName + "' value='" + selectedKeys[i]
                        + "'>");
                }
            },
            onLazyRead: function (node) {
                node.appendAjax({
                    url: opt.contextPath + "/ui/queryAjaxChildren.do",
                    data: {
                        dm: opt.dm,
                        key: node.data.key,
                        qxLimit: opt.qxLimit,
                        znDm: opt.znDm,
                        gwxh: opt.gwxh,
                        districtFlag: opt.districtFlag,
                        cptId: cptId,
                        mode: "all"
                    },
                    dataType: "json",
                    success: function () {
                        node.focus();
                    }
                });
            }
        });
        // 修复【页面大小改变后树的位置不正确】的bug
        $(window).resize(function () {
            treeTarget.css({
                position: "absolute",
                top: (cptTarget.position().top + cptTarget.outerHeight(true)) + "px",
                left: cptTarget.position().left + "px"
            });
        })
        // if(!opt.firstNodeChoosed){
        // cptTarget.after("<input type='hidden' name='"+hiddenName+"'
        // value='"+opt.initHiddenValue+"'>");
        // }
        // 添加树顶部后面带叉叉的蓝色bar
        var innerBarHTML = "<div id='"
            + cptId
            + "bar' style='height:15px;background:#D1E5FF;padding:2px 5px;margin-bottom:0px;border-bottom:1px solid #A9CAF5'>"
            + "<div class='divclose' style='margin-top:0px !important;margin-top:-20px;float:right' id='" + cptId
            + "ok'></div></div>";
        // 设置树的位置，input的正下方
        treeTarget.css({
            position: "absolute",
            top: (cptTarget.position().top + cptTarget.outerHeight(true)) + "px",
            left: cptTarget.position().left + "px",
            minWidth: cptTarget.outerWidth(false)
        }).prepend(innerBarHTML);
        // 设置每个节点的样式
        treeTarget.css("display", "none").find("ul").css({
            margin: "0px",
            padding: "0px",
            border: "none",
            background: "none",
            overflow: "auto"
        });
        // 叉叉按钮的click事件
        $("#" + cptId + "ok").css({
            clear: "both"
        }).click(function (e) {
                // e = e || window.event;
                e.stopPropagation();
                // e.bubble = false;IE最好用这个
                treeTarget.css("display", "none");
            });
        if (opt.clearButton) {
            $("#" + cptId + "bar").prepend("<a href='javascript:;' id='" + cptId
                + "Clear'><font size='2px'>清空选择</font></a>");
            $("#" + cptId + "Clear").click(function (e) {
                cptTarget.val('');
                // 针对复选
                var selectedNodes = treeTarget.dynatree("getSelectedNodes");
                if (selectedNodes) {
                    for (var i = 0, l = selectedNodes.length; i < l; i++) {
                        selectedNodes[i].select(false);
                    }
                }
                $("input[name='" + hiddenName + "'][type='hidden']").each(function (i) {
                    $(this).remove();
                });
                if (opt.chosePlease) {
                    cptTarget.val('-请选择-');
                }
                e.stopPropagation();
                treeTarget.css("display", "none");
                gHiddenValue = '';
                if (opt.afterClearFunc) {
                    opt.afterClearFunc();
                }
                var linkObjArr = [opt.swrySelectObj, opt.yhzdylbSelectObj, opt.jdxzSelectObj,
                    opt.sbjbjgSelectObj];
                for (var i = 0, l = linkObjArr.length; i < l; i++) {
                    var curr = linkObjArr[i];
                    if (curr) {
                        curr.find('option').not(':first').remove();
                    }
                }
            });
        }
        if (opt.chosePlease) {
            if (!opt.initHiddenValue) {
                cptTarget.val('-请选择-');
            }
        }
        cptTarget.parent("div").bind("click",function () {
            // 如果input被disable了，那么树不显示
            if (cptTarget.attr("disabled")) {
                return;
            }
            // 也是为了解决树的定位问题
            treeTarget.css({
                position: "absolute",
                top: (cptTarget.position().top + cptTarget.outerHeight(true) - 1) + "px",
                left: cptTarget.position().left + "px"
            });
            // __gIntId = cptTarget.attr("id");
            // 把其他树都隐藏掉
            $("div[id$='Tree']").not(treeTarget[0]).css("display", "none");
            treeTarget.css("display", "block");
        }).live("keydown", function (e) {
                if (e.keyCode == 40) {
                    // __gIntId = cptTarget.attr("id");
                    $("div[id$='Tree']").not(treeTarget[0]).css("display", "none");
                    treeTarget.css("display", "block");
                }
            });
        // 鼠标离开使树消失
        var cptBlur = function () {
            cptTarget.bind("blur.grsdsAjaxTree", function () {
                treeTarget.css("display", "none");
            });
        }
        cptBlur();
        treeTarget.mouseover(function () {
            cptTarget.unbind("blur.grsdsAjaxTree");
        }).mouseout(function () {
                cptBlur();
            });

    }
})
