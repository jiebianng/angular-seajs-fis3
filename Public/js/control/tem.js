/**
 * Created by Administrator on 15-8-15.
 */
define(['jq'],function(require, exports, module) {
    //地址
    exports.addressEach = function (type){
        require.async(["angSend"],function(bn){
            require.async(["pub"],function(temp){
                bn.sendMain({
                    control:function($scope,$timeout){
                        require.async('view',function(a){
                            a.addressFun(temp,$scope,$timeout,type);//type=2 收货地址单独在一个页面展示
                        });
                    }
                });
            });
        });
    };
	//控制台
    exports.GoData = function (type){
        require.async(["angSend"],function(bn){
            require.async(["pub"],function(temp){
                bn.sendMain({
                    control:function($scope,$timeout){
                        require.async('view',function(a){
                            //a.guigeFun(temp,$scope,$timeout);
                            a.addressFun(temp,$scope,$timeout);//type=2 收货地址单独在一个页面展示
                            //加载更多 start
                            //$timeout(function(){
                            //    $scope.mains={};
                            //    $scope.mains.rows=1;
                            //    $scope.mains.total=30;
                            //    var vbObj = {
                            //        oldObj : $scope.mains,
                            //        urlObj :{goodsTypeId:1,isNewGoods:true}
                            //    };
                            //    a.AddMoreFun(temp,$scope,$timeout,vbObj);//type=2 收货地址单独在一个页面展示
                            //});
                            //加载更多 end
                        });
                    }
                });
            });
        });
    };
});
