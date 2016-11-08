/**
 * Created by Administrator on 2015/12/1.
 */
//加载顶部展示界面
define(['jq'],function(require,exports,module){
    //判断浏览器类型
    var browser = {
        versions:function(){
            var u = navigator.userAgent, app = navigator.appVersion;
            return {//移动终端浏览器版本信息
                trident: u.indexOf("Trident") > -1, //IE内核
                presto: u.indexOf("Presto") > -1, //opera内核
                webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
                gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
                iPhone: u.indexOf("iPhone") > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf("iPad") > -1, //是否iPad
                webApp: u.indexOf("Safari") == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language:(navigator.browserLanguage || navigator.language).toLowerCase()
    };
    if(browser.versions.ios){
        var head = $('.All_TopHead');
        var len = head.find('.r_clickEdit').length;
        if(len==0){
            head.hide();
        }
    }
//        加载底部页面
    var _footer = $(".templates_Footer");
    var _footer_tem = _footer.attr("data-template");
    if(_footer_tem=='tj_All_footer'){
        _footer.load("Public/js/tj_All_footer.html");
    }
});