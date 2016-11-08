/**
 * Created by Administrator on 2016/1/7.
 */
define(['jq'],function(require, exports, module) {
    exports.shopCarEdit=function(){
        require.async(["angSend"],function(temp) {
            require.async(["pub"], function (bn) {
                var data = bn.AjaxSend('api/customer/securityurl/goods/cart/', '', 'get');   //购物车列表接口
                var rows = data.rows;
                var price = 0;
                temp.sendMain({
                    control: function ($scope, $timeout) {
                        $scope.objs = data;
                        $(rows).each(function(){
                            price += this.goodsPrice * this.goodsNum;    //循环计算商品总价
                        });
                        $('.shopPrice').html(price.toFixed(2));          //进入购物车计算的总价并保留两位小数
                        $scope.$on('finished1',function() {
                            var EditFlag=true;
                            $('#cartEdit').on('touchstart',function() {      //id为cartEdit的元素 购物车界面编辑按钮
                                if (EditFlag) {
                                    $(this).html('完成');
                                    $('.r_shopX').hide();
                                    $('.shopDel').show();                       //类名为shopDel  编辑状态下显示的删除按钮
                                    $('.shopNumJia').show();                    //类名为shopNumJia  编辑状态下显示的商品数量减按钮
                                    $('.shopNumJian').show();                   //类名为shopNumJian  编辑状态下显示的商品数量加按钮
                                    EditFlag = false;
                                } else {
                                    $(this).html('编辑').css('color', '#fff');
                                    $('.r_shopX').show();
                                    $('.shopDel').hide();
                                    $('.shopNumJia').hide();
                                    $('.shopNumJian').hide();
                                    EditFlag = true;
                                }
                            });
                            // 购物车页面  编辑删除
                            $('.shopDel').on('touchstart',function(){
                                var shopCarID = $(this).attr('data-shopCarID');
                                var shopPrice = $(this).attr('data-goodsPrice');
                                var shopNum = $(this).parents('.r_edit').find('.shopNum').text();
                                var shopTatol = shopPrice*shopNum;
                                total(-shopTatol);
                                var del = bn.AjaxSend('api/shop/securityurl/shopOrder/cart/'+shopCarID+'', '', 'DELETE');
                                if(del.ok){
                                    $(this).parents('li').remove();
                                }
                            });
                            //商品数量加减
                            $('#shopCartUl li').each(function(){
                                var _this = $(this);
                                var qty = parseInt(_this.attr('data-qty'));                 //商品剩余库存
                                var shopNum = parseInt(_this.find('.shopNum').text());      //商品现在的数量
                                var shopCarId = parseInt(_this.attr('data-shopcarid'));     //购物车ID
                                var shopPrice = parseFloat(_this.attr('data-goodsprice'));  //商品单价
                                //加
                                _this.find('.shopNumJia').on('touchstart',function(){
                                    if(qty<=0){
                                        bn.ModalFrame('库存不足!!!');
                                    }else{
                                        qty--;
                                        shopNum++;
                                        _this.find('.shopNum').text(shopNum);
                                        total(shopPrice);
                                        bn.AjaxSend('api/shop/securityurl/shopOrder/cartUpdate','cartId='+shopCarId+'&goodsNum='+shopNum, 'PUT');
                                    }
                                });
                                //减
                                _this.find('.shopNumJian').on('touchstart',function(){
                                    if(shopNum<=1){
                                        shopNum = 1;
                                    }else{
                                        shopNum--;
                                        qty++;
                                        _this.find('.shopNum').text(shopNum);
                                        total(-shopPrice);
                                        bn.AjaxSend('api/shop/securityurl/shopOrder/cartUpdate','cartId='+shopCarId+'&goodsNum='+shopNum, 'PUT');
                                    }
                                });
                            });
                            //提交订单
                            $('#submitOrder').on('touchstart',function(){
                                if(EditFlag){
                                    window.location.replace("ConfirmOrder.html?temp=" + Math.random().toString() + "");
                                }else{
                                    bn.ModalFrame('请先退出编辑界面！！！');
                                }
                            })
                        });
                    }
                });
                //计算总价公共函数
                function total(Num){
                    var totalPrice = parseFloat($('.shopPrice').text());
                    totalPrice += Num;
                    $('.shopPrice').text(totalPrice.toFixed(2));
                }
            })
        });
    };
});