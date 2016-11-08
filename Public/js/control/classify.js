define(['jq'],function(require, exports, module) {
    //购物页面左侧列表选中效果
    exports.allShop = function(){
        require.async(["angSend"],function(bn){
            require.async(["pub"],function(temp){
                var i = 1;
                bn.sendMain({
                    control:function($scope,$timeout){
                        $scope.objs = temp.AjaxSend('api/goods/type/','','get');//分类列表
                        var he = document.documentElement.clientHeight;
                        $('.r_contentDiv .r_shopType').css({
                            height:(he/10-6)+"rem"
                        });
                        $scope.$on('finished1',function() {
                            var li = $('.r_shopType li');
                            var search = $('#search');
                            li.click(function(){
                                var _this = $(this);
                                var id = _this.attr('data-id');
                                var _has = _this.hasClass("r_active");
                                if(!_has){
                                    $('.r_shopType li').removeClass('r_active');
                                    _this.addClass('r_active');
                                    $('.r_name').html(_this.find('span').html());
                                    $timeout(function(){
                                        $scope.mains = temp.AjaxSend('api/shop/storegoods/1/',{goodsTypeId:id},'get');//商品列表
                                        checkScroll({goodsTypeId:id});
                                        i = 1;
                                    });
                                }
                            });
                            var nc = temp.getUrlVal('goodsTypeId');
                            if(nc){
                                li.each(function(i){
                                    var _num = $(this).attr('data-id');
                                    if(_num==parseInt(nc)){
                                        $timeout(function(){
                                            li.eq(i).trigger('click');
                                        },100);
                                    }
                                });
                            }else{
                                li.eq(0).trigger('click');
                            }
                            //加载更多
                            function checkScroll(dataObj){
                                $(window).unbind("scroll").bind("scroll",function(){
                                    addMore();
                                });
                                function addMore(){
                                    if($scope.mains.total/10>i){
                                        if($(document).scrollTop() + $(window).height() > $(document).height() - 1)// 接近底部100px
                                        {
                                            temp.ModalFrame('正在加载中....',function(){
                                                i++;
                                                dataObj.page=i;
                                                var data = temp.AjaxSend('api/shop/storegoods/1/',dataObj,'get');//API商城项目-景点列表接口
                                                data.rows.forEach(function(rows){
                                                    $timeout(function(){
                                                        $scope.mains.rows.push(rows);
                                                    });
                                                });
                                            });
                                        }
                                    }else{
                                        if($(document).scrollTop() + $(window).height() > $(document).height() - 1)// 接近底部100px
                                        {
                                            temp.ModalFrame('数据已全部加载！');
                                        }
                                    }
                                }
                            }
                            $scope.$on('finished2',function() {
                                //立即购买
                                require.async('view',function(a){
                                    a.guigeFun(temp,$scope,$timeout);
                                });
                            });
                        });
                    }
                });
            });
        });
    }
});