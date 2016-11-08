/**
 * Created by Administrator on 2015/11/3.
 */
define(['jq'],function(require, exports, module){
    var weixinOpenId = sessionStorage.weixinOpenId;
    var base = '/shop/';
    exports.AjaxSend=function(url,data,type,callUrl){
        var sendMsg = '';
        $.ajax({
            type: type,
            url: base+url,
            data:data,
            async:false,
            traditional:true,
            dataType: 'json',
            beforeSend:function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("weixinOpenId",weixinOpenId);
            },
            success:function(msg){
                if(!msg.ok && msg.code==401){
                    $.ajax({
                        type: 'get',
                        url: base+'weixin/authorize',
                        data:{callbackURL:callUrl},
                        async:false,
                        traditional:true,
                        dataType: 'json',
                        beforeSend:function (XMLHttpRequest) {
                            XMLHttpRequest.setRequestHeader("weixinOpenId",weixinOpenId);
                        },
                        success:function(data2){
                            if(data2.ok){
                                window.location.href=''+data2.object+'';
                            }
                        }
                    });

                }else {
                    sendMsg = msg;
                }
            }
        });
        return sendMsg;
    };
    //    URL中取值
    exports.getUrlVal = function(obj){
        var text='';
        var url = window.location.href;
        var sub = url.substr(url.indexOf('?')).split('?');
        sub.splice(0,1);
        $(sub).each(function(i){
            var arr = this.split('=');
            if(obj == arr[0]){
                text = arr[1];
                text = text.split('&')[0];
            }
        });
        return text;
    };
    //获取几天后与几天前的日期函数
    exports.GetDateStr = function(AddDayCount){
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear(); //获取当前年份
        var m = dd.getMonth() + 1;//获取当前月份的日期
        var d = dd.getDate();   //获取今天的日期
        return y + "-" + m + "-" + d;
    };
    //读取星级评价星星展示
    exports.Strarts = function(obj,pic1,pic2,ele,index){
        var str='';
        var r = /^[+-]?[1-9]?[0-9]*\.[0-9]*$/;
        var type = ele.substr(0,1);
        if(type == '.'){
            strart();
            $(ele).eq(index).html(str);
        }else if(type == '#'){
            strart();
            $(ele).html(str);
        }
        function strart(){
            if(r.test(obj)){
                str='';
                for(var i=0;i<parseInt(obj);i++){
                    str+='<img src="'+pic1+'" alt=""/>'
                }
                str+='<img src="'+pic2+'" alt=""/>'
            }else{
                str='';
                for(var i=0;i<obj;i++){
                    str+='<img src="'+pic1+'" alt=""/>'
                }
            }
        }
    };

//    提示模态框
//    obj 操作对象
//    timer 运行时间
//    fun 执行的函数
    exports.ModalFrame = function(obj,timer,fun){
        var checkName = /^\s*[\u4e00-\u9fa5]{1,}[\u4e00-\u9fa5.·]{0,15}[\u4e00-\u9fa5]{1,}\s*$/;
        var checkNum = /^(13[0-9]|15[0|1|2|3|5|6|7|8|9]|18[0-9])\d{8}$/;
        var checkAdd = /^(?=.*?[\u4E00-\u9FA5])[\dA-Za-z\u4E00-\u9FA5]+/;
        $(document.body).append($('<div id="r_mengban"></div>'));
        if(obj instanceof Array){
            var text='<div id="r_mengbanContent">';
            text +='';
            $(obj).each(function(){
                text+='<span class="r_arrText">'+this+'</span>';
            });
            text+='</div>';
            $('#r_mengban').html(text);
            if(typeof fun == "function"){
                $('.r_arrText').each(function(){
                    $(this).click(function(){
                        removeMenban();
                        $('#r_payTypeText').text($(this).text());
                        fun();
                    });
                });
            }else if(typeof timer == "function"){
                $('.r_arrText').each(function(){
                    $(this).click(function(){
                        removeMenban();
                        $('#r_payTypeText').text($(this).text());
                        timer();
                    });
                });
            }else if(typeof timer == "number"){
                $('.r_arrText').each(function(){
                    $(this).click(function(){
                        removeMenban();
                        $('#r_payTypeText').text($(this).text());
                    });
                });
                console.log('第二个参数不能是数字,但可以是一个回调函数');
            }else{
                $('.r_arrText').each(function(){
                    $(this).click(function(){
                        removeMenban();
                        $('#r_payTypeText').text($(this).text());
                    });
                });
            }
        }else if(Object.prototype.toString.call(obj) === "[object String]"){
            if(typeof fun == "function" && typeof timer == "number"){
                $('#r_mengban').html($('<div id="r_mengbanContent"><span>'+obj+'</span></div>'));
                setTimeout(function(){
                    removeMenban();
                    fun();
                },timer || 2500);
            }else if(typeof timer == "function"){
                $('#r_mengban').html($('<div id="r_mengbanContent"><span>'+obj+'</span></div>'));
                setTimeout(function(){
                    removeMenban();
                    timer();
                },2500);
            }else if(typeof timer == "number"){
                $('#r_mengban').html($('<div id="r_mengbanContent"><span>'+obj+'</span></div>'));
                setTimeout(function(){
                    removeMenban();
                },timer);
            }else{
                $('#r_mengban').html($('<div id="r_mengbanContent"><span>'+obj+'</span></div>'));
                setTimeout(function(){
                    removeMenban();
                },2500);
            }
        }else if(obj == 0){
            var text2 ='';
            text2='<div id="r_mengbanContent" style="width: 65%">';
            text2 +='<ul>' +
                '<li><p>收货人<span class="r_tips" id="tipsName"></span></p><div><input id="r_userName" type="text" placeholder="请输入收货人姓名"></div></li>' +
                '<li><p>联系电话<span class="r_tips" id="tipsPhone"></span></p><div><input id="r_userPhone" type="text" placeholder="请输入联系电话"></div></li>' +
                '<li><p>详细地址<span class="r_tips" id="tipsAdd"></span></p><div><input id="r_userAdd" type="text" placeholder="请输入收货地址"></div></li>' +
                '<li><span id="R_cancel">取消</span><span id="R_save">保存</span></li>' +
                '</ul>';
            text2+='</div>';
            $('#r_mengban').html(text2);
            $('#R_cancel').on('touchstart',function(){
                removeMenban();
            });
            $('#R_save').on('touchstart',function(){
                var name = $('#r_userName').val();
                var phone = $('#r_userPhone').val();
                var Add = $('#r_userAdd').val();
                var tipsName = $('#tipsName');
                var tipsPhone = $('#tipsPhone');
                var tipsAdd = $('#tipsAdd');
                if(name==''){
                    outNone(tipsName,'姓名不能为空');
                }else if(!checkName.test(name)){
                    outNone(tipsName,'姓名格式错误');
                }else if(phone==''){
                    outNone(tipsPhone,'电话不能为空');
                }else if(!checkNum.test(phone)){
                    outNone(tipsPhone,'电话格式错误');
                }else if(Add==''){
                    outNone(tipsAdd,'地址不能为空');
                }else if(!checkAdd.test(Add)){
                    outNone(tipsAdd,'地址格式错误');
                }else{
                    alert('OK');
                }
            })
        }else if(obj == 1 && Object.prototype.toString.call(timer) === "[object String]"){
            $('#r_mengban').html($('<div id="r_mengbanContent"><img src="'+timer+'"></div>'));
            $('#r_mengban').on('touchstart',function(){
                removeMenban();
            })
        }else if(obj == 9){
            //退款理由
            var text2 ='';
            text2='<div id="r_mengbanContent" style="width: 65%">';
            text2 +='<ul>' +
                '<li><p>退款理由<span class="r_tips" id="tipsAdd"></span></p><div><input id="r_userAdd" type="text" placeholder="请输入退款理由"></div></li>' +
                '<li><span id="R_cancel">取消</span><span id="R_save">保存</span></li>' +
                '</ul>';
            text2+='</div>';
            $('#r_mengban').html(text2);
            $('#R_cancel').on('touchstart',function(){
                removeMenban();
            });
            $('#R_save').on('touchstart',function(){
                var name = $('#r_userName').val();
                var phone = $('#r_userPhone').val();
                var Add = $('#r_userAdd').val();
                var tipsName = $('#tipsName');
                var tipsPhone = $('#tipsPhone');
                var tipsAdd = $('#tipsAdd');
                if(name==''){
                    outNone(tipsName,'姓名不能为空');
                }else if(!checkName.test(name)){
                    outNone(tipsName,'姓名格式错误');
                }else if(phone==''){
                    outNone(tipsPhone,'电话不能为空');
                }else if(!checkNum.test(phone)){
                    outNone(tipsPhone,'电话格式错误');
                }else if(Add==''){
                    outNone(tipsAdd,'地址不能为空');
                }else if(!checkAdd.test(Add)){
                    outNone(tipsAdd,'地址格式错误');
                }else{
                    alert('OK');
                }
            })
        }else if(obj == 101){
            //服务热线
            var text2 ='';
            text2='<div id="r_mengbanContent" style="width: 65%">';
            text2 +='<ul>' +
                '<li><p>服务热线: <b class="phoneShowNumber" style="vertical-align: text-top;">'+timer+'</b></p></li>' +
                '<li><span id="R_cancel">关闭</span></li>' +
                '</ul>';
            text2+='</div>';
            $('#r_mengban').html(text2);
            $('#R_cancel').on('touchstart',function(){
                removeMenban();
            });
        }else if(obj == 102){
            //服务热线
            var text2 ='';
            text2='<div id="r_mengbanContent" style="width: 17rem;">';
            text2 +='<ul>' +
                '<li style="text-align: center;"><img src="'+timer+'" alt=""></li>' +
                '<li><span id="R_cancel">关闭</span></li>' +
                '</ul>';
            text2+='</div>';
            $('#r_mengban').html(text2);
            $('#R_cancel').on('touchstart',function(){
                removeMenban();
            });
        }
        function removeMenban(){
            $('#r_mengban').fadeOut(300,function(){
                $('#r_mengban').remove();
            });
        }
        function outNone(obj,text){
            obj.stop();
            obj.fadeIn(500);
            obj.html(text);
            setTimeout(function(){
                obj.fadeOut(500);
            },1500);
        }
        var scHeight = $(window).height();
        var scWidth = $(window).width();
        $('#r_mengban').css('height',scHeight+'px');
        $('#r_mengban').fadeIn(300);
        var height = parseInt(document.getElementById('r_mengbanContent').offsetHeight);
        var width = parseInt(document.getElementById('r_mengbanContent').offsetWidth);
        $('#r_mengbanContent').animate({'margin-left':-width/2+'px'},10);
        $('#r_mengbanContent').animate({'margin-top':-height/2+'px'},10);
    };
    //轮播效果
    exports.swiper=function(_class){
        require.async(['swiper'],function(){
            var swiper = new Swiper('.'+_class, {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                autoplay: 3000,
                autoplayDisableOnInteraction: false,
                preloadImages:false
            });
        });
    };
    //    遍历星星自动打分
    exports.tj_all_xin_each = function(){
        $(".tj_all_xin_each").each(function(){
            var textFloat = parseFloat($(this).find('._span').html());
            var textInt = parseInt($(this).find('._span').html());
            $(this).find('.tj_all_xin li').each(function(i){
                if(textFloat>textInt){
                    if(textInt>i){
                        $(this).addClass("cur");
                    }
                    else if(textInt==i){
                        $(this).addClass("ban");
                    }
                }else{
                    if(textInt>i){
                        $(this).addClass("cur");
                    }
                }
            });
        });
    };
    /**
    *
    * @param _params
    * @returns {*}
    * @constructor  传递对象{type:执行方式，id:删除的对应id，storageKey:本地存储Key名，data:操作对象}
    */
   //不按时间排列
   exports.adapter=function(_params){
       var storageKey = (_params.storageKey);
       var storageStr = localStorage[storageKey];
       var items;
       if(storageStr!=[]&&storageStr!=undefined){
           items = JSON.parse(storageStr);
           if(items.length>10){
               for(var i= 10; i<=items.length; i++){
                   items.splice(i,1);
               }
           }
       }else{
           items = [];
       }
       if (_params.type === 'delete') {//删除指定数据
           items.splice(_params.id,1);
           localStorage[storageKey] = JSON.stringify(items);
       }else if (_params.type === 'get') {//添加数据
           localStorage[storageKey] = JSON.stringify(items);
       } else if (_params.type === 'put' || _params.type === 'post') {//添加数据
           items.unshift(_params.data);
           localStorage[storageKey] = JSON.stringify(items);
       }else if (_params.type === 'delall') {//删除全部
           localStorage[storageKey] = JSON.stringify([]);
       }else if (_params.type === 'update') {//修改
           localStorage[storageKey] = JSON.stringify(items);
       } else {
           _params.error();
       }
       return items;
   };
   //按时间顺序排列
   exports.adapterTime=function(_params){
       var storageKey = (_params.storageKey);
       var storageStr = localStorage[storageKey];
       var items;
       if(storageStr!=[]&&storageStr!=undefined){
           items = JSON.parse(storageStr);
       }else{
           items = [];
       }
       if (_params.type === 'delete') {//删除指定数据
           items.splice(_params.id,1);
           localStorage[storageKey] = JSON.stringify(items);
       }else if (_params.type === 'get') {//添加数据
           localStorage[storageKey] = JSON.stringify(items);
       } else if (_params.type === 'put' || _params.type === 'post') {//添加数据
           items.unshift(_params.data);
           localStorage[storageKey] = JSON.stringify(items);
       }else if (_params.type === 'delall') {//删除全部
           localStorage[storageKey] = JSON.stringify([]);
       }else if (_params.type === 'update') {//修改
           localStorage[storageKey] = JSON.stringify(items);
       } else {
           _params.error();
       }
       //处理数据重复
       //var m=[];
       //var n=[];
       //$.each(items,function(i){
       //    if(m.indexOf(this.time)==-1){
       //        m.push(this.time);
       //    }
       //});
       //$.each(m,function(i){
       //    var bs=[];
       //    var ids = [];
       //    $.each(items,function(j){
       //        if(m[i]==items[j].time){
       //            bs.push(items[j]);
       //        }
       //    });
       //    $.each(bs,function(){
       //        if(ids.indexOf(this.id)==-1){
       //            ids.push(this.id);
       //        }
       //    });
       //    n.push({id:ids,times:bs[i].time});
       //});
       //console.log(n);
       return items;
   };
});