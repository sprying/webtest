/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-3-19
 * Time: 上午9:34
 * To change this template use File | Settings | File Templates.
 */
this.MH=this.MH||{};
(function(MH,undefined){
       MH.search = {
           /**
            * 搜索输入框的DOM对象
            */
           searContent : null,

           /**
            * 搜索Button的DOM对象
            */
           searButton : null,

           /**
            * @desc 初始化搜索功能
            * @param contentDOM
            * @param commiButton
            */
          init : function (contentDOM,commiButton){
              this.searContent = $(contentDOM);
              this.searButton = $(commiButton);
              this.searContent.val("请输入搜索内容").css({color: '#787878'});
              this.searContent.blur(function(){
                  if($.trim($(this).val()) === "")
                        $(this).val("请输入搜索内容").css({color: '#787878'});
              });
              this.searContent.focus(function(){
                  if($.trim($(this).val()) === "请输入搜索内容")
                        $(this).val('').css({color: '#000'});
              });
              var self = this;
              this.searButton.bind("click",function(){
                  self.doSearch();
                  return false;
              });
          },

           /**
            * @desc 事件处理函数
            * @returns {boolean}是否搜索成功
            */
            doSearch: function(){
                 if(this.searContent.val() == null || this.searContent.val() == "" || this.searContent.val() ==="请输入搜索内容"){
                     return false;
                 }
                var self = this;
                $.ajax({
                    url:'search.txt',
                    //data: {},
                    dataType: 'json',
                    success: function(data){
                        if(data == null) {
                            self._creatPanel(data||[]);
                        }else{
                            self._creatPanel(data);
                        }
                    }
                });
               return false;
            },
            addSearchSource:function(t,n){
                if(!t){
                    alert("请输入标题");
                    return false;
                }
                if(!n){
                    alert("请输入备注");
                    return false;
                }
                $.ajax({
                    url:'rd/fjmswssxddyba_verifyExistSameItem.do',
                    async: false,
                    data: {title:t,note:n},
                    dataType: 'json',
                    success: function(data){
                        if(data==null) {
                        }else{
                        }
                    }
                });
            },
           _creatPanel:function(result){
               result = eval(result);
               var resultPanel =$('<div id="resultPanel"><ul></ul></div>');
               for(var i= 0,len = result.length;i<len;i++){
                    $('<li>'+result[i].title+'</li><li>'+result[i].content+'</li>').appendTo(resultPanel);
               }
               if(len === 0){
                    $('<li>搜索结果为空</li>').appendTo(resultPanel);
               }
               $('body').append(resultPanel);
           },
           _addingItems:function(readyData){

           }
       }
})(MH);