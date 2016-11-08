/**
 * Created by Administrator on 2015/11/3.
 */
define(function(require, exports, module){
    //规格展示
    exports.guigeFun = function (temp,$scope,$timeout){
        //.themePControlIndex 首页点入 .themePControlBuy 点击立即购买 themePControlCar 点击加入购物车
        var themePopCar = $('.themePopCar');//弹出层蒙版
        $('.themePControlIndex').unbind('click').bind('click',function(){
            var _this = $(this);
            themePopCar.find('.btnShow2').show();
            themePopCar.find('.btnShow1').hide();
            ControlFun(_this);
        });
        $('.themePControlBuy').unbind('click').bind('click',function(){
            var _this = $(this);
            themePopCar.find('.btnShow1').show();
            themePopCar.find('.btnShow2').hide();
            ControlFun(_this);
            themePopCar.find('.NextBtn').unbind('click').bind('click',function(e){
                e.stopPropagation();
                toBuyFun();
            });
        });
        $('.themePControlCar').unbind('click').bind('click',function(){
            var _this = $(this);
            themePopCar.find('.btnShow1').show();
            themePopCar.find('.btnShow2').hide();
            ControlFun(_this);
            themePopCar.find('.NextBtn').unbind('click').bind('click',function(e){
                e.stopPropagation();
                goInCarFun();
            });
        });
        //操作弹出层并遍历数据
        function ControlFun(_this){
            var goodsId = _this.attr('data-goodsid');
            $timeout(function(){
                $scope.guigeObj = temp.AjaxSend('api/shop/goods/'+goodsId,'','get');//获取规格参数
                if($scope.guigeObj.object.spec.length==0){
                    temp.ModalFrame('此商品无规格不能购买！！！',2000);
                }else{
                    themePopCar.show();
                    themePopCar.find('.themePopCarCon').slideDown(200);
                }
            })
        }
        //关闭蒙版
        themePopCar.find('.closePop').unbind('click').bind('click',function(){
            themePopCar.fadeOut(100);
            themePopCar.find('.themePopCarCon').fadeOut(100);
        });
        $scope.$on('finished10',function() {
            //选择规格遍历
            themePopCar.find('.specList li').each(function(i){
                var _this = $(this);
                if(i==0){
                    ChooseNum(_this);
                }
            }).unbind('click').bind('click',function(){
                var _this = $(this);
                ChooseNum(_this);
            });
            function ChooseNum(_this){
                _this.addClass('active').siblings().removeClass('active');
                var qty = _this.attr('data-qty');
                var price = _this.attr('data-price');
                var goodsImageUrl = _this.attr('data-goodsImageUrl');
                $timeout(function(){
                    $scope.objPrice=price;
                    $scope.objGoodsImageUrl=goodsImageUrl;
                });
                themePopCar.find('.numCot').html(qty);

            }
            //操作选择数量
            //减少
            themePopCar.find('.theControlNum .le').unbind('click').bind('click',function(){
                var i = parseInt(themePopCar.find('.theControlNum .input').val());
                if(i>1){
                    i--;
                    themePopCar.find('.theControlNum .input').val(i);
                }
            });
            //添加
            themePopCar.find('.theControlNum .ri').unbind('click').bind('click',function(){
                var numCot = parseInt(themePopCar.find('.numCot').html());
                var i = parseInt(themePopCar.find('.theControlNum .input').val());
                if(i<numCot){
                    i++;
                    themePopCar.find('.theControlNum .input').val(i);
                }
            });
            themePopCar.find('.BuyImmediatelyBtn').unbind('click').bind('click', function () {
                toBuyFun();
            });
            themePopCar.find('.GoInCarBtn').unbind('click').bind('click',function(){
                goInCarFun();
            });
        });
        //立即购买操作
        function toBuyFun(){
            //规格id
            var id = themePopCar.find('.specList .active').attr('data-GoodsInventoryId');
            //购买数量
            var num = parseInt(themePopCar.find('.theControlNum .input').val());
            var numCot = parseInt(themePopCar.find('.numCot').html());
            //商品id
            var goodsId = parseInt(themePopCar.find('.specList .active').attr('data-goodsId'));
            if (num > numCot) {
                num = numCot;
            }
            window.location.href = 'ConfirmOrder.html?goodsId=' + goodsId + '?detailQuantity=' + num + '?detailGoodsInventoryId=' + id;
        }
        //加入购物车操作
        function goInCarFun(){
            //规格id
            var id = parseInt(themePopCar.find('.specList .active').attr('data-GoodsInventoryId'));
            //购买数量
            var num = parseInt(themePopCar.find('.theControlNum .input').val());
            //商家id
            var sellerId = parseInt(themePopCar.find('.specList .active').attr('data-sellerId'));
            //商品id
            var goodsId = parseInt(themePopCar.find('.specList .active').attr('data-goodsId'));
            //库存
            var numCot = parseInt(themePopCar.find('.numCot').html());
            if(num>numCot){
                num = numCot;
            }
            var data = {
                sellerId:sellerId,
                goodsId:goodsId,
                goodsNum:num,
                goodsInventoryId:id
            };
            var ret = temp.AjaxSend('api/shop/securityurl/shopOrder/cart',data,'POST');
            if(ret.ok){
                window.location.href='shopCar.html';//购物车位置
            }else{
                temp.ModalFrame(ret.msg,1200);
            }
        }
    };
    //收货地址
    exports.addressFun = function(temp,$scope,$timeout,type){
//      type=2 收货地址单独在一个页面展示
        DefAdds();
        var he = document.documentElement.clientHeight;//计算浏览器高度
        var TeTop =$('.TAddressTemplate .openTeGoIn');//计算浏览器高度
        var teGoIn =$('.TAddressTemplate .TeGoIn');//操作收货地址
        var AddressAdd =$('#AddressAdd');//新增收货地址按钮
        var name = $('#checkName');//姓名
        var Phone = $('#checkPhone');//手机号
        var Address = $('#city-picker');//所在地区
        var county = $('#checkAddress');//详细地址
        var closeChooseAddress = $("#closeChooseAddress");//关闭选择收货地址界面
        var closeUpdateAddress = $("#closeUpdateAddress");//关闭修改收货地址界面
        teGoIn.find(".AdList").css({
            "bottom":-he+'px'
        });
        teGoIn.find(".ul").css({
            "max-height":0.8*he+'px'
        });
        //点击默认地址
        TeTop.on("click",function(){
            AddressList();
            openChooseFun();
        });
//                      收货地址遍历结束
        allCheck();
        $scope.$on('finished1',function() {
            allCheck();
        });
        function allCheck(){
            //关闭选择收货地址界面
            closeChooseAddress.unbind('click').bind('click',function(){
                $('html').removeClass();
                closeChooseFun();
            });
            //关闭修改收货地址界面
            closeUpdateAddress.unbind('click').bind('click',function(){
                closeUpdateFun();
            });
            //选择默认地址
            teGoIn.find(".ul li").unbind('click').bind('click',function(){
                var _this = $(this);
                var id = _this.attr("data-id");
                var consignee = _this.attr("data-consignee");
                var telPhone = _this.attr("data-telPhone");
                var address = _this.attr("data-address");
                var province = _this.attr("data-province");
                var city = _this.attr("data-city");
                var area = _this.attr("data-area");
                var postcode = _this.attr("data-postcode");
                var data = {
                    id:id,
                    consignee:consignee,
                    telPhone:telPhone,
                    address:address,
                    province:province,
                    city:city,
                    area:area,
                    postcode:postcode,
                    isDefault:true
                };
                UpdateAddress(data,true);
            });
            //修改地址
            teGoIn.find('.goInUpAd').unbind('click').bind('click',function(e){
                e.stopPropagation();
                teGoIn.find('.AddLeBtn').show();
                var _this = $(this).parents("li");
                var id = _this.attr("data-id");
                var consignee = _this.attr("data-consignee");
                var telPhone = _this.attr("data-telPhone");
                var address = _this.attr("data-address");
                var province = _this.attr("data-province");
                var city = _this.attr("data-city");
                var area = _this.attr("data-area");
                var postcode = _this.attr("data-postcode");
                var data = {
                    id:id,
                    consignee:consignee,
                    telPhone:telPhone,
                    address:address,
                    province:province,
                    city:city,
                    area:area,
                    postcode:postcode,
                    isDefault:true
                };
                UpdateAddress(data,false);
            });
            //删除
            teGoIn.find('.AdBtClDel').unbind("click").bind("click",function(){
                var id = name.attr('data-id');
                var AddList = temp.AjaxSend('api/customer/securityurl/memeber/addressdelete',{id:id},'post');//修改收获地址
                if(AddList.ok){
                    AddressList();
                    openUpdateFun();
                    closeUpdateFun();
                    DefAdds();
                }else{
                    temp.ModalFrame(AddList.msg,1200);
                }
            });
            //添加
            AddressAdd.unbind('click').bind('click',function(){
                teGoIn.find('.AddLeBtn').hide();
                name.val("");
                Phone.val("");
                county.val("");
                name.attr("data-id","");
                openUpdateFun();
            });
            //保存
            teGoIn.find('.AdBtClSea').unbind("click").bind("click",function(){
                var data = returnVerification();
                if(data!=undefined){
                    data.isDefault=true;
                    var AddList;
                    if(data.id!=''){
                        AddList = temp.AjaxSend('api/customer/securityurl/memeber/address',data,'put');//修改收获地址
                    }else{
                        delete data.id;
                        AddList = temp.AjaxSend('api/customer/securityurl/memeber/address',data,'post');//添加收获地址
                    }
                    if(AddList.ok){
                        DefAdds();
                        closeChooseFun();
                        closeUpdateFun();
                    }else{
                        temp.ModalFrame(AddList.msg,1200);
                    }
                }
            });
        }
        //选择地区
        function ChooseAddress(val){
            if(val==undefined){
                val='北京 东城区 ';
            }
            require.async(["http://m.sui.taobao.org/assets/js/zepto.js"],function(){
                require.async(["http://m.sui.taobao.org/dist/js/sm.js"],function(){
                    require.async(["picker"],function(){
                        +function($){
                            $(document).on("pageInit", function() {
                                $("#city-picker").val(val).cityPicker({
                                    toolbarTemplate: '<header class="bar bar-nav">\
                                                        <button class="button button-link pull-right close-picker">确定</button>\
                                                        <h1 class="title">选择收货地址</h1>\
                                                        </header>'
                                }).picker("close");
                            });
                            $.init();
                        }(Zepto);
                    });
                });
            });
        }
        //关闭选择收货地址界面
        function closeChooseFun(){
            teGoIn.hide().find(".AdList").css({
                "bottom":-he+'px'
            });
        }
        //关闭修改收货地址界面
        function closeUpdateFun(){
            teGoIn.find(".AdList").show();
            teGoIn.find(".updateAddressPopup").fadeOut(100);
        }
        //打开选择收货地址界面
        function openChooseFun(){
            teGoIn.show().find(".AdList").animate({
                bottom:"0"
            },200);
        }
        //打开修改收货地址界面
        function openUpdateFun(){
            ChooseAddress();
            teGoIn.show().find(".updateAddressPopup").slideDown(200);
            teGoIn.find(".AdList").fadeOut(100);
        }
        //验证正则表达式验证成功并返回数据
        function returnVerification(){
            var reg;
            var verName = /^.{1,30}$/;
            var verPhone = /^1[0-9]{10}$/;
            var verAddress = /^.{3,200}$/;
            var nameVal = name.val();
            var PhoneVal = Phone.val();
            var AddressVal = county.val();
            var id = name.attr('data-id');
            var provinceVal='';
            var cityVal='';
            var areaVal = '';
            var val = Address.val().split(" ");
            if(val[0]) {
                provinceVal = val[0];
            }
            if(val[1]) {
                cityVal = val[1];
            }
            if(val[2]){
                areaVal = val[2];
            }
            if(areaVal == ""){
                areaVal=cityVal;
                cityVal=provinceVal;
            }
            if(!verName.test(nameVal)){
                name.focus();
                temp.ModalFrame("收货人姓名应为1-30个字符！！！",1200);
            }else if(!verPhone.test(PhoneVal)){
                Phone.focus();
                temp.ModalFrame("电话号码为空或输入错误！！！",1200);
            }else if(Address.val()==""){
                temp.ModalFrame("请选择所在地区！！！",1200);
            }else if(!verAddress.test(AddressVal)){
                Address.focus();
                temp.ModalFrame("街道地址应为3-200个字符！！！",1200);
            }else{
                reg = {
                    consignee:nameVal,
                    telPhone:PhoneVal,
                    province:provinceVal,
                    city:cityVal,
                    area:areaVal,
                    address:AddressVal,
                    id:id
                }
            }
            return reg;
        }
        //地址列表
        function AddressList(){
            var AddList = temp.AjaxSend('api/customer/securityurl/memeber/address/','','get');//收货地址列表
            var ob = AddList.object;
            if(ob.length==0){
                DefAdds();
                closeChooseFun();
                $timeout(function(){
                    $scope.AddLists = '';
                });
            }else{
                $timeout(function(){
                    $scope.AddLists = ob;
                });
            }
        }
        //修改收货地址
        function UpdateAddress(data,check){
            if(check){
                var data = temp.AjaxSend('api/customer/securityurl/memeber/address',data,'put');//修改收货地址接口
                if(data.ok){
                    DefAdds();
                    closeChooseFun();
                }else{
                    temp.ModalFrame(data.msg,1200);
                }
            }else{
                name.val(data.consignee);
                Phone.val(data.telPhone);
                county.val(data.address);
                name.attr("data-id",data.id);
                teGoIn.find(".AdList").hide();
                teGoIn.find(".updateAddressPopup").fadeIn();
                if(data.city==data.province){
                    ChooseAddress(data.province+' '+data.area+' ');
                }else{
                    ChooseAddress(data.province+' '+data.city+' '+data.area);
                }
            }
        }
        //默认收获地址
        function DefAdds(){
            var DefAdd = temp.AjaxSend('api/customer/securityurl/memeber/defaultaddress','','get');//默认地址
            $('.TAddressTemplate').show();
            if(DefAdd.object==null){
                $timeout(function(){
                    $scope.DefAdds = '';
                    $scope.DefCh='请输入默认地址';
                    sessionStorage.removeItem("defaultaddressStorage");
                    var AddList = temp.AjaxSend('api/customer/securityurl/memeber/address/','','get');//收货地址列表
                    var ob = AddList.object;
                    if(ob.length==0){
                        teGoIn.find('.AddLeBtn').hide();
                        name.val("");
                        Phone.val("");
                        county.val("");
                        name.attr("data-id","");
                        openUpdateFun();
                        //修改收货地址界面（未选中默认地址时）
                        closeUpdateAddress.unbind('click').bind('click',function(e){
                            e.stopPropagation();
                            closeUpdateFun();
                            teGoIn.hide();
                        });
                    }else{
                        AddressList();
                        openChooseFun();
                    }
                });
            }else{
                $timeout(function(){
                    $scope.DefAdds = DefAdd.object;
                    sessionStorage.defaultaddressStorage = JSON.stringify(DefAdd.object);
                    $scope.DefCh = '收货人: ';
                    if(type==2){
                        teGoIn.find('.updateAddressPopup').css({
                            top:0
                        });
                        teGoIn.find('.AdList').css({
                            top:0
                        });
                        closeChooseAddress.hide();
                        AddressList();
                        openChooseFun();
                    }
                });
            }
        }
    };
    //加载更多
    var i = 1;
    exports.AddMoreFun = function(temp,$scope,$timeout,dataObj){
        $(window).unbind("scroll").bind("scroll",function(){
            addMore();
        });
        function addMore(){
            if(dataObj.oldObj.total/10>i){
                if($(document).scrollTop() + $(window).height() > $(document).height() - 1)// 接近底部100px
                {
                    temp.ModalFrame('正在加载中....',function(){
                        i++;
                        dataObj.urlObj.page=i;
                        var data = temp.AjaxSend('api/shop/storegoods/1/',dataObj.urlObj,'get');//API商城项目-景点列表接口
                        data.rows.forEach(function(rows){
                            $timeout(function(){
                                $scope.mains.rows.push(rows);
                            });
                        });
                    });
                }
            }
        }
    }
});