/**
 * Created by Administrator on 2015/11/12.
 */
define(['jq'],function(require, exports, module) {
    exports.myOrder=function(){
        require.async(["angSend"],function(temp){
            require.async(["pub"],function(bn){
                temp.sendMain({
                    control:function($scope,$timeout){
                        //跳转到第几页
                        var initialSlide = 0;
                        var src = window.location.href.split('PTopage=')[1];
                        if(src!=undefined){
                            initialSlide = src
                        }
                        //我的订单页面滑动事件
                        require.async(['swiper'],function(){
                            new Swiper('.tj_all_swiperContainer', {
                                pagination: '.tj_all_pagination',
                                paginationClickable: true,
                                paginationBulletRender: function (index, className) {
                                    var indexName = '';
                                    if(index==0){
                                        indexName = '全部'
                                    }else if(index==1){
                                        indexName = '待付款'
                                    }else if(index==2){
                                        indexName = '待发货'
                                    }else if(index==3){
                                        indexName = '待收货'
                                    }else if(index==4){
                                        indexName = '待评价'
                                    }
                                    return '<li class="' + className + '">' + indexName + '</li>';
                                },
                                onSlideChangeStart:function(index){
                                    var le = index.activeIndex;
                                    AjaxNumber(le);
                                },initialSlide :initialSlide
                            });
                        });
                        AjaxNumber(0);
                        //订单请求
                        function AjaxNumber(le){
                            if(le==0){
                                var data = bn.AjaxSend('api/customer/securityurl/goods/order/?rows=50','','get','Home/Personal/myorder.html');
                                var da = [];
                                var da2 = [];
                                var da3 = [];
                                var da4 = [];
                                var da5 = [];
                                var da6 = [];
                                $.each(data.rows,function(){
                                    if(this.orderStatus==0){
                                        da.push(this);
                                    }else if(this.orderStatus==1){
                                        da2.push(this);
                                    }else if(this.orderStatus==7){
                                        da3.push(this);
                                    }else if(this.orderStatus==8){
                                        da4.push(this);
                                    }else if(this.orderStatus==5){
                                        da5.push(this);
                                    }else if(this.orderStatus==6){
                                        da6.push(this);
                                    }
                                });
                                $timeout(function(){
                                    $scope.objs1 = da;
                                    $scope.objs2 = da2;
                                    $scope.objs3 = da3;
                                    $scope.objs4 = da4;
                                    $scope.objs5 = da5;
                                    $scope.objs6 = da6;
                                });
                            }else if(le==1){
                                $timeout(function(){
                                    $scope.objs = bn.AjaxSend('api/customer/securityurl/goods/order/?orderStatus=0','','get');
                                });
                            }else if(le==2){
                                $timeout(function(){
                                    $scope.objs = bn.AjaxSend('api/customer/securityurl/goods/order/?orderStatus=1','','get');
                                });
                            }else if(le==3){
                                $timeout(function(){
                                    $scope.objs = bn.AjaxSend('api/customer/securityurl/goods/order/?orderStatus=7','','get');
                                });
                            }else if(le==4){
                                $timeout(function(){
                                    $scope.objs = bn.AjaxSend('api/customer/securityurl/goods/order/?orderStatus=8','','get');
                                });
                            }
                        }
                        //去支付接口
                        $scope.Topayclick = function(CodeID){
                            var dataBn = {
                                'orderCode': CodeID,   //订单编号
                                'orderType': 'SH',    //商城类别
                                'body': '我的订单去支付'     //订单摘要
                            };
                            toPayCheck(dataBn);
                        };
                        //  微信统一下单接口
                        function toPayCheck(obj) {
                            var data = bn.AjaxSend('weixin/unifiedorder',obj, 'post');
                            if (data.ok) {
                                window.location.href = "/fruitshop/weixin/unifiedorder/payhtml?appid=" + data.object.appId + "&nonceStr=" + data.object.nonceStr + "&packageValue=" + data.object.packageValue + "&paySign=" + data.object.paySign + "&signType=MD5&timeStamp=" + data.object.timeStamp;
                            }
                        };
                        //订单操作
                        $scope.operateOrder = function(id,idx,type,st){
                        //type==1 删除订单 type==2 确认收货  type==3 取消订单 type==4 申请退款
                            if(type==1){
                                var bn1 = bn.AjaxSend('api/shop/securityurl/shopOrder/delete/'+id+'','','delete');
                                check(bn1);
                            }else if(type==2){
                                var bn2 = bn.AjaxSend('api/shop/securityurl/shopOrder/accept/'+id+'','','put');
                                check(bn2);
                            }else if(type==3){
                                var bn3 = bn.AjaxSend('api/shop/securityurl/shopOrder/cancel/'+id+'','','put');
                                check(bn3);
                            }else if(type==4){
                                bn.ModalFrame(9);
                                $('#R_save').unbind("click").bind("click",function(){
                                    var r_userAdd = $('#r_userAdd').val();
                                    var bn4 = bn.AjaxSend('api/shop/securityurl/shopOrder/applyReimburse/'+id+'',{remark:r_userAdd},'put');
                                    check(bn4);
                                    bn.ModalFrame(bn4.msg,1000);
                                });
                            }
                            function check(temp){
                                if(temp.ok){
                                    bn.ModalFrame(temp.msg,4,function(){
                                        if(st==1){
                                            $timeout(function(){$scope.objs.rows.splice(idx,1);});
                                        }else if(st==2){
                                            $timeout(function(){$scope.objs1.splice(idx,1);});
                                        }else if(st==3){
                                            $timeout(function(){$scope.objs2.splice(idx,1);});
                                        }else if(st==4){
                                            $timeout(function(){$scope.objs3.splice(idx,1);});
                                        }else if(st==5){
                                            $timeout(function(){$scope.objs4.splice(idx,1);});
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
            });
        });
    };
    //订单详情
    exports.myOrderDetail=function(){
        require.async(["angSend"],function(bn){
            require.async(["pub"],function(temp){
                bn.sendMain({
                    control:function($scope,$timeout){
                        var CcId = parseInt(window.location.href.split("?id=")[1].split("&")[0]);
                        $scope.objs = temp.AjaxSend('api/customer/securityurl/goods/order/'+CcId+'','','get');//订单详情
                        var orderStatus = $scope.objs.object.orderStatus;
                        var payType = $scope.objs.object.payType;
                        if(payType=="WEIXIN"){
                            $scope.objs.object.payTypehtml="微信支付";
                        }else if(payType=="ALIPAY"){
                            $scope.objs.object.payTypehtml="支付宝";
                        }else if(payType=="CASH"){
                            $scope.objs.object.payTypehtml="现金";
                        }
                        var btnAllStyle = $('#btnAllStyle');
                        if(orderStatus==0){
                            $scope.objs.object.orderStatus="待付款";
                        }else if(orderStatus==1){
                            $scope.objs.object.orderStatus="待发货";
                        }else if(orderStatus==7){
                            $scope.objs.object.orderStatus="待收货";
                        }else if(orderStatus==8){
                            $scope.objs.object.orderStatus="待评价";
                        }else if(orderStatus==5){
                            $scope.objs.object.orderStatus="退款中";
                        }else if(orderStatus==6){
                            $scope.objs.object.orderStatus="退款完成";
                        }
                    }
                });
            });
        });
    };
});