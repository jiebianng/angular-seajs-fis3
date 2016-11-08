/**
 * Created by Administrator on 2015/11/3.
 */
define(function(require, exports, module){
    exports.sendMain = function (data){
        require.async(['angular'],function(){
            var app = angular.module("myApp", []);
            var names = ['finished1','finished2','finished3','finished4','finished5',
                'finished6','finished7','finished8','finished9','finished10'];
            //页面加载完成
            names.forEach(function (name) {
                app.directive(name, function ($timeout) {
                    return {
                        restrict: 'A',
                        link: function(scope,element,attr) {
                            if (scope.$last === true) {
                                $timeout(function() {
                                    scope.$emit(name);
                                });
                            }
                        }
                    };
                });
            });
            //以html方式展示
            app.filter('html', ['$sce', function ($sce) {
                return function (text)
                {
                    return $sce.trustAsHtml(text);
                };
            }]);
            //错误图片显示失败图标
            app.directive('errSrc', function() {
                return {
                    link: function(scope, element, attrs) {
                        element.bind('error', function() {
                            if (attrs.src != attrs.errSrc) {
                                attrs.$set('src', attrs.errSrc);
                            }
                        });
                    }
                }
            });
            //程序加载完成后再加载图片
            app.directive('imgSrc', function() {
                return {
                    link: function(scope, element, attrs) {
                        var clear = setInterval(function(){
                            if(document.readyState=='complete'){
                                clearInterval(clear);
                                attrs.$set('src', attrs.imgSrc);
                            }
                        },10);
                    }
                }
            });
            //剪切字符串
            app.filter('cut', function () {
                return function (value, wordwise, max, tail) {
                    if (!value) return '';
                    max = parseInt(max, 10);
                    if (!max) return value;
                    if (value.length <= max) return value;
                    value = value.substr(0, max);
                    if (wordwise) {
                      var lastspace = value.lastIndexOf(' ');
                      if (lastspace != -1) {
                        value = value.substr(0, lastspace);
                      }
                    }
                    return value + (tail || ' …');
                };
            });
            //app.config('$routeProvider', function($routeProvider){
            //    $routeProvider
            //        .when('/', {
            //            templateUrl: 'guige.html',
            //            controller : 'AppControl'
            //        })
            //        .otherwise({
            //            redirectTo : '/'
            //        });
            //});
            //control
            app.controller('AppControl',function($scope,$timeout) {
                data.control($scope,$timeout);
            });
        });
    };
});