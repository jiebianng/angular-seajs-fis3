define(['jq'],function(require, exports, module) {
    exports.goodsDetails=function(){
        require.async(["angSend"],function(bn){
            require.async(["pub"],function(temp){
                bn.sendMain({
                    control:function($scope,$timeout){
                        temp.AjaxSend('api/customer/securityurl/memeber','','get',"goodsDetail.html");//首页获取openId
                        var goodsID = temp.getUrlVal('goodsID');
                        var goodsDetail = temp.AjaxSend('api/shop/goods/'+goodsID+'','','get');//商品详情
                        //最近浏览数据
                        temp.adapter({
                            type:"put",
                            storageKey:"tem",
                            data:goodsDetail.object.goods
                        });
                        var guige = goodsDetail.object.spec;
                        $scope.objs = [goodsDetail];
                        $scope.goodsID = goodsID;
                        $scope.plNUM = temp.AjaxSend('api/goods/comment/'+goodsID+'/','',"get");//评论数量
                        $scope.$on("finished1",function(){
                            var isgq = goodsDetail.object.goods.status;    //此商品是否下架
                            var goodsQty;  //商品库存
                            var goodsInventoryId;  //规格ID
                            //轮播
                            temp.swiper('swiper-container');
                            //添加收藏
                            $('.r_goods_keepTrue').on('touchstart',function(){
                                if($('#isKeep').text()=='收藏'){
                                    temp.AjaxSend('api/customer/securityurl/keep',"goodsId="+goodsID,"post");
                                    $('#isKeep').html('已收藏');
                                }else{
                                    temp.AjaxSend('api/customer/securityurl/keep/delete',"goodsId="+goodsID,"post");
                                    $('#isKeep').html('收藏');
                                }
                            });
                            //判断是否收藏
                            var rows = goodsDetail.object;
                            if(rows.isKeep){
                                $('#isKeep').html('已收藏');
                            }else{
                                $('#isKeep').html('收藏');
                            }
                            //规格切换效果
                            $('.r_goodsGG').each(function(){
                                $(this).click(function(){
                                    $('.r_goodsGG').removeClass('r_goodsGGActive');
                                    $(this).addClass('r_goodsGGActive');
                                    goodsQty = $(this).attr('data-qty');
                                    goodsInventoryId = $(this).attr('data-ggid');
                                    $('.r_goods_xianjia').html('￥'+$(this).attr('data-xianjia'));
                                    $('.r_goods_yuanjia').html('￥'+$(this).attr('data-yuanjia'));
                                })
                            });
                            //当有多个规格时默认显示第一个
                            if(guige.length>0){
                                $('.r_goodsGG').eq(0).addClass('r_goodsGGActive');
                                goodsQty=guige[0].qty;
                                goodsInventoryId = guige[0].id;
                                $('.r_goods_xianjia').html('￥'+guige[0].price);
                                $('.r_goods_yuanjia').html('￥'+guige[0].originalPrice);
                            }
                            //商品数量加减运算
                            var r_goodsNUm = $('.r_goodsNUm');
                            $('#r_shopNumJian').on('touchstart',function(){
                                var shopNum = r_goodsNUm.text();
                                if(shopNum<=1){
                                    shopNum = 1
                                }else{
                                    shopNum--;
                                    r_goodsNUm.text(shopNum);
                                }
                            });
                            $('#r_shopNumJia').on('touchstart',function(){
                                var shopNum = r_goodsNUm.text();
                                if(isgq!=1){
                                    temp.ModalFrame('此商品已下架！');
                                }else{
                                    if(guige.length>0){
                                        if(shopNum>=parseInt(goodsQty)){
                                            temp.ModalFrame('库存不足！');
                                        }else{
                                            shopNum++;
                                            r_goodsNUm.text(shopNum);
                                        }
                                    }else{
                                        temp.ModalFrame('此商品暂无规格！');
                                    }
                                }
                            });
                            //加入购物车
                            $('.SubmitAdd').on('touchstart',function(){
                                if(isgq!=1){
                                    temp.ModalFrame('此商品已下架！');
                                }else{
                                    var shopNum = $('.r_goodsNUm').text();
                                    if(shopNum>=1){
                                        if(guige.length>0){
                                            if(shopNum<=parseInt(goodsQty)){
                                                var dataObj = {
                                                    'sellerId': goodsDetail.object.goods.sellerId,   //商家id
                                                    'goodsId': goodsDetail.object.goods.id,    //商品id
                                                    'goodsNum': shopNum,   //数量
                                                    'goodsInventoryId': goodsInventoryId   //商品的规格型号表id
                                                };
                                                var data = temp.AjaxSend('api/shop/securityurl/shopOrder/cart', dataObj, 'post');    //新增购物车接口
                                                if (data.ok){
                                                    window.location.href = "shopCar.html?temp=" + Math.random().toString() + "";
                                                }
                                            }else{
                                                temp.ModalFrame('库存不足');
                                            }
                                        }else{
                                            temp.ModalFrame('此商品暂无规格');
                                        }
                                    }else{
                                        temp.ModalFrame('数量不能小于1');
                                    }
                                }
                            });
                            //立即购买
                            $('.SubmitBuy').on('touchstart',function(){
                                if(isgq!=1){
                                    temp.ModalFrame('此商品已下架！');
                                }else{
                                    var shopNum = $('.r_goodsNUm').text();
                                    if(shopNum>=1){
                                        if(guige.length>0){
                                            if(shopNum<=parseInt(goodsQty)){
                                                window.location.href="ConfirmOrder.html?goodsId="+goodsDetail.object.goods.id+"?detailQuantity="+shopNum+"?detailGoodsInventoryId="+goodsInventoryId+"?temp=" + Math.random().toString() + "";
                                            }else{
                                                temp.ModalFrame('库存不足');
                                            }
                                        }else{
                                            temp.ModalFrame('此商品暂无规格');
                                        }
                                    }else{
                                        temp.ModalFrame('数量不能小于1');
                                    }
                                }
                            });
                            //星级评价
                            var r = /^[+-]?[1-9]?[0-9]*\.[0-9]*$/;
                            var imgs = '';
                            if(r.test(goodsDetail.object.goods.evaluationGoodStar)){
                                for(var i=0;i<parseInt(goodsDetail.object.goods.evaluationGoodStar);i++){
                                    imgs+='<img src="Public/images/redStart.png">';
                                }
                                imgs+='<img src="Public/images/redStart2.png">';
                            }else{
                                for(var i=0;i<goodsDetail.object.goods.evaluationGoodStar;i++){
                                    imgs+='<img src="Public/images/redStart.png">';
                                }
                            }
                            $('.cpstart').html(imgs);
                            //查看图文详情效果
                            checkScroll();
                            function checkScroll(){
                                addMore();
                                $(window).unbind("scroll").bind("scroll",function(){
                                    addMore();
                                });
                                function addMore(){
                                    if($(document).scrollTop() + $(window).height() > $(document).height() - 10)// 接近底部100px
                                    {
                                        $(this).find('img').css('transform','rotate(180deg)');
                                        $('.r_goodsDetail5').slideDown();
                                        $(window).scroll(function(){
                                            if($(document).scrollTop() >= ($(document).height() - $(window).height())/2){
                                                $('#backTop').fadeIn(300);
                                            }else{
                                                $('#backTop').fadeOut(300);
                                            }
                                        });
                                        $('#backTop').on('touchstart',function(){
                                            $('.r_goodsDetail5').slideUp(function(){
                                                $('html,body').scrollTop('0');
                                                $('#backTop').hide();
                                                $('#r_more').find('img').css('transform','rotate(0deg)')
                                            });
                                        });
                                    }
                                }
                            }
                            //加入购物车与立即购买操作
                            require.async('view',function(a){
                                a.guigeFun(temp,$scope,$timeout);
                            });
                        })
                    }
                });
            });
        });
    };
});