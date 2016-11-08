define(['jq'],function(require, exports, module) {
    exports.userInfo=function(){
        require.async(["angSend"],function(temp){
            require.async(["pub"],function(bn){
                var data = bn.AjaxSend('api/customer/securityurl/memeber','','get');//用户信息
                temp.sendMain({
                    control:function($scope,$timeout){
                        $scope.objs = data;
                        var sex='';
                        if(!data.object.memberSex){
                            sex='女';
                        }else{
                            sex='男';
                        }
                        $('#userSex').val(sex);

                        $('#save').click(function(){
                            var userName = $('#userName').val();
                            var userSex = $('#userSex').val();
                            var userPhone = $('#userPhone').val();
                            var checkName = /^[\u4E00-\u9FA5A-Za-z]{2,10}$/;
                            var checkNum = /^1[0-9]{10}$/;
                            var sexVal;
                            if(userName==''||userName==null){
                                bn.ModalFrame('昵称不能为空！！！');
                            }else if(!checkName.test(userName)){
                                bn.ModalFrame('昵称应为2-10个字符！！！');
                            }else if(userSex==''||userSex==null||userSex.length<=0){
                                bn.ModalFrame('性别不能为空！！！')
                            }else if(userPhone==''||userPhone==null||userPhone.length<=0){
                                bn.ModalFrame('手机不能为空！！！');
                            }else if(!checkNum.test(userPhone)){
                                bn.ModalFrame('手机输入错误！！！');
                            }else{
                                if(userSex=='男'){
                                    sexVal=true;
                                }else{
                                    sexVal=false;
                                }
                                var userObj={
                                    memberNickName:userName,
                                    memberSex:sexVal,
                                    memberMobile:userPhone
                                };
                                var data = bn.AjaxSend('api/customer/securityurl/memeberupdate',userObj,'PUT');//修改用户信息
                                if(data.ok){
                                    bn.ModalFrame('修改成功！！！');
                                }else{
                                    bn.ModalFrame(data.msg);
                                }
                            }
                        });


                        $('#exit').click(function(){
                        	localStorage.lyxczhlycom = '';
                            bn.ModalFrame('退出成功!!!',function(){
                                window.location.href='Index/index.html'
                            })
                        });


                        $('#addGL').click(function(){
                            window.location.href='AddList.html?backurl=userInfo.html'
                        })
                    }
                });
            });
        });
    };
    exports.userPjList=function(){
        require.async(["angSend"],function(temp){
            require.async(["pub"],function(bn){
                temp.sendMain({
                    control:function($scope,$timeout){
                        var goodsID = bn.getUrlVal('goodsID');
                        var evaluationGoodStar = bn.getUrlVal('evaluationGoodStar');
                        var goodCommentValue = bn.getUrlVal('goodCommentValue');
                        var data = bn.AjaxSend('api/goods/comment/'+goodsID+'/','','get');//收藏列表
                        $scope.objs = data;
                        if(data.rows.length<=0){       //判断是否有评价
                            $('#maxDIVpj').html('暂无评价！！！').css({
                                'text-align':'center'
                            });
                        }else{
                            $scope.$on("finished1",function(){
                                $('#backUrl').click(function(){
                                    window.location.href='goodsDetail.html?goodsID='+goodsID+'';
                                });
                                $('.ll_z2 p').html(evaluationGoodStar+'分');
                                $('.ll_hp1').html(goodCommentValue+'%');
                                //满意度星级循环
                                bn.Strarts(evaluationGoodStar,"Public/images/l_xing.png","Public/images/redStrat.png","#ll_mydlist li");
                                //列表星级循环
                                $(data.rows).each(function(j){
                                    bn.Strarts(this.starlevel,"Public/images/l_xing.png","Public/images/redStrat.png",".ll_startIMg",j);
                                });
                            });
                        }
                    }
                });
            });
        });

    };
});