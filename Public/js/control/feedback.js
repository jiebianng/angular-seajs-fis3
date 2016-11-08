define(['jq'],function(require, exports, module) {
    exports.feedback=function(){
        require.async(["pub"],function(bn){
            $('.l_bcv1').click(function(){
                var text = $('#cl_content').val();
                if(text==''||text==null||text.length<=0){
                    bn.ModalFrame('内容不能为空！！！');
                }else{
                    var datas={
                        'complaintTypeId':1,
                        'complaintType':"服务投诉",
                        'content':text
                    };
                    var data = bn.AjaxSend('api/customer/securityurl/complaint',datas, "post");
                    if(data.ok){
                        bn.ModalFrame('反馈成功！！！',function(){
                            window.location.href='index.html';
                        });
                    }
                }
            })
        });
    };
    exports.about=function(){
        require.async(["pub"],function(bn){
            $('.l_bcv1').click(function(){
                var text = $('#cl_content').val();
                if(text==''||text==null||text.length<=0){
                    bn.ModalFrame('内容不能为空！！！');
                }else{
                    var datas={
                        'complaintTypeId':1,
                        'complaintType':"服务投诉",
                        'content':text
                    };
                    var data = bn.AjaxSend('api/customer/securityurl/complaint',datas, "post");
                    if(data.ok){
                        bn.ModalFrame('反馈成功！！！',function(){
                            window.location.href='index.html';
                        });
                    }
                }
            })
        });
    };
});