/**
 * Created by Administrator on 2016/1/7.
 */
//define(['jq'],function(require,exports,module){
//    exports.LoadMore = function(url,data,type){
//        require.async(["angSend"],function(temp){
//            require.async(['pub'],function(bn){
//                var i=1;
//                addMore();
//                $(window).unbind("scroll").bind("scroll",function(){
//                    addMore();
//                });
//                function addMore(){
//                    if($scope.objs.total/10>i){
//                        if($(document).scrollTop() + $(window).height() > $(document).height() - 1)// �ӽ��ײ�100px
//                        {
//                            bn.ModalFrame('���ڼ�����....',function(){
//                                i++;
//                                var data = bn.AjaxSend(url,data,type);//API�̳���Ŀ-�Ƶ�-��ҳ�ӿ�
//                                data.rows.forEach(function(rows){
//                                    $timeout(function(){
//                                        $scope.objs.rows.push(rows);
//                                    });
//                                });
//                            });
//                        }
//                    }
//                }
//            })
//        })
//
//    }
//});