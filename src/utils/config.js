
/*基础配置*/
export default {
    install: function (Vue, options) {
        let isDev=false&&process.env.NODE_ENV=='development';
        Vue.appConfig={
            domain:isDev?'http://www.iamunique.eu:8081/':'http://www.iamunique.eu:8081/',
            fileDomainUrl:isDev?'http://www.iamunique.eu/':'http://www.iamunique.eu/',
            // domain:isDev?'http://api.linqi.tech:80/':'http://api.linqi.tech:80/',
            // domain:isDev?'http://api.linqi.tech:8611/':'http://api.linqi.tech:8611/',
            fileDomain:isDev?'http://api.linqi.tech:8611/image/':'http://api.linqi.tech:8611/image/',
        }
    },
}
