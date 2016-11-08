var timestamp = new Date().toLocaleString();
//微信OpenId
sessionStorage.weixinOpenId=localStorage.lyxczhlycom;
seajs.config({
    // 路径配置
    paths: {
        'url':'/shopwap/tem2/Public'//配置url路径（根据项目需求更改）
    },
    //map: [
    //    [ /^(.*\/Public\/js\/plug\/.*\.(?:css|js))(?:.*)$/i, '$1?'+timestamp+'' ],
    //    [ /^(.*\/Public\/js\/control\/.*\.(?:css|js))(?:.*)$/i, '$1?'+timestamp+'' ],
    //    [ /^(.*\/Public\/js\/view\/.*\.(?:css|js))(?:.*)$/i, '$1?'+timestamp+'' ],
    //    [ /^(.*\/Public\/js\/model\/.*\.(?:css|js))(?:.*)$/i, '$1?'+timestamp+'' ],
    //    [ /^(.*\/Public\/js\/.*\.(?:css|js))(?:.*)$/i, '$1?'+timestamp+'' ],
    //    [ /^(.*\/Public\/css\/.*\.(?:css|js))(?:.*)$/i, '$1?'+timestamp+'' ]
    //],
    charert:"utf-8"
});
/**
 * 配置plug别名
 */
seajs.config({
    alias: {
        'se_c':'url/js/seajs-css.js',//sea.css
        'jq': 'url/js/plug/jquery-1.9.1.min.js',//jquery-1.9.1
        'angular':'url/js/plug/angular-1.3.0.min.js',//angular-1.3.0
        'bootstrap':'url/js/plug/bootstrap.min.js',//bootstrap
        'swiper':'url/js/plug/swiper.min.js',//滑动插件
        'custom':'url/js/plug/mobiscroll.custom-2.5.0.min.js',//时间选择控件
        'picker':'url/js/plug/sm-city-picker.js'//地区选择
    },
    preload: ['jq']//预先加载
});

/**
 * 配置Css别名
 */
seajs.config({
    alias: {
        'main': 'url/js/main.js',//全局js
        'mobiscroll-css': 'url/css/mobiscroll.custom-2.5.0.min.css',//时间控件样式
        'sm-css': 'url/css/sm.css',//省市区样式
        'animate-css': 'url/css/animate.css',//css3动画样式
        'swiper-css': 'url/css/swiper3.1.0.min.css',//轮播样式
        'style-css': 'url/css/style.css'//全局样式
    }
});
/**
 * 配置control别名
 */
seajs.config({
    alias: {
        "tem":"url/js/control/tem.js",//地址模板
        "ShopCart":"url/js/control/tem_shopCart.js",//购物车模板
        "ConfirmOrder":"url/js/control/tem_ConfirmOrder.js",//确认订单模板
        "index":"url/js/control/index.js",//首页
        "classify":"url/js/control/classify.js",//分类
        "order":"url/js/control/order.js",//订单
        "goodsDetails":"url/js/control/goodsDetails.js",//详情页
        "myKeep":"url/js/control/tem_MyKeep.js",//我的收藏
        "userInfo":"url/js/control/userInfo.js",//个人信息
        "feedback":"url/js/control/feedback.js",//意见反馈+关于我们
        "pingjia":"url/js/control/pingjia.js"//意见反馈+关于我们
    }
});
/**
 * 配置model别名
 */
seajs.config({
    alias: {
        'angSend': 'url/js/model/angSend.js',  //发送angular方法
        'pub': 'url/js/model/public.js',//全局,
        'view': 'url/js/model/view.js'//功能视图
    }
});
//加载展示界面
/**
 * 加载全局模块
 */
seajs.use(['se_c'],define(function(require,exports,module){
    require('style-css');
    require('main');
}));
