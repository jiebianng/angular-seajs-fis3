/**
 * Created by Administrator on 15-8-15.
 */
define(['jq'],function(require, exports, module) {
    exports.Confirm = function () {                      //确认订单
        require.async(["angSend"], function (temp) {
            require.async(["pub"], function (bn) {
                //立即购买商品ID
                var goodsId = bn.getUrlVal('goodsId');
                //立即购买商品数量
                var goodsNum = bn.getUrlVal('detailQuantity');
                //立即购买商品规格ID
                var goodsInventoryId = bn.getUrlVal('detailGoodsInventoryId');
                //总价
                var price = 0;
                //数据展示对象
                var ShopCartData = {};
                //数据展示数组
                var arr=[];

                var actualMoney;                            //实际付款金额
                var deliveryTime;                           //配送时间
                var transportType = "快递";                 //运输方式   （默认：快递）
                var sellerId = [];                          //商家ID
                var detailGoodsId = [];                     //货名ID
                var detailGoodsInventoryId = [];            //货品的库存id
                var detailGoodsName = [];                   //货名
                var detailGoodsPrice = [];                  //单价
                var detailQuantity = [];                    //数量
                var detailGoodsAttribute = [];              //商品描述信息
                var consigneeAddress;                       //收货人地址
                var consignee;                              //收货人
                var consigneeTel;                           //收货人电话
                var invoiceStatus = "0";                    //是否开发票1:开；0不开
                var payType = 'WEIXIN';                     //支付方式  （默认：微信）
                var consigneeProvince;                      //收货人省
                var consigneeCity;                          //收货人城市
                var consigneeArea;                          //收货人市区
                var consigneePostcode;                      //收货人邮编


                //判断是否是立即购买
                if(goodsId&&goodsNum&&goodsInventoryId){
                    var goodsDetail = bn.AjaxSend('api/shop/goods/'+goodsId+'', '', 'get');   //商品详情接口
                    var spec = goodsDetail.object.spec;
                    var shopUnit="";
                    var shopPrice = 0;
                    var goodsimg = '';
                    if(spec.length>0){
                         $(spec).each(function(){
                             if(this.id == goodsInventoryId){
                                 goodsimg = this.goodsImageUrl;
                                 shopUnit = this.goodsUnit;
                                 shopPrice = this.price;
                             }
                         })
                    }

                    sellerId.push(goodsDetail.object.goods.sellerId);
                    detailGoodsId.push(goodsDetail.object.goods.id);
                    detailGoodsInventoryId.push(goodsInventoryId);
                    detailGoodsName.push(goodsDetail.object.goods.goodsName);
                    detailGoodsPrice.push(shopPrice);
                    detailQuantity.push(goodsNum);
                    detailGoodsAttribute.push(goodsDetail.object.goods.intro);

                    goodsList(goodsimg,goodsDetail.object.goods.goodsName,shopUnit,shopPrice,goodsNum);
                    price += shopPrice * goodsNum;
                }else{
                    var CartData = bn.AjaxSend('api/customer/securityurl/goods/cart/', '', 'get');   //购物车列表接口
                    var rows = CartData.rows;
                    $(rows).each(function(){
                        sellerId.push(this.sellerId);
                        detailGoodsId.push(this.goodsId);
                        detailGoodsInventoryId.push(this.goodsInventoryId);
                        detailGoodsName.push(this.goodsName);
                        detailGoodsPrice.push(this.goodsPrice);
                        detailQuantity.push(this.goodsNum);
                        detailGoodsAttribute.push(this.attributeDescription);
                        goodsList(this.goodsImagUrl,this.goodsName,this.attributeDescription,this.goodsPrice,this.goodsNum);
                        price += this.goodsPrice * this.goodsNum;
                    })
                }

                //商品图片、商品名称、商品规格、商品价格、商品数量
                function goodsList(goodsimg,goodsName,goodsUnit,goodsPrice,goodsNum){
                    ShopCartData = {
                        'goodsimg':goodsimg,
                        'goodsName':goodsName,
                        'goodsUnit':goodsUnit,
                        'goodsPrice':goodsPrice,
                        'goodsNum':goodsNum
                    };
                    arr.push(ShopCartData);
                }
                temp.sendMain({
                    control: function ($scope, $timeout) {
                        require.async('view',function(a){
                            a.addressFun(bn,$scope,$timeout);                //type=2 收货地址单独在一个页面展示
                            $scope.objs = arr;                               //数据展示
                            $('.shopPrice').html(price.toFixed(2));          //计算总价并且保留两位小数
                            $('#scroller').val(bn.GetDateStr(1));      //默认收货日期为1天后的日期
                            require.async(['custom'], function () {
                                $(function () {
                                    $("#scroller").mobiscroll().date();
                                    var currYear = (new Date()).getFullYear();
                                    //初始化日期控件
                                    var opt = {
                                        preset: 'date', //日期，可选：date\datetime\time\tree_list\image_text\select
                                        theme: 'android-ics light', //皮肤样式，可选：default\android\android-ics light\android-ics\ios\jqm\sense-ui\wp light\wp
                                        display: 'modal', //显示方式 ，可选：modal\inline\bubble\top\bottom
                                        mode: 'scroller', //日期选择模式，可选：scroller\clickpick\mixed
                                        lang: 'zh',
                                        dateFormat: 'yyyy-mm-dd', // 日期格式
                                        setText: '确定', //确认按钮名称
                                        cancelText: '取消',//取消按钮名籍我
                                        dateOrder: 'yyyymmdd', //面板中日期排列格式
                                        dayText: '日', monthText: '月', yearText: '年', //面板中年月日文字
                                        showNow: false,
                                        nowText: "今",
                                        startYear: currYear, //开始年份
                                        endYear: currYear + 100 //结束年份
                                        //endYear:2099 //结束年份
                                    };
                                    $("#scroller").mobiscroll(opt);
                                });
                            });
                            //提交订单
                            $('#confirmOrderBtn').on('touchstart',function(){//用户地址接口
                                //用户地址接口
                                var addressData = bn.AjaxSend('api/customer/securityurl/memeber/address/', '', 'get');
                                var addRows = addressData.object;
                                if(addRows.length>0){
                                    $(addRows).each(function(){
                                        if(this.isDefault){
                                            consignee = this.consignee;
                                            consigneeAddress = this.address;
                                            consigneeTel = this.telPhone;
                                            consigneeProvince = this.province;
                                            consigneeArea = this.area;
                                            consigneeCity = this.city;
                                            consigneePostcode = this.postcode;
                                        }
                                    });
                                    var timeValue = $('#scroller').val();
                                    var d = new Date(Date.parse(timeValue.replace(/-/g, "/")));
                                    var curDate = new Date();
                                    if(d>curDate){
                                        var confirmData = {
                                            'actualMoney':price,
                                            'deliveryTime':timeValue,
                                            'transportType':transportType,
                                            'sellerId':sellerId,
                                            'detailGoodsId':detailGoodsId,
                                            'detailGoodsInventoryId':detailGoodsInventoryId,
                                            'detailGoodsName':detailGoodsName,
                                            'detailGoodsPrice':detailGoodsPrice,
                                            'detailQuantity':detailQuantity,
                                            'detailGoodsAttribute':detailGoodsAttribute,
                                            'consigneeAddress':consigneeAddress,
                                            'consignee':consignee,
                                            'consigneeTel':consigneeTel,
                                            'invoiceStatus':invoiceStatus,
                                            'payType':payType,
                                            'consigneeProvince':consigneeProvince,
                                            'consigneeCity':consigneeCity,
                                            'consigneeArea':consigneeArea,
                                            'consigneePostcode':consigneePostcode
                                        };
                                        var shopOrder = bn.AjaxSend('api/shop/securityurl/shopOrder',confirmData, 'POST');
                                        if(shopOrder.ok){
                                            var confirmOrderID = shopOrder.object.id;
                                            window.location.href='paymentOrder.html?confirmOrderID='+confirmOrderID+'';
                                        }else{
                                            bn.ModalFrame(shopOrder.msg);
                                        }
                                    }else{
                                        bn.ModalFrame('收货日期不能小于当前日期');
                                    }
                                }else{
                                    bn.ModalFrame('请添加收货地址！！！',function(){
                                        a.addressFun(bn,$scope,$timeout);
                                    });
                                }
                            });
                        });
                    }
                });
            });
        });
    };

    //支付订单
    exports.paymentOrder = function(){
        require.async(['angSend'],function(temp){
            require.async(['pub'],function(bn){
                temp.sendMain({
                    control: function($scope,$timeout){
                        var confirmOrderID = bn.getUrlVal('confirmOrderID');
                        var paymentOrderDetails = bn.AjaxSend('api/customer/securityurl/goods/order/'+confirmOrderID+'','', 'GET');    //订单详情接口
                        if(paymentOrderDetails.ok){
                            $scope.paymentOrderData = paymentOrderDetails;
                        }else{
                            bn.ModalFrame(paymentOrderDetails.msg);
                        }
                        //点击立即支付
                        $scope.Topayclick = function(codeID){
                            exports.unifiedorder(codeID);
                        };
                    }
                });
            });
        });
    };

    //统一支付接口
    exports.unifiedorder = function(CodeID){
        require.async(['pub'],function(bn){
            var payData = {
                'orderCode':CodeID,
                'orderType':'SH',
                'body':'水果商城'
            };
            var data = bn.AjaxSend('weixin/unifiedorder',payData,'POST');
            if(data.ok){
                window.location.href="/shop/weixin/unifiedorder/payhtml?appid=" + data.object.appId + "&nonceStr=" + data.object.nonceStr + "&packageValue=" + data.object.packageValue + "&paySign=" + data.object.paySign + "&signType=MD5&timeStamp=" + data.object.timeStamp;
            }else{
                if(data.msg==null){
                    bn.ModalFrame('发送失败！');
                }else{
                    bn.ModalFrame(data.msg);
                }
            }
        });
    };
});