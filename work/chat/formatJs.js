function sendClickFun(event) {
    var id = event.currentTarget.getAttribute('data-id');
    var message = $('#message' + id).val();
    if (message == undefined || message == '') {
        return;
    }

    $.ajax({
        type: "GET",
        url: "/livechat/send.html",
        data: 'memberId=' + id + '&message=' + message,
        dataType: "json",
        success: function (data) {
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
        error: function () {
            alert('send error!');
        }
    });
}

$('textarea[class*=autosize]').autosize({
    append: "\n"
});

$('.button-send').on('click', sendClickFun);

$('.shortcut').on('click', function () {
    $("#shortcut_modal").modal('show');
});

$('.shortcut_select').on('click', function (event) {
    var text = event.currentTarget.getAttribute('data-id');
    var memberId = $('#memberId').val();
    $('#message' + memberId).val(text);
    $("#shortcut_modal").modal('hide');
});

var memberId = $('#memberId').val();
/* 	$('#message' + memberId).css('height', '20px'); */
$('#message' + memberId).css('margin-right', '5px');

setInterval(function () {
    var memberId = $('#memberId').val();
    if (memberId == '') {
        return;
    }
    var flag = $('#' + memberId + ' #flag').val();
    if (flag == 1) {
        return;
    }

    $.ajax({
        type: "GET",
        url: "/livechat/received.html",
        data: 'memberId=' + memberId + '&flag=' + flag,
        dataType: "json",
        success: function (data) {
            pressMessage(data, memberId);
        },
        error: function () {
            //alert('send error!');
        }
    });
}, 5000);

// 处理是否有新的消息
setInterval(
    function () {
        var memberId = $('#memberId').val();
        $.ajax({
            type: "GET",
            url: "/livechat/noread.html",
            data: '',
            dataType: "json",
            success: function (data) {
                var obj = eval(data);
                var licount = $('#myTab li').length;
                for (var i = 0; i < obj.length; i++) {
                    var id = obj[i].memberId;
                    var count = obj[i].count;
                    //debugger;
                    // 没有显示当前用户的消息
                    if ($('#' + id).length == 0) {
                        var title = '<li data-id="' + id + '">'
                            + '<a data-toggle="tab" href="#' + id + '">'
                            + obj[i].member.fullName
                            + ' '
                            + obj[i].member.code
                            + '<span id="count' + id + '" class="badge badge-important">'
                            + count + '</span>'
                            + '</a></li>';
                        $('#myTab').append(title);
                        $('#myTab li:last').on('click',
                            liEventFun);
                        if ($('#memberId').val() == undefined
                            || $('#memberId').val() == '') {
                            $('#memberId').val(id);
                        }

                        var content = '<div id="' + id + '" class="tab-pane in active">'
                            + '<div class="widget-main no-padding">'
                            + '<div id="dialogs' + id + '" class="dialogs"></div>'
                            + '<input type="hidden" id="flag" value="1" />'
                            + '<div class="form-actions input-append">'
                            + '<input id="message' + id + '" placeholder="Type your message here ..."'
                            + 'type="text" class="width-75" name="message" />'
                            + '<button data-id="' + id + '"' + 'class="btn btn-small btn-info no-radius button-send"'
                            + 'onclick="return false;">'
                            + '<i class="icon-share-alt"></i> <span class="hidden-phone">Send</span>'
                            + '</button>'
                            + '<div id="file' + id + '" class="fileUpload" style="display: inline; margin: 0 2px;">'
                            + '<input type="file" name="file" accept="image/jpeg, image/x-png"'
                            + 'style="opacity: 0; width: 39px; position: absolute; z-index: 10;" />'
                            + '<input type="hidden" name="memberId" value="' + id + '" />'
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
                            height: '300px'
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
                                    type: "GET",
                                    url: "/livechat/received.html",
                                    data: 'memberId='
                                        + memberId
                                        + '&flag='
                                        + flag,
                                    dataType: "json",
                                    success: function (data) {
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
                                    error: function () {
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
            error: function () {
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
        type: "GET",
        url: "/livechat/received.html",
        data: 'memberId=' + memberId + '&flag=' + flag,
        dataType: "json",
        success: function (data) {
            pressMessage(data, memberId);
            $('#' + memberId + ' #flag').val('0');
        },
        error: function () {
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
    for (var i = 0; i < obj.length; i++) {
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
                + '<div class="name">' + '<a href="#" ' + color + '>'
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
                + '<div class="name">' + '<a href="#" ' + color + '>'
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
        type: "GET",
        url: "/livechat/received.html",
        data: 'memberId=' + memberId + '&flag=' + flag + '&all=' + all,
        dataType: "json",
        success: function (data) {
            pressMessage(data, memberId);
            $('#' + memberId + ' #flag').val('0');
            var div = document.getElementById('dialogs' + memberId);
            div.scrollTop = div.scrollHeight - div.clientHeight;
        },
        error: function () {
            //alert('send error!');
        }
    });
}

$('.fileUpload input').on('change', changeEvent);

var imageId = Date.parse(new Date());

function replaceLogo(data) {
    //$('#message' + memberId).val(data.url);
    $('#' + imageId).html('<img src="' + data.url + '" />');
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
        + '<div class="text" id="' + imageId + '">Sending....</div>'
        + '</div>' + '</div>';
    $('#dialogs' + id).append(showMessage);
    var div = document.getElementById('dialogs' + id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
}

function bindOnChange() {
    //$("#file").on('change', changeEvent);
    $('.fileUpload input').on('change', changeEvent);
}