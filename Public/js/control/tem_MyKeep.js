/**
 * Created by Administrator on 2016/1/30 0030.
 */
define(['jq'],function(require, exports, module) {
    exports.MyKeep = function(){
        require.async(["angSend"],function(temp) {
            require.async(["pub"], function (bn) {
                temp.sendMain({
                    control:function($scope, $timeout){
                        $scope.keepData = bn.AjaxSend('api/customer/securityurl/keep/', '', 'get');   //我的收藏列表接口
                        //编辑按钮切换
                        $scope.$on('finished1',function() {
                            var EditFlag=true;
                            $('.r_clickEdit').on('touchstart',function(){
                                if(EditFlag){
                                    $(this).text('完成').css('color','red');
                                    $('.r_shopNUm').hide();
                                    $('.r_quxiaosc').show();
                                    EditFlag = false;
                                }else{
                                    $(this).text('编辑').css('color','#fff');
                                    $('.r_shopNUm').show();
                                    $('.r_quxiaosc').hide();
                                    EditFlag = true;
                                }
                            });
                            //取消收藏
                            $('.r_quxiaosc').on('touchstart',function(){
                                var _this = $(this);
                                var shopID = _this.attr('data-goodsID');
                                var deleteKeep = bn.AjaxSend('api/customer/securityurl/keep/delete', 'goodsId='+shopID, 'POST');   //取消收藏接口
                                if(deleteKeep.ok){
                                    bn.ModalFrame('取消成功',function(){
                                        _this.parents('li').remove();
                                    });
                                }else{
                                    bn.ModalFrame(deleteKeep.msg);
                                }
                            });
                            //点击收藏的商品跳转到改商品的详情页
                            $scope.shopDetails = function(id){
                                window.location.href='goodsDetail.html?goodsID='+id+'';
                            }
                        });
                    }
                })
            })
        });
    };

    //最近浏览
    exports.zuijinliulan = function(){
        require.async(["angSend"],function(temp) {
            require.async(["pub"], function (bn) {
                temp.sendMain({
                    control:function($scope, $timeout){
                        var cc = bn.adapter({type:"get",storageKey:"tem"});
                        var m=[];
                        var n=[];
                        $.each(cc,function(){
                            if(m.indexOf(this.id)==-1){
                                m.push(this.id);
                                n.push(this);
                            }
                        });
                        $scope.zuijinData = n;
                    }
                })
            })
        });
    }
});