<%@ page isELIgnored="false" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>

<style>
<!--
#shortcut_modal {
	margin-left: -470px;
	width: 940px;
}

/* 大屏幕 */
@media ( min-width : 1200px) {
	#shortcut_modal {
		margin-left: -586px;
		width: 1170px;
	}
}
/* 平板电脑和小屏电脑之间的分辨率 */
@media ( min-width : 768px) and (max-width: 979px) {
	#shortcut_modal {
		margin-left: -184px;
	}
}
/* 横向放置的手机和竖向放置的平板之间的分辨率 */
@media ( max-width : 767px) {
	#shortcut_modal {
		margin-left: -20px;
	}
}
/* 横向放置的手机及分辨率更小的设备 */
@media ( max-width : 480px) {
}

.tab-content {
	border: 1px solid #8b7bb9;
}

#contact {
	height: 463px;
	border: 1px solid #8b7bb9;
}

#quick_reply {
	height: 503px;
	border: 1px solid #8b7bb9;
}
-->

/*会话联系人列表*/
    .list li{
    list-style-type: none;
    position: relative;
    border-top: 1px solid #e3e3e3;
    padding: .15em 1px;
    line-height: 100%;
    cursor: pointer;
    }
    .list_white>li {
    border-color: #ccc;
    background: #f1f1f1;
    background: -webkit-gradient(linear,left top,left bottom,from(#fff),to(#f1f1f1));
    background: -webkit-linear-gradient(white,#f1f1f1);
    background: -moz-linear-gradient(white,#f1f1f1);
    background: -ms-linear-gradient(white,#f1f1f1);
    background: -o-linear-gradient(white,#f1f1f1);
    background: linear-gradient(#fff,#f1f1f1);
    }
    .list_item:after {
    visibility: hidden;
    display: block;
    content: " ";
    clear: both;
    }
    .list_item .avatar {
    float: left;
    position: relative;
    }
    .avatar {
    width: 40px;
    height: 40px;
    }
    .avatar {
    margin: 8px!important;
    }
    a.avatar {
    -webkit-tap-highlight-color: rgba(255,255,255,0);
    text-decoration: none;
    }

    .list_item .avatar img {
    width: 100%;
    height: 100%;
    }
    .lazyLoadImg {
    -webkit-transition: opacity 1s;
    -moz-transition: opacity 1s;
    -o-transition: opacity 1s;
    transition: opacity 1s;
    }
    .member_nick {
    padding: 6px 0 0 5px;
    margin: 0;
    line-height: 23px;
    height: 23px;
    overflow: hidden;
    padding-right: 5px!important;
    }
    .member_nick span {
    color: #aaa;
    line-height: 17px;
    font-size: 12px;
    }
    .member_msg {
    margin: 0;
    overflow: hidden;
    font-size: 12px;
    color: #aaa;
    line-height: 28px;
    padding-left: 5px;
    }
    .text_ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    }

    /*聊天窗口*/
    .nav-tabs>li{
        width:80px;
        position: relative;
    }
    .dropdown-menu>li{
        position:relative;
    }
    .nav-tabs li>i{
        display:none;
    }
    .nav-tabs li:hover>i{
        display:block;
        width: 18px;
        font-size: 12px;
        position: absolute;
        top: 3px;
        right: 2px;
        z-index: 12;
        color: grey;
    }
    .nav-tabs>li.dropdown:last-child{
        width:auto;
    }
    .nav-tabs>li.active a:link,.nav-tabs>li.active a:hover{
        -webkit-border-radius: 4px 4px 0 0;-moz-border-radius: 4px 4px 0 0;
        border-radius: 4px 4px 0 0!important;
        box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.15);
        color: #576373;
        background-color: #FFF;
        border:0;
        height: 18px;
        border: 1px solid #ddd;
        border-bottom-color: transparent;
        line-height: 16px;
        margin-top: -1px;
    }
    .nav-tabs>li a:first-child{
        border-left:none!important;
    }
    .nav-tabs>li>a{
        border:none;
        height:18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /*消息模版*/
    #tasks h4{
        margin:0;
    }
    </style>

<!--#breadcrumbs-->
<div id="breadcrumbs">
	<!--.breadcrumb-->
	<ul class="breadcrumb">
		<li><i class="icon-home"></i> <a href="#">Home</a> <span
			class="divider"> <i class="icon-angle-right"> </i></span></li>
		<li class="active">Live chat</li>
	</ul>
</div>

<div id="page-content" class="clearfix">
	<div class="page-header position-relative">
		<input type="hidden" id="memberId" value="${memberId }" />
        <input type="hidden" id="all" value="${all }" />
		<!-- 1 最后10条数据  0 未读数据 -->
	</div>

	<div class="row-fluid">
		<!--<div class="span3" style="width:238px;">
			<span class="input-icon input-icon-right">
                <input style="border-color: #8b7bb9;border-left: solid 1px;padding-left: 7px;" type="text" id="form-field-icon-2">
                <i class="icon-search"></i>
			</span>
			<div id="contact"></div>
		</div> -->
        <div class="span3">
            <div class="widget-box">
                <div class="widget-header">
                <h5>Latest Contacts</h5>
                <div class="widget-toolbar">
                    <a href="#" data-action="collapse"><i class="icon-chevron-up"></i></a>
                </div>
            </div>

                <div class="widget-body">
                    <div class="widget-main" style="background: #f1f1f1;
                    background: -webkit-gradient(linear,left top,left bottom,from(#fff),to(#f1f1f1));background: -webkit-linear-gradient(white,#f1f1f1);
                    background: -moz-linear-gradient(white,#f1f1f1);background: -ms-linear-gradient(white,#f1f1f1);background: -o-linear-gradient(white,#f1f1f1);
                    background: linear-gradient(#fff,#f1f1f1);">
                        <div class="input-append">
                            <input class="span8 search-query" id="appendedInputButtons" type="text">
                            <button class="btn" type="button" style="-webkit-border-radius: 0 4px 4px 0;
                            -moz-border-radius: 0 4px 4px 0;border-radius: 0 4px 4px 0!important;">Search</button>
                        </div>
                        <ul id="contactList" class="list list_white contact" style="margin:0 -12px">
                            <li class="list_item">
                                <a href="javascript:void(0);" style="position:absolute; " class="avatar">
                                    <img src="/resources/default/img/g.jpeg" class="lazyLoadImg loaded">
                                </a>
                                <div style="position:static;margin:0 32px 0 50px">
                                    <p class="member_nick">依萍<span>(白玫瑰)</span></p>
                                    <p class="member_msg text_ellipsis">hello everyone,I'm sorry to padden you</p>
                                </div>
                                <div style="position: absolute;right: 12px;top: 10px;float: right;width: 20px;display: inline-block;height: 40px;">
                                    <p style="color: #aaa;line-height: 17px;font-size: 12px;margin: 2px 0 0 0">Tue</p>
                                    <img src="resources/default/img/online.png" style="width:12px;height:11px">
                                </div>
                            </li>
                            <li class="list_item">
                                <a href="javascript:void(0);" class="avatar" cmd="clickMemberAvatar"><img src="/resources/default/img/getface.jpeg" class="lazyLoadImg loaded">
                                </a>
                                <p class="member_nick">文旭<span>(阿甘)</span></p>
                                <p class="member_msg text_ellipsis"></p>
                            </li>
                            <li class="list_item">
                                <a href="javascript:void(0);" class="avatar" cmd="clickMemberAvatar"><img src="/resources/default/img/getface.jpeg" class="lazyLoadImg loaded">
                                </a>
                                <p class="member_nick">文旭<span>(阿甘)</span></p>
                                <p class="member_msg text_ellipsis"></p>
                            </li>
                            <li class="list_item">
                                <a href="javascript:void(0);" class="avatar" cmd="clickMemberAvatar"><img src="/resources/default/img/g2.jpeg" class="lazyLoadImg loaded">
                                </a>
                                <p class="member_nick">文旭<span>(阿甘)</span></p>
                                <p class="member_msg text_ellipsis"></p>
                            </li>
                            <li class="list_item">
                                <a href="javascript:void(0);" class="avatar" cmd="clickMemberAvatar"><img src="/resources/default/img/g3.jpeg" class="lazyLoadImg loaded">
                                </a>
                                <p class="member_nick">文旭<span>(阿甘)</span></p>
                                <p class="member_msg text_ellipsis"></p>
                            </li>
                            <li class="list_item">
                                <a href="javascript:void(0);" class="avatar" cmd="clickMemberAvatar"><img src="/resources/default/img/g4.jpeg" class="lazyLoadImg loaded">
                                </a>
                                <p class="member_nick">文旭<span>(阿甘)</span></p>
                                <p class="member_msg text_ellipsis"></p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
		<div class="span7">
            <div class="widget-box ">
                <div class="widget-header">
                    <h4 class="lighter smaller"><i class="icon-comment blue"></i>Conversation</h4>
                </div>

                <div class="widget-body">
                    <div class="widget-main no-padding">
                        <ul id="tabList" class="nav nav-tabs" style="position:relative;height: 34px;">
                            <li class="active"><a href="#Tom" data-toggle="tab" style="">Tom</a>
                                <i class="icon-remove" style=""></i>
                            </li>
                            <li><a href="#profile" data-toggle="tab">Profile</a>
                                <i class="icon-remove" style=""></i>
                            </li>
                            <li><a href="#messages" data-toggle="tab">Messages</a>
                                <i class="icon-remove" style=""></i>
                            </li>
                            <li><a href="#new" data-toggle="tab">new</a>
                                <i class="icon-remove" style=""></i>
                            </li>
                            <li><a href="#nice" data-toggle="tab">nice</a>
                                <i class="icon-remove" style=""></i>
                            </li>
                            <li><a href="#settings" data-toggle="tab">Settings</a>
                                <i class="icon-remove" style=""></i>
                            </li>
                            <li><a href="#good" data-toggle="tab">good</a>
                               <i class="icon-remove" style=""></i>
                            </li>
                            <li><a href="#christmas" data-toggle="tab">christmas</a>
                               <i class="icon-remove" style=""></i>
                            </li>
                            <li class="dropdown pull-right" style="position: absolute;right: 0;">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><b class="caret"></b></a>
                                <ul class="dropdown-menu" style="min-width:30px;">
                                    <li><a href="#mac" data-toggle="tab">mac</a>
                                       <i class="icon-remove" style=""></i>
                                    </li>
                                    <li><a href="#jpeg" data-toggle="tab">jpeg</a>
                                        <i class="icon-remove" style=""></i>
                                    </li>
                                    <li><a href="#section" data-toggle="tab">section</a>
                                       <i class="icon-remove" style=""></i>
                                    </li>
                                    <li><a href="#one" data-toggle="tab">One</a>
                                        <i class="icon-remove" style=""></i>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <div id="tab-content" class="tab-content">
                            <div class="tab-pane" id="profile">
                                <p>I'm in Section 1.</p>
                            </div>
                            <div class="tab-pane" id="messages">
                                <p>Howdy, I'm in Section 2.</p>
                            </div>
                            <div class="tab-pane" id="new">
                            <p>Howdy, I'm in new 2.</p>
                            </div>

                            <div class="tab-pane" id="nice">
                            <p>Howdy, I'm in nice 2.</p>
                            </div>

                            <div class="tab-pane" id="settings">
                            <p>Howdy, I'm in settings 2.</p>
                            </div>

                            <div class="tab-pane" id="good">
                            <p>Howdy, I'm in good 2.</p>
                            </div>

                            <div class="tab-pane" id="christmas">
                            <p>Howdy, I'm in christmas 2.</p>
                            </div>
                            <div class="tab-pane" id="mac">
                            <p>Howdy, I'm in mac 2.</p>
                            </div>

                            <div class="tab-pane" id="jpeg">
                            <p>Howdy, I'm in jpeg 2.</p>
                            </div>

                            <div class="tab-pane" id="section">
                            <p>Howdy, I'm in section 2.</p>
                            </div>

                            <div class="tab-pane" id="One">
                            <p>Howdy, I'm in One 2.</p>
                            </div>
                            <div class="tab-pane  active" id="Tom">
    <div class="dialogs">
    <div class="itemdiv dialogdiv">
    <div class="user">
    <img alt="Alexa's Avatar" src="/resources/default/img/g3.jpeg" />
    </div>

    <div class="body">
    <div class="time"><i class="icon-time"></i> <span class="green">4 sec</span></div>
    <div class="name"><a href="#">Alexa</a></div>
    <div class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo massa sed ipsum porttitor facilisis. </div>

    </div>
    </div>


    <div class="itemdiv dialogdiv">
    <div class="user">
    <img alt="John's Avatar" src="/resources/default/img/g4.jpeg" />
    </div>

    <div class="body">
    <div class="time"><i class="icon-time"></i> <span class="blue">38 sec</span></div>
    <div class="name"><a href="#">John</a></div>
    <div class="text">Raw denim you probably haven't heard of them jean shorts Austin.</div>

    <div class="tools">
    <a href="#" class="btn btn-minier btn-info"><i class="icon-only icon-share-alt"></i></a>
    </div>
    </div>
    </div>


    <div class="itemdiv dialogdiv">
    <div class="user">
    <img alt="Bob's avatar" src="/resources/default/img/g3.jpeg" />
    </div>

    <div class="body">
    <div class="time"><i class="icon-time"></i> <span class="orange">2 min</span></div>
    <div class="name"><a href="#">Bob</a> <span class="label label-info arrowed arrowed-in-right">admin</span></div>
    <div class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo massa sed ipsum porttitor facilisis. </div>

    <div class="tools">
    <a href="#" class="btn btn-minier btn-info"><i class="icon-only icon-share-alt"></i></a>
    </div>
    </div>
    </div>


    <div class="itemdiv dialogdiv">
    <div class="user">
    <img alt="Jim's Avatar" src="/resources/default/img/g4.jpeg" />
    </div>

    <div class="body">
    <div class="time"><i class="icon-time"></i> <span class="muted">3 min</span></div>
    <div class="name"><a href="#">Jim</a></div>
    <div class="text">Raw denim you probably haven't heard of them jean shorts Austin.</div>
    <div class="tools">
    <a href="#" class="btn btn-minier btn-info"><i class="icon-only icon-share-alt"></i></a>
    </div>
    </div>
    </div>


    <div class="itemdiv dialogdiv">
    <div class="user">
    <img alt="Alexa's Avatar" src="/resources/default/img/g3.jpeg" />
    </div>

    <div class="body">
    <div class="time"><i class="icon-time"></i> <span class="green">4 min</span></div>
    <div class="name"><a href="#">Alexa</a></div>
    <div class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>

    <div class="tools">
    <a href="#" class="btn btn-minier btn-info"><i class="icon-only icon-share-alt"></i></a>
    </div>
    </div>
    </div>
    </div>

    <form>
    <div class="form-actions input-append">
    <button class="btn btn-small btn-info shortcut"  data-toggle="tooltip" title="the history of talk"
    style="margin-right: 5px;">
    <i class="icon-comments"></i>
    </button>
    <input placeholder="Type your message here ..." type="text" class="width-75" name="message" style="width:67%!important;"/>
    <button class="btn btn-small btn-info no-radius" onclick="return false;"><i class="icon-share-alt"></i> <span class="hidden-phone">Send</span></button>
    <div id="file${entry.key }" class="fileUpload" style="display: inline; margin: 0 2px;">
    <input type="file" name="file" accept="image/jpeg, image/x-png" style="opacity: 0; width: 39px; position: absolute; z-index: 10;" />
    <input type="hidden" name="memberId" value="${entry.key }" />
    <span class="btn btn-small btn-success hidden-480" style="height: 22px;" >
    <i class="icon-link"></i>
    </span>
    </div>
    <a href="/livechatlist.html" class="btn btn-small btn-danger hidden-480" data-toggle="tooltip" title="talk list"> <i class="icon-list"></i></a>
    </div>
    </form>
                            </div>
                        </div>

                    </div><!--/widget-main-->
                </div><!--/widget-body-->
            </div><!--/widget-box-->
        </div>
		<div class="span2">
    <div class="widget-box transparent">

    <div class="widget-header">
    <h4 class="lighter smaller">Templates</h4>
    <div class="widget-toolbar no-border">
    <button data-toggle="tooltip" data-placement="top" title="" data-original-title="Add" class="add-common btn btn-success btn-small">
    <i class="icon-plus-sign-alt"></i><br>
    </button>
    <!--<ul class="nav nav-tabs" id="recent-tab">
    <li class="active"><a data-toggle="tab" href="#task-tab">Tasks</a></li>
    <li><a data-toggle="tab" href="#member-tab">Members</a></li>
    <li><a data-toggle="tab" href="#comment-tab">Comments</a></li>
    </ul>-->
    </div>
    </div>

    <div class="widget-body">
    <div class="widget-main padding-5">
    <div class="tab-content padding-8">
    <div id="task-tab" class="tab-pane active">
    <ul id="tasks" class="item-list">
        <li class="item-orange clearfix">
            <h4> Hello</h4>
            <div class="inline pull-right position-relative">
                <button class="btn btn-minier bigger btn-yellow dropdown-toggle" data-toggle="dropdown"><i class="icon-angle-down icon-only"></i></button>
                <ul class="dropdown-menu dropdown-icon-only dropdown-yellow pull-right dropdown-caret dropdown-closer">
                    <li><a href="#" class="tooltip-success" data-rel="tooltip" title="Mark&nbsp;as&nbsp;done" data-placement="left"><span class="green"><i class="icon-ok"></i></span></a></li>
                    <li><a href="#" class="tooltip-error" data-rel="tooltip" title="Delete" data-placement="left"><span class="red"><i class="icon-trash"></i></span></a></li>
                </ul>
            </div>
        </li>

        <li class="item-red clearfix">
            <h4> Hello</h4>
            <div class="inline pull-right position-relative">
                <button class="btn btn-minier bigger btn-yellow dropdown-toggle" data-toggle="dropdown"><i class="icon-angle-down icon-only"></i></button>
                <ul class="dropdown-menu dropdown-icon-only dropdown-yellow pull-right dropdown-caret dropdown-closer">
                    <li><a href="#" class="tooltip-success" data-rel="tooltip" title="Mark&nbsp;as&nbsp;done" data-placement="left"><span class="green"><i class="icon-ok"></i></span></a></li>
                    <li><a href="#" class="tooltip-error" data-rel="tooltip" title="Delete" data-placement="left"><span class="red"><i class="icon-trash"></i></span></a></li>
                </ul>
            </div>
        </li>

        <li class="item-default clearfix">
            <h4> Hello</h4>
            <div class="inline pull-right position-relative">
                <button class="btn btn-minier bigger btn-yellow dropdown-toggle" data-toggle="dropdown"><i class="icon-angle-down icon-only"></i></button>
                <ul class="dropdown-menu dropdown-icon-only dropdown-yellow pull-right dropdown-caret dropdown-closer">
                    <li><a href="#" class="tooltip-success" data-rel="tooltip" title="Mark&nbsp;as&nbsp;done" data-placement="left"><span class="green"><i class="icon-ok"></i></span></a></li>
                    <li><a href="#" class="tooltip-error" data-rel="tooltip" title="Delete" data-placement="left"><span class="red"><i class="icon-trash"></i></span></a></li>
                </ul>
            </div>
        </li>

        <li class="item-blue clearfix">
            <h4> Hello</h4>
            <div class="inline pull-right position-relative">
                <button class="btn btn-minier bigger btn-yellow dropdown-toggle" data-toggle="dropdown"><i class="icon-angle-down icon-only"></i></button>
                <ul class="dropdown-menu dropdown-icon-only dropdown-yellow pull-right dropdown-caret dropdown-closer">
                    <li><a href="#" class="tooltip-success" data-rel="tooltip" title="Mark&nbsp;as&nbsp;done" data-placement="left"><span class="green"><i class="icon-ok"></i></span></a></li>
                    <li><a href="#" class="tooltip-error" data-rel="tooltip" title="Delete" data-placement="left"><span class="red"><i class="icon-trash"></i></span></a></li>
                </ul>
            </div>
        </li>

        <li class="item-grey clearfix">
            <h4> Hello</h4>
            <div class="inline pull-right position-relative">
                <a href="#" class="tooltip-success" data-rel="tooltip" title="Mark&nbsp;as&nbsp;done" data-placement="left"><span class="green"><i class="icon-edit" style="width: 18px;font-size: 16px;"></i></span></a>
                <a href="#" class="tooltip-error" data-rel="tooltip" title="Delete" data-placement="left"><span class="red"><i class="icon-trash" style="width: 18px;font-size: 16px;"></i></span></a>
            </div>
        </li>

        <li class="item-green clearfix">
            <h4> Hello</h4>
            <div class="inline pull-right position-relative">
            <!--    <button class="btn btn-minier bigger btn-yellow dropdown-toggle" data-toggle="dropdown"><i class="icon-angle-down icon-only"></i></button>
                <ul class="dropdown-menu dropdown-icon-only dropdown-yellow pull-right dropdown-caret dropdown-closer">
                    <li><a href="#" class="tooltip-success" data-rel="tooltip" title="Mark&nbsp;as&nbsp;done" data-placement="left"><span class="green"><i class="icon-ok"></i></span></a></li>
                    <li><a href="#" class="tooltip-error" data-rel="tooltip" title="Delete" data-placement="left"><span class="red"><i class="icon-trash"></i></span></a></li>
                </ul>-->
    <div class="btn-group">
    <button class="btn btn-mini btn-info"><i class="icon-edit"></i></button>
    <button class="btn btn-mini btn-danger "><i class="icon-trash"></i></button>
    </div>
            </div>
        </li>
    </ul>
    </div>



    <div id="member-tab" class="tab-pane">
    <div class="clearfix">
    <div class="itemdiv memberdiv">
    <div class="user">
    <img alt="Bob's avatar" src="avatars/user.jpg" />
    </div>

    <div class="body">
    <div class="name"><a href="#">Bob Doe</a></div>
    <div class="time"><i class="icon-time"></i> <span class="green">20 min</span></div>
    <div>
    <span class="label label-warning">pending</span>
    <div class="inline position-relative">
    <button class="btn btn-minier bigger btn-yellow dropdown-toggle" data-toggle="dropdown"><i class="icon-angle-down icon-only"></i></button>
    <ul class="dropdown-menu dropdown-icon-only dropdown-yellow pull-right dropdown-caret dropdown-close">
    <li><a href="#" class="tooltip-success" data-rel="tooltip" title="Approve" data-placement="right"><span class="green"><i class="icon-ok"></i></span></a></li>
    <li><a href="#" class="tooltip-warning" data-rel="tooltip" title="Reject" data-placement="right"><span class="orange"><i class="icon-remove"></i></span> </a></li>
    <li><a href="#" class="tooltip-error" data-rel="tooltip" title="Delete" data-placement="right"><span class="red"><i class="icon-trash"></i></span> </a></li>
    </ul>
    </div>
    </div>
    </div>
    </div>

    <div class="itemdiv memberdiv">
    <div class="user">
    <img alt="Joe's Avatar" src="avatars/avatar2.png" />
    </div>

    <div class="body">
    <div class="name"><a href="#">Joe Doe</a></div>
    <div class="time"><i class="icon-time"></i> <span class="green">1 hour</span></div>
    <div>
    <span class="label label-warning">pending</span>
    <div class="inline position-relative">
    <button class="btn btn-minier bigger btn-yellow dropdown-toggle" data-toggle="dropdown"><i class="icon-angle-down icon-only"></i></button>
    <ul class="dropdown-menu dropdown-icon-only dropdown-yellow pull-right dropdown-caret dropdown-close">
    <li><a href="#" class="tooltip-success" data-rel="tooltip" title="Approve" data-placement="left"><span class="green"><i class="icon-ok"></i></span></a></li>
    <li><a href="#" class="tooltip-warning" data-rel="tooltip" title="Reject" data-placement="left"><span class="orange"><i class="icon-remove"></i></span> </a></li>
    <li><a href="#" class="tooltip-error" data-rel="tooltip" title="Delete" data-placement="left"><span class="red"><i class="icon-trash"></i></span> </a></li>
    </ul>
    </div>
    </div>
    </div>
    </div>

    <div class="itemdiv memberdiv">
    <div class="user">
    <img alt="Jim's Avatar" src="avatars/avatar.png" />
    </div>

    <div class="body">
    <div class="name"><a href="#">Jim Doe</a></div>
    <div class="time"><i class="icon-time"></i> <span class="green">2 hour</span></div>
    <div>
    <span class="label label-warning">pending</span>
    <div class="inline position-relative">
    <button class="btn btn-minier bigger btn-yellow dropdown-toggle" data-toggle="dropdown"><i class="icon-angle-down icon-only"></i></button>
    <ul class="dropdown-menu dropdown-icon-only dropdown-yellow pull-right dropdown-caret dropdown-close">
    <li><a href="#" class="tooltip-success" data-rel="tooltip" title="Approve" data-placement="right"><span class="green"><i class="icon-ok"></i></span></a></li>
    <li><a href="#" class="tooltip-warning" data-rel="tooltip" title="Reject" data-placement="right"><span class="orange"><i class="icon-remove"></i></span> </a></li>
    <li><a href="#" class="tooltip-error" data-rel="tooltip" title="Delete" data-placement="right"><span class="red"><i class="icon-trash"></i></span> </a></li>
    </ul>
    </div>
    </div>
    </div>
    </div>
    <div class="itemdiv memberdiv">
    <div class="user">
    <img alt="Alex's Avatar" src="avatars/avatar2.png" />
    </div>

    <div class="body">
    <div class="name"><a href="#">Alex Doe</a></div>
    <div class="time"><i class="icon-time"></i> <span class="green">3 hour</span></div>
    <div class="label label-important">blocked</div>
    </div>
    </div>
    <div class="itemdiv memberdiv">
    <div class="user">
    <img alt="Bob's Avatar" src="avatars/avatar2.png" />
    </div>

    <div class="body">
    <div class="name"><a href="#">Bob Doe</a></div>
    <div class="time"><i class="icon-time"></i> <span class="green">6 hour</span> </div>
    <div class="label label-success arrowed-in">approved</div>
    </div>
    </div>

    <div class="itemdiv memberdiv">
    <div class="user">
    <img alt="Susan's Avatar" src="avatars/avatar3.png" />
    </div>

    <div class="body">
    <div class="name"><a href="#">Susan</a></div>
    <div class="time"><i class="icon-time"></i> <span class="green">yesterday</span></div>
    <div class="label label-success arrowed-in">approved</div>
    </div>
    </div>

    <div class="itemdiv memberdiv">
    <div class="user">
    <img alt="Phil's Avatar" src="avatars/avatar4.png" />
    </div>

    <div class="body">
    <div class="name"><a href="#">Phil Doe</a></div>
    <div class="time"><i class="icon-time"></i> <span class="green">2 days ago</span></div>
    <div class="label label-info arrowed-in  arrowed-in-right">online</div>
    </div>
    </div>

    <div class="itemdiv memberdiv">
    <div class="user">
    <img alt="Alexa's Avatar" src="avatars/avatar1.png" />
    </div>

    <div class="body">
    <div class="name"><a href="#">Alexa Doe</a></div>
    <div class="time"><i class="icon-time"></i> <span class="green">3 days ago</span></div>
    <div class="label label-success arrowed-in">approved</div>
    </div>
    </div>
    </div>
    <div class="center">
    <i class="icon-group icon-2x green"></i> &nbsp; <a href="#">See all members &nbsp; <i class="icon-arrow-right"></i></a>
    </div>
    <div class="hr hr-double hr8"></div>
    </div><!-- member-tab -->



    <div id="comment-tab" class="tab-pane">
    <div class="comments">
    <div class="itemdiv commentdiv">
    <div class="user">
    <img alt="Bob's Avatar" src="avatars/avatar.png" />
    </div>

    <div class="body">
    <div class="name"><a href="#">Bob Doe</a></div>
    <div class="time"><i class="icon-time"></i> <span class="green">6 min</span></div>
    <div class="text">
    <i class="icon-quote-left"></i> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo massa sed ipsum porttitor facilisis &hellip;
    </div>
    </div>

    <div class="tools">
    <div class="inline position-relative">
    <button class="btn btn-minier bigger btn-yellow dropdown-toggle" data-toggle="dropdown"><i class="icon-angle-down icon-only"></i></button>
    <ul class="dropdown-menu dropdown-icon-only dropdown-yellow pull-right dropdown-caret dropdown-close">
    <li><a href="#" class="tooltip-success" data-rel="tooltip" title="Approve" data-placement="left"><span class="green"><i class="icon-ok"></i></span></a></li>
    <li><a href="#" class="tooltip-warning" data-rel="tooltip" title="Reject" data-placement="left"><span class="orange"><i class="icon-remove"></i></span> </a></li>
    <li><a href="#" class="tooltip-error" data-rel="tooltip" title="Delete" data-placement="left"><span class="red"><i class="icon-trash"></i></span> </a></li>
    </ul>
    </div>
    </div>
    </div>


    <div class="itemdiv commentdiv">
    <div class="user">
    <img alt="Jennifer's Avatar" src="avatars/avatar1.png" />
    </div>

    <div class="body">
    <div class="name"><a href="#">Jennifer</a></div>
    <div class="time"><i class="icon-time"></i> <span class="blue">15 min</span></div>
    <div class="text">
    <i class="icon-quote-left"></i> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo massa sed ipsum porttitor facilisis &hellip;
    </div>
    </div>

    <div class="tools">
    <a href="#" class="btn btn-minier btn-info"><i class="icon-only icon-pencil"></i></a>
    <a href="#" class="btn btn-minier btn-danger"><i class="icon-only icon-trash"></i></a>
    </div>
    </div>


    <div class="itemdiv commentdiv">
    <div class="user">
    <img alt="Joe's Avatar" src="avatars/avatar2.png" />
    </div>

    <div class="body">
    <div class="name"><a href="#">Joe</a></div>
    <div class="time"><i class="icon-time"></i> <span class="orange">22 min</span></div>
    <div class="text">
    <i class="icon-quote-left"></i> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo massa sed ipsum porttitor facilisis &hellip;
    </div>
    </div>

    <div class="tools">
    <a href="#" class="btn btn-minier btn-info"><i class="icon-only icon-pencil"></i></a>
    <a href="#" class="btn btn-minier btn-danger"><i class="icon-only icon-trash"></i></a>
    </div>
    </div>


    <div class="itemdiv commentdiv">
    <div class="user">
    <img alt="Rita's Avatar" src="avatars/avatar3.png" />
    </div>

    <div class="body">
    <div class="name"><a href="#">Rita</a></div>
    <div class="time"><i class="icon-time"></i> <span class="red">50 min</span></div>
    <div class="text">
    <i class="icon-quote-left"></i> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo massa sed ipsum porttitor facilisis &hellip;
    </div>
    </div>

    <div class="tools">
    <a href="#" class="btn btn-minier btn-info"><i class="icon-only icon-pencil"></i></a>
    <a href="#" class="btn btn-minier btn-danger"><i class="icon-only icon-trash"></i></a>
    </div>
    </div>

    </div>

    <div class="hr hr8"></div>
    <div class="center">
    <i class="icon-comments-alt icon-2x green"></i> &nbsp; <a href="#">See all comments &nbsp; <i class="icon-arrow-right"></i></a>
    </div>
    <div class="hr hr-double hr8"></div>

    </div>
    </div>
    </div><!--/widget-main-->
    </div><!--/widget-body-->


    </div><!--/widget-box-->
    </div>
		<!--/span-->
	</div>
	<!--/row-->
</div>
<!--/#page-content-->

<iframe id="iframe" src="/fileUpload.html" style="display: none;"></iframe>

<div class="span11 modal hide fade" id="shortcut_modal">
	<div class="modal-header message-info">
		<button type="button" class="close" data-dismiss="modal">x</button>
		<h3>Quick Reply</h3>
	</div>
	<div class="modal-body">
		<div class="row-fluid">
			<table id="table_bug_report"
				class="table table-striped table-bordered table-hover">
				<tbody>
					<tr>
						<td>Laser targets pigment, and will also attack the dark
							colors in a tattoo. This results in burns and infection.</td>
						<td>
							<button
								data-id="Laser targets pigment, and will also attack the dark colors in a tattoo. This results in burns and infection."
								class="btn btn-minier btn-primary shortcut_select">
								<i class="icon-check"></i>
							</button>
						</td>
					</tr>
					<tr>
						<td>All areas are treatable with the exception of inside the
							orbital rim. It is not safe to laser eyebrows, or near the eye
							area.</td>
						<td>
							<button
								data-id="All areas are treatable with the exception of inside the orbital rim. It is not safe to laser eyebrows, or near the eye area."
								class="btn btn-minier btn-primary shortcut_select">
								<i class="icon-check"></i>
							</button>
						</td>
					</tr>
					<tr>
						<td>No, remember pigment is pigment. Sunless tanning products
							must fade at least a week before receiving treatment. Any kind of
							sun exposure while undergoing laser treatments is very dangerous.
							It is a safer to wait 2 weeks after your laser treatment to get
							any sun exposure, and 2-3 weeks or longer after sun exposure
							before coming in for treatment again.</td>
						<td>
							<button
								data-id="No, remember pigment is pigment. Sunless tanning products must fade at least a week before receiving treatment. Any kind of sun exposure while undergoing laser treatments is very dangerous. It is a safer to wait 2 weeks after your laser treatment to get any sun exposure, and 2-3 weeks or longer after sun exposure before coming in for treatment again."
								class="btn btn-minier btn-primary shortcut_select">
								<i class="icon-check"></i>
							</button>
						</td>
					</tr>
					<tr>
						<td>Laser targets pigment, and will also attack the dark
							colors in a tattoo. This results in burns and infection.</td>
						<td>
							<button
								data-id="Laser targets pigment, and will also attack the dark colors in a tattoo. This results in burns and infection."
								class="btn btn-minier btn-primary shortcut_select">
								<i class="icon-check"></i>
							</button>
						</td>
					</tr>
					<tr>
						<td>All areas are treatable with the exception of inside the
							orbital rim. It is not safe to laser eyebrows, or near the eye
							area.</td>
						<td>
							<button
								data-id="All areas are treatable with the exception of inside the orbital rim. It is not safe to laser eyebrows, or near the eye area."
								class="btn btn-minier btn-primary shortcut_select">
								<i class="icon-check"></i>
							</button>
						</td>
					</tr>
				</tbody>
			</table>

		</div>
	</div>
</div>
<script type="text/javascript"
	src="/resources/default/js/jquery.autosize-min.js"></script>
<script type="text/javascript">
    $('.dialogs').slimScroll({
        height: '300px'
    });
    $('.contact').slimScroll({
        height: '300px'
    });
    $('[data-toggle="tooltip"]').tooltip({});

    function sendClickFun(event) {
		var id = event.currentTarget.getAttribute('data-id');
		var message = $('#message' + id).val();
		if (message == undefined || message == '') {
			return;
		}

		$.ajax({
			type : "GET",
			url : "/livechat/send.html",
			data : 'memberId=' + id + '&message=' + message,
			dataType : "json",
			success : function(data) {
				$('#message' + id).val('');
				var showMessage = '<div class="itemdiv dialogdiv">'
						+ '<div class="user">'
						+ '<img src="/resources/default/img/7ll.png" />'
						+ '</div>' + '<div class="body">'
						+ '<div class="time">'
						+ '<i class="icon-time"></i> <span class="green">'
						+ formatDate() + '</span>' + '</div>'
						+ '<div class="name">' + '<a href="#">admin</a>'
						+ '</div>' + '<div class="text">' + message + '</div>'
						+ '</div>' + '</div>';
				$('#dialogs' + id).append(showMessage);

				var div = document.getElementById('dialogs' + id);
				div.scrollTop = div.scrollHeight - div.clientHeight;
			},
			error : function() {
				alert('send error!');
			}
		});
	}

	$('textarea[class*=autosize]').autosize({
		append : "\n"
	});

	$('.button-send').on('click', sendClickFun);

	$('.shortcut').on('click', function() {
		$("#shortcut_modal").modal('show');
	});

	$('.shortcut_select').on('click', function(event) {
		var text = event.currentTarget.getAttribute('data-id');
		var memberId = $('#memberId').val();
		$('#message' + memberId).val(text);
		$("#shortcut_modal").modal('hide');
	});

	var memberId = $('#memberId').val();
	/* 	$('#message' + memberId).css('height', '20px'); */
	$('#message' + memberId).css('margin-right', '5px');

	setInterval(function() {
		var memberId = $('#memberId').val();
		if (memberId == '') {
			return;
		}
		var flag = $('#' + memberId + ' #flag').val();
		if (flag == 1) {
			return;
		}

		$.ajax({
			type : "GET",
			url : "/livechat/received.html",
			data : 'memberId=' + memberId + '&flag=' + flag,
			dataType : "json",
			success : function(data) {
				pressMessage(data, memberId);
			},
			error : function() {
				//alert('send error!');
			}
		});
	}, 5000);

	// 处理是否有新的消息
	setInterval(
			function() {
				var memberId = $('#memberId').val();
				$
						.ajax({
							type : "GET",
							url : "/livechat/noread.html",
							data : '',
							dataType : "json",
							success : function(data) {
								var obj = eval(data);
								var licount = $('#myTab li').length;
								for ( var i = 0; i < obj.length; i++) {
									var id = obj[i].memberId;
									var count = obj[i].count;
									//debugger;
									// 没有显示当前用户的消息
									if ($('#' + id).length == 0) {
										var title = '<li data-id="'+id+'">'
												+ '<a data-toggle="tab" href="#'+id+'">'
												+ obj[i].member.fullName
												+ ' '
												+ obj[i].member.code
												+ '<span id="count'+id+'" class="badge badge-important">'
												+ count + '</span>'
												+ '</a></li>';
										$('#myTab').append(title);
										$('#myTab li:last').on('click',
												liEventFun);
										if ($('#memberId').val() == undefined
												|| $('#memberId').val() == '') {
											$('#memberId').val(id);
										}

										var content = '<div id="'+id+'" class="tab-pane in active">'
												+ '<div class="widget-main no-padding">'
												+ '<div id="dialogs'+id+'" class="dialogs"></div>'
												+ '<input type="hidden" id="flag" value="1" />'
												+ '<div class="form-actions input-append">'
												+ '<input id="message'+id+'" placeholder="Type your message here ..."' 
								+ 'type="text" class="width-75" name="message" />'
												+ '<button data-id="'+id+'"'+ 'class="btn btn-small btn-info no-radius button-send"'
								+ 'onclick="return false;">'
												+ '<i class="icon-share-alt"></i> <span class="hidden-phone">Send</span>'
												+ '</button>'
												+ '<div id="file'+id+'" class="fileUpload" style="display: inline; margin: 0 2px;">'
												+ '<input type="file" name="file" accept="image/jpeg, image/x-png"'
								+ 'style="opacity: 0; width: 39px; position: absolute; z-index: 10;" />'
												+ '<input type="hidden" name="memberId" value="'+id+'" />'
												+ '<div class="btn btn-small btn-success hidden-480"'
								+ 'style="height: 22px;">'
												+ '<i class="icon-link"></i>'
												+ '</div>'
												+ '</div>'
												+ '<a href="/livechatlist.html" class="btn btn-small btn-danger hidden-480">'
												+ '<i class="icon-list"></i>'
												+ '</a>'
												+ '</div>'
												+ '</div>'
												+ '</div>';
										$('#messageContent').append(content);

										$('#' + id + ' .dialogs').slimScroll({
											height : '300px'
										});

										if (licount != 0) {
											$('#' + id).removeClass('active');
										} else {
											$('#myTab li:first').addClass(
													'active');
											var memberId = $('#memberId').val();
											if (memberId != '') {
												var flag = $(
														'#' + memberId
																+ ' #flag')
														.val();

                                                $.ajax({
                                                    type : "GET",
                                                    url : "/livechat/received.html",
                                                    data : 'memberId='
                                                            + memberId
                                                            + '&flag='
                                                            + flag,
                                                    dataType : "json",
                                                    success : function(
                                                            data) {
                                                        pressMessage(
                                                                data,
                                                                memberId);
                                                        $(
                                                                '#'
                                                                        + memberId
                                                                        + ' #flag')
                                                                .val(
                                                                        '0');
                                                    },
                                                    error : function() {
                                                        //alert('send error!');
                                                    }
                                                });
											}
										}
										// 发送按钮绑定事件
										$('.button-send').on('click',
												sendClickFun);
									}

									// 设置未读消息数量
									if (id != memberId) {
										$('#count' + id).html(count);
									}
								}
							},
							error : function() {
								//alert('send error!');
							}
						});
			}, 6000);

	function liEventFun(event) {
		var id = event.currentTarget.getAttribute('data-id');
		//debugger;
		$('#count' + id).html('');
		$('#memberId').val(id);

		var memberId = $('#memberId').val();
		if (memberId == '') {
			return;
		}
		var flag = $('#' + memberId + ' #flag').val();
		if (flag == 0) {
			return;
		}

		$.ajax({
			type : "GET",
			url : "/livechat/received.html",
			data : 'memberId=' + memberId + '&flag=' + flag,
			dataType : "json",
			success : function(data) {
				pressMessage(data, memberId);
				$('#' + memberId + ' #flag').val('0');
			},
			error : function() {
				//alert('send error!');
			}
		});
	}

	$('#myTab li').on('click', liEventFun);

	function formatDate(date) {
		//debugger;
		var date = new Date(date.time);
		return (date.getMonth() + 1) + "/" + date.getDate() + "/"
				+ date.getFullYear() + " " + date.getHours() + ":"
				+ date.getMinutes() + ":" + date.getSeconds();
	}

	function formatDate() {
		var date = new Date();
		return (date.getMonth() + 1) + "/" + date.getDate() + "/"
				+ date.getFullYear() + " " + date.getHours() + ":"
				+ date.getMinutes() + ":" + date.getSeconds();
	}

	function pressMessage(data, memberId) {
		var obj = eval(data);
		//debugger;
		for ( var i = 0; i < obj.length; i++) {
			//debugger;
			var type = obj[i].type;

			var name = obj[i].memberName;
			var color = 'style="color:red;"';
			if (obj[i].from == 'service') {
				name = obj[i].userName;
				color = '';
			}

			if (type == 'text') {
				var showMessage = '<div class="itemdiv dialogdiv">'
						+ '<div class="user">'
						+ '<img src="/resources/default/img/7ll.png" />'
						+ '</div>' + '<div class="body">'
						+ '<div class="time">'
						+ '<i class="icon-time"></i> <span class="green">'
						+ formatDate(obj[i].createTime) + '</span>' + '</div>'
						+ '<div class="name">' + '<a href="#" '+color+'>'
						+ name + '</a>' + '</div>' + '<div class="text">'
						+ obj[i].message + '</div>' + '</div>' + '</div>';
				$('#dialogs' + memberId).append(showMessage);
			}
			if (type == 'media') {
				var showMedia = '<div class="itemdiv dialogdiv">'
						+ '<div class="user">'
						+ '<img src="/resources/default/img/7ll.png" />'
						+ '</div>' + '<div class="body">'
						+ '<div class="time">'
						+ '<i class="icon-time"></i> <span class="green">'
						+ formatDate(obj[i].createTime) + '</span>' + '</div>'
						+ '<div class="name">' + '<a href="#" '+color+'>'
						+ name + '</a>' + '</div>' + '<div class="text">'
						+ '<img src="' + obj[i].imageUrl + '" />' + '</div>'
						+ '</div>' + '</div>';
				$('#dialogs' + memberId).append(showMedia);
			}

			var div = document.getElementById('dialogs' + memberId);
			div.scrollTop = div.scrollHeight - div.clientHeight;
		}
	}

	var memberId = $('#memberId').val();
	if (memberId != '') {
		var flag = $('#' + memberId + ' #flag').val();
		var all = $('#all').val();
		$.ajax({
			type : "GET",
			url : "/livechat/received.html",
			data : 'memberId=' + memberId + '&flag=' + flag + '&all=' + all,
			dataType : "json",
			success : function(data) {
				pressMessage(data, memberId);
				$('#' + memberId + ' #flag').val('0');
				var div = document.getElementById('dialogs' + memberId);
				div.scrollTop = div.scrollHeight - div.clientHeight;
			},
			error : function() {
				//alert('send error!');
			}
		});
	}

	$('.fileUpload input').on('change', changeEvent);

	var imageId = Date.parse(new Date());

	function replaceLogo(data) {
		//$('#message' + memberId).val(data.url);
		$('#' + imageId).html('<img src="'+data.url+'" />');
		imageId = Date.parse(new Date());
	}

	function changeEvent(e) {
		//debugger;
		var iframe = document.getElementById('iframe');
		function load() {
			var data = iframe.contentWindow.upload.getData();
			if (data && data.url) {
				replaceLogo(data);
			}
			iframe.onload = null;
			bindOnChange();
		}

		iframe.onload = load;

		iframe.contentWindow.upload.formMove();
		$('.fileUpload input').off("change");
		var memberId = $('#memberId').val();
		var message = iframe.contentWindow.upload.addFile(
				$('#file' + memberId), "jpg,jpeg,gif,png");

		if (message) {
			//alert(message);
			iframe.onload = null;
		}

		iframe.contentWindow.upload.submit();

		var id = $('#memberId').val();
		var showMessage = '<div class="itemdiv dialogdiv">'
				+ '<div class="user">'
				+ '<img src="/resources/default/img/7ll.png" />' + '</div>'
				+ '<div class="body">' + '<div class="time">'
				+ '<i class="icon-time"></i> <span class="green">'
				+ formatDate() + '</span>' + '</div>' + '<div class="name">'
				+ '<a href="#">admin</a>' + '</div>'
				+ '<div class="text" id="'+imageId+'">Sending....</div>'
				+ '</div>' + '</div>';
		$('#dialogs' + id).append(showMessage);
		var div = document.getElementById('dialogs' + id);
		div.scrollTop = div.scrollHeight - div.clientHeight;
	}

	function bindOnChange() {
		//$("#file").on('change', changeEvent);
		$('.fileUpload input').on('change', changeEvent);
	}
</script>
