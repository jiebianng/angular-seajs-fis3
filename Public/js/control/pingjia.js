define(['jq'],function(require, exports, module) {
    exports.pingjia=function(){
        require.async(["angSend"],function(temp){
            require.async(["pub"],function(bn){
                temp.sendMain({
                    control:function($scope,$timeout){
                        var orderid = bn.getUrlVal('orderID');
                        var data = bn.AjaxSend('api/customer/securityurl/goods/order/'+orderid+'/', '', "get");//订单列表
                        $scope.objs = data;
                        $scope.$on('finished1',function(){
                            var pjZT='';
                            var pjFlag  =false;
                            $('#tab td').each(function(i){
                                $(this).on('touchstart',function(){
                                    if(i==0){
                                        $('#tab td').eq(1).find('img').attr('src','Public/images/zp.png').end().find('span').css('color',"#494949");
                                        $('#tab td').eq(2).find('img').attr('src','Public/images/cp.png').end().find('span').css('color',"#494949");
                                        $(this).find('img').attr('src','Public/images/hp1.png');
                                        $(this).find('span').css('color','#ef653b');
                                        pjZT='GOOD';
                                        pjFlag = true;
                                    }else if(i==1){
                                        $('#tab td').eq(0).find('img').attr('src','Public/images/hp.png').end().find('span').css('color',"#494949");
                                        $('#tab td').eq(2).find('img').attr('src','Public/images/cp.png').end().find('span').css('color',"#494949");
                                        $(this).find('img').attr('src','Public/images/zp1.png');
                                        $(this).find('span').css('color','#ef653b');
                                        pjZT='ORDINARY';
                                        pjFlag = true;
                                    }else if(i==2){
                                        $('#tab td').eq(0).find('img').attr('src','Public/images/hp.png').end().find('span').css('color',"#494949");
                                        $('#tab td').eq(1).find('img').attr('src','Public/images/zp.png').end().find('span').css('color',"#494949");
                                        $(this).find('img').attr('src','Public/images/cp1.png');
                                        $(this).find('span').css('color','#ef653b');
                                        pjZT='BAD';
                                        pjFlag = true;
                                    }else{
                                        pjFlag = false;
                                    }
                                });
                                return {pjFlag:pjFlag,pjZT:pjZT}
                            });

                            var startFlag = false;
                            var num=0;
                            $('.shopStart ul li').each(function(i){
                                i=i+1;
                                $(this).find('img').on('touchstart',function(){
                                    $(this).parent().prevAll('li').find('img').attr('src','Public/images/star-on.png').end().end().find('img').attr('src','Public/images/star-on.png');
                                    $(this).parent().nextAll('li').find('img').attr('src','Public/images/star-off.png');
                                    startFlag = true;
                                    num=i;
                                    return {startFlag:startFlag,num:num};
                                });
                            });

                            $('#r_sub').click(function(){
                                var text  =$('#textContent').val();
                                if(!pjFlag){
                                    bn.ModalFrame('请先选择评价');
                                }else if(!startFlag){
                                    bn.ModalFrame('请先选择星级评价');
                                }else if(text==''||text==null||text.length==0){
                                    bn.ModalFrame('评价内容必填');
                                }else{
                                    var arr = [];
                                    $(data.object.detailList).each(function(){
                                        arr.push(this.id);
                                    });
                                    var pjData={
                                        'commentLevel':pjZT,   //好评率
                                        'goodsId':arr,    //商品ID
                                        'content':text,   //评价内容
                                        'starlevel':num,  //步长
                                        'orderId':orderid  //订单id
                                    };
                                    var ADDpj = bn.AjaxSend('api/goods/comment',pjData, "POST");
                                    if(ADDpj.ok){
                                        bn.ModalFrame('评价成功',function(){
                                            window.location.href="Personal/myorder.html?PTopage=4";
                                        });
                                    }
                                }
                            });
                        });
                    }
                });
            });
        });
    };
});