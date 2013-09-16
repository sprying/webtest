/**
 * http://tieba.baidu.com/p/2584328035#
 */
(function(a){
	function Drag (oDiv) {
		var _this = this;
		this.div = oDiv;
		this.posX = 0;
		this.posY = 0;
		this.div.onmousedown = function(ev) {
			_this.Dragfn(ev)
			return false;
		};	
	};
	Drag.prototype.Dragfn = function (ev) {
		var _this = this;
		var oEvent = ev||event;
		this.posX = oEvent.clientX - this.div.offsetLeft;
		this.posY = oEvent.clientY - this.div.offsetTop;
		this.div.style.left = this.div.offsetLeft + 'px';
		this.div.style.top = this.div.offsetTop + 'px';
		this.div.style.margin = '0';		
		this.div.style.position = "absolute";
		document.onmousemove = function(ev) {
			_this.Dragmove(ev);
		};
		document.onmouseup = function() {
			_this.Dragup();
		};
	};
	Drag.prototype.Dragmove = function(ev) {
		var oEvent = ev||event;
		this.l = oEvent.clientX - this.posX;
		this.t = oEvent.clientY - this.posY;
		this.dl = document.documentElement.clientWidth - this.div.offsetWidth;
		this.dt = document.documentElement.clientHeight - this.div.offsetHeight;
		this.l = this.l < 0 ? 0 : this.l;
		this.l = this.l > this.dl ? this.dl : this.l;
		this.t = this.t < 0 ? 0 : this.t;
		this.t = this.t > this.dt ? this.dt : this.t;
		this.div.style.left = this.l + 'px';
		this.div.style.top = this.t + 'px';
	};
	Drag.prototype.Dragup = function() {
		document.onmousemove = document.onmouseup = null;
	}
	for(var i = 0; i < a.length;i ++) {
		new Drag(a[i]);
	};
})((function(d,c,a){
	var obj =  d.getElementsByTagName('*');
	var elm = [];
	for (var i = 0;i < obj.length;i ++){
		if(obj[i].getAttribute(c) == a){
			elm.push(obj[i]);
		};
	};
	return elm;
})(document,"CleveLy","darg"))