/**
 * Created by Administrator on 2016/1/7.
 */
define(function(require,exports,module){
    exports.Banner = function(){                  //����_class����
        require.async(['swiper'],function(_class){
            var swiper = new Swiper('.'+_class, {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                autoplay: 3000,
                autoplayDisableOnInteraction: false,
                preloadImages:false
            });
        });
    }
});