/**
 * Created by Administrator on 15-8-15.
 */
define(['jq'],function(require, exports, module) {
	//控制台
    exports.GoData = function (type){
        require.async(["angSend"],function(bn){
            require.async(["pub"],function(temp){
                bn.sendMain({
                    control:function($scope,$timeout){
                        $scope.objs=temp.AjaxSend('api/message/ad/SHOP/','','get');//轮播效果
                        $scope.acts=temp.AjaxSend('api/activity/pageList/','','get');//活动专区
                        $scope.storegoods=temp.AjaxSend('api/shop/storegoods/1/',{order:"DESC",sort:"goods_edittime"},'get');//商品列表
                        $scope.$on('finished1',function(){
                            temp.swiper('swiper-container');
                        });
                        var i = 1;
                        $scope.$on('finished2',function(){
                            require.async('view',function(a){
                                a.guigeFun(temp,$scope,$timeout);
                            });//加载更多
                            var dataObj={order:"DESC",sort:"goods_edittime"};
                            $(window).unbind("scroll").bind("scroll",function(){
                                if($scope.storegoods.total/10>i){
                                    if($(document).scrollTop() + $(window).height() > $(document).height() - 400)// 接近底部100px
                                    {
                                        i++;
                                        dataObj.page=i;
                                        var data = temp.AjaxSend('api/shop/storegoods/1/',dataObj,'get');//API商城项目-景点列表接口
                                        data.rows.forEach(function(rows){
                                            $timeout(function(){
                                                $scope.storegoods.rows.push(rows);
                                            });
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
