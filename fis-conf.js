// 加 md5
fis.match('*.{js,css,png}', {
    useHash: true
});
fis.match('*.js', {
    // fis-optimizer-uglify-js 插件进行压缩，已内置
    optimizer: fis.plugin('uglify-js',{
        mangle: false,
        compress : {
            drop_console: true
        }
    })
});
// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
    spriter: fis.plugin('csssprites')
});

// 对 CSS 进行图片合并
fis.match('*.css', {
    // 给匹配到的文件分配属性 `useSprite`
    useSprite: true
});

fis.match('*.css', {
    // fis-optimizer-clean-css 插件进行压缩，已内置
    optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
    // fis-optimizer-png-compressor 插件进行压缩，已内置
    optimizer: fis.plugin('png-compressor')
});
fis.match('/Public/js/config.js', {
    isMod: true
});
fis.hook('cmd', {
    paths: {
        $: '/Public/js/config.js'
    }
});

