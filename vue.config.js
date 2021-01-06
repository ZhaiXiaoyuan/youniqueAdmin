module.exports = {
    publicPath: './',
    productionSourceMap: false,
    devServer: {
        port:'8097',
        open: true,
        proxy: {
            '/younique':{
                target:'47.254.176.25',
                changeOrigin:true,
                pathRewrite:{
                    '/younique':''
                }
            },
            '/ms':{
                target: '47.254.176.25',
                changeOrigin: true
            }
        }
    }
}