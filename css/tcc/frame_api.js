/*
@功能： 关闭全局是id为windows createWin()创建的窗口
@参数： createWin中的相关的ID号
@返回:  无
@实例: 
*/
function closeWin(_id){
	ymPrompt.close()
}
function closeWin_fn(_id,fn){
	ymPrompt.close();
	fn();
}


/*
@功能： 弹出警告框
@参数： tt:警告框标题,msg:警告框信息,fns:回调函数,mask:是否显示遮罩,info:'info"时，弹出错误提示，不设置时，弹出一般提示
@返回:  无
@实例: 
*/
function alertOpen(objs){
		var opt={width:450,height:200,message:objs.msg,title:objs.tt,showMask:objs.mask,btn:[['确定',true]]}
		if(objs.fns!=null&&typeof objs.fns=="function"){
			opt.handler=objs.fns;
		}
		
		opt.message="<table style='width:100%;height:80px;' valign='center'><tr><td>"+opt.message+"</td></tr></table>";
		if(objs.info=="info"){
			ymPrompt.errorInfo(opt);
		}else if(objs.info=="msg"){
			ymPrompt.win(opt);
		}else if(!objs.info){
			ymPrompt.win(opt);
		}else{
			ymPrompt.alert(opt);
		}
}

function alertMsg(tt,msg,fn){
	msg="<table style='width:100%;height:80px;' valign='center'><tr><td>"+msg+"</td></tr></table>";
	ymPrompt.confirmInfo({width:450,height:200,message:msg,title:tt,handler:fn,btn:[['确定',true],['取消',false]]})
}

function alertMsgObj(obj){
	var ok = obj.ok&&obj.ok!=""?obj.ok:'确定'; 
	var cancel =obj.cancel&&obj.cancel!=""?obj.cancel:'取消'; 
	var mask =obj.mask!=undefined?obj.mask:true; 
    var btnarr=[[ok,true],[cancel,false]];
	if(obj.newbt){
		btnarr.push(obj.newbt);
	}
	
	obj.msg="<table style='width:100%;height:80px;' valign='center'><tr><td>"+obj.msg+"</td></tr></table>";
	ymPrompt.confirmInfo({width:450,height:200,message:obj.msg,title:obj.tt,allowRightMenu:true,showMask:mask,handler:obj.fn,btn:btnarr})
	
}

function API_showMsg(objs){
	if(!objs.mask)	objs.mask	=false;
	if(!objs.msg)	objs.msg	="";
	if(!objs.title)	objs.title	="";
	if(!objs.width)	objs.width	=500;
	if(!objs.height) objs.height	=195;
	if(!objs.autoClose) objs.autoClose = true;
	if(!objs.fns) objs.fns = function(){};
	if(!objs.btn) objs.btn = [];
	if(objs.closeBtn === undefined) objs.closeBtn = true;
	ymPrompt.win({
					message:objs.msg,
					width:objs.width,
					height:objs.height,
					title:objs.title,
					maxBtn:true,
					minBtn:true,
					showMask:objs.mask,
					autoClose:objs.autoClose,
					handler:objs.fns,
					btn:objs.btn,
					closeBtn:objs.closeBtn
	})
}






/*--------------需要全局使用的-------------------*/


//涉及到当前栏目下面的新增标签统一用该函数增加标签页//应用中软代码
function API_Tab_add(objs)
{	
	try{
		
		window.top.addTabItem({id:alert(Math.round(Math.random()*100000)),title:(obj.attr("title")&&obj.attr("title")!="")?
            obj.attr("title"):obj.text(),src:obj.attr("href"),isCloseBtn:true})
	}catch(ex){
		
	   $("frame[name='tabframe']",window.parent.parent.document)[0].contentWindow.addTab(objs);
	}
}
//关闭当前栏目下当前打开的标签页//应用中软代码
function API_Tab_closecurrent()
{
	try{
		window.top.removeCurrentTabItem();	
	}catch(ex){
		$("frame[name='tabframe']",window.parent.parent.document)[0].contentWindow.closeSelectTab();
	}

	
}
//关闭当前栏目下相关标题的标签页
function API_Tab_closebytitle(title)
{
	$("frame[name='tabframe']",window.parent.parent.document)[0].contentWindow.closebytitle(title);
}
//刷新当前栏目下选中标签中的iframe窗口//应用中软代码
function API_Tab_reloadcurrent()
{
	try{
		window.top.refreshCurrentTabItem();
	}catch(ex){
		$("#framecont iframe:visible",window.top.document).contents().find("frame[name='tabframe']")[0].contentWindow.reloadTab();
	}
}

//刷新门户待办事宜页面
function API_Tab_reloadbsy()
{
	try{
		window.top.refreshDbsy();
	}catch(ex){
		
	}
}

//刷新当前栏目下标签名为title的iframe窗口
function API_Tab_reloadbytitle(title)
{
	$("frame[name='tabframe']",window.parent.parent.document)[0].contentWindow.reloadByTitle(title);
}

//动态更换标签页名称,str可又是原标题，如果是boolean true 那就是指当前选中的标签页
function API_Tab_changetitle(str,changestr){
	$("frame[name='tabframe']",window.parent.parent.document)[0].contentWindow.changeTableTitle(str,changestr);
}
//弹出全局页内窗口
function API_Win_opengb(objs)
{
	API_Win_self(objs)
}
/**
 * 弹出本身页内窗口
 * @param {} objs
 * objs.autoClose:true(默认)点击关闭按键，自动关闭，false:程序控制（closeWin()）
 * @return {Boolean}
 */
function API_Win_self(objs)
{

	if(!objs.href) {alert("无相关连接窗口");return false;};
	try{
		if(!objs.width || objs.width>$("body").width()) objs.width=$("body").width()-100;
		
	}catch(eee){
		if(!objs.width) objs.width= 500; 
	};
	try{
		if(!objs.height || objs.height>$("body").height()) objs.height=$("body").height()-100;
		
	}catch(eee){
		if(!objs.height) objs.height= 400; 
	};

	if(!objs.title) objs.title="";
	if(!objs.id) objs.id="golbalwin";
	
	if(objs.closable==undefined) objs.closable=true;
	
	if(objs.model==undefined) objs.model=true;
	if(objs.autoClose==undefined) objs.autoClose=true;
	
	if(objs.fns==undefined) objs.fns=function(){};
	ymPrompt.win({
		title : objs.title,
		fixPosition : true,
		maxBtn : true,
		minBtn : true,
		showMask:true,
		closeBtn : objs.closable,
		width : objs.width,
		height : objs.height,
		autoClose: objs.autoClose, 
		iframe:{
				id:'win_'+objs.id,
				name:'win_'+objs.id,
				src:objs.href
				},
		handler:objs.fns
	})
	if(objs.defmax!=undefined && objs.defmax==true){
		ymPrompt.max();			
	}
}
//关闭全局弹出窗口
function API_Win_closegb(id)
{
	if(!id || id=="") id="golbalwin";
	window.top.closeWin(id);
}
//关闭本身弹出窗口 /需要引入easyui.js和easyui.css

function API_Win_closeself(id,fn)
{
	
	if(!id || id=="") id="golbalwin";
	
	if(fn) 
	{
		closeWin_fn(id,fn);
	}else{
		closeWin(id);
	}

}

//就是一个alert警告框，没有取消按钮
//可以以两个方式带入参数
//(tt,msg,fns)或者({tt:"",msg:"",fns:null,info:"error"})
function API_Alert(tt,msg,fns){
	var obj={};
	
	if(arguments.length!=1 && typeof tt=="string"){
		obj.tt=tt;
		obj.msg=msg;
		obj.info="info";
		if(fns && typeof fns=="function"){
			obj.fns=fns;
		}else{
			obj.fns=null;
		}
	}else if(typeof tt=="object"){
		obj.tt=(tt.tt?tt.tt:"提示信息");
		obj.msg=(tt.msg?tt.msg:"");
		obj.fns=(tt.fns&&typeof tt.fns=="function"?tt.fns:null);
		obj.info=(tt.info?tt.info:"info");
		obj.mask=(!tt.mask?false:true);
	}
	
	alertOpen(obj);
	
}

//弹出全局警告框带确定取消
function API_Alertgb(tt,msg,fn)
{
	alertMsg(tt,msg,fn);
}

function API_Alertself(tt,msg,fn)
{
	alertMsg(tt,msg,fn);
}
//弹出自身窗口，用OBJ传递参数
function API_Alertobj(obj){
	alertMsgObj(obj);
}

function API_Showmsg(objs)
{
	showMsg(objs);
}


function API_Showerrmsg(objs){
		if(!objs.minInfo)objs.minInfo="";
		if(!objs.maxInfo)objs.maxInfo="";
		if(!objs.title)objs.title="错误信息";
		if(!objs.mask)objs.mask=true;
		if(!objs.width)objs.width=500;
		if(!objs.height)objs.height=195;
		if(!objs.handler)objs.handler=function(){};
		
		var msg='<table width="100%" border="0" cellspacing="0" cellpadding="0">   <tr>     <td class="errpage_ico">&nbsp;</td>     <td class="errpage_cont" ><div style="width:280px;word-wrap:break-word;overflow:hidden;">'+objs.minInfo+'</div></td>   </tr>   <tr>     <td colspan="2" class="errpage_detail">     	<div class="errpage_help"><a>在线帮助</a>  <a>运维平台</a></div>         <div class="errpage_showmsg msgic1"> <a href="#" onclick=\'if($("#errpage_msg").is(":hidden")){        $(".errpage_showmsg").removeClass("msgic1").addClass("msgic2");$("#errpage_msg").show();ymPrompt.resizeWin(500,385);return false;               }else{                $("#errpage_msg").hide();$(".errpage_showmsg").removeClass("msgic2").addClass("msgic1");ymPrompt.resizeWin(500,195);return false;               }\'>显示详细信息</a></div>                     </td>   </tr> </table>  <div id="errpage_msg" class="errpage_msg" style="display:none"><textarea style="height:170px;width:450px;margin-left:-6px;">'+objs.maxInfo+'</textarea></div>';

		ymPrompt.win({message:msg,width:objs.width,height:objs.height,title:objs.title,maxBtn:false,minBtn:true,showMask:objs.mask,handler:objs.handler})
		
}