/**
 * Created by Designer on 2017/12/21.
 */
import router from '../router'


export default {
  install: function (Vue, options) {


    Vue.http.options.emulateJSON = true;
    Vue.http.interceptors.push((request, next)  =>{

      next((response) => {
        //对于有作登录状态的接口你，未未登录时跳转到登录页
        if(response.status==401){
         /* router.push({name:''});*/
        }
        return response
      });

    });
    /*自定义ajax函数，自带的不好用*/
    Vue.http.ajax = async function (options) {
      if(options.method.toUpperCase() == 'GET'){
        let res = await Vue.http.get(options.url, {params: options.params});
        if(typeof res.body == 'string'){
          return JSON.parse(res.body);
        }else{
          return res.body;
        }
      }else if(options.method.toUpperCase() == 'POST'){
        let params={apiParams:JSON.stringify(options.params)};
        if(options.type=='formData'){
            params=Vue.tools.toFormData(options.params);
        };
        let res = await Vue.http.post(options.url, params);
        if(typeof res.body == 'string'){
          return JSON.parse(res.body);
        }else{
          return res.body;
        }
      }
    }

      let basicUrl=Vue.appConfig.domain+'';
      function sessionInfo() {
          return{
              token:'',
              timeStamp:Date.parse(new Date())/1000,
              random:parseInt(Math.random()*1000000),
              signature:''
          }
      }
    Vue.api={
        //管理员登录
        login (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'admin/login',
                params: params
            });
        },
        //更改管理员账号信息
        updateAdmin (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'admin/updateAdmin',
                params: params
            });
        },
        //更改密码
        updateAdminPassword (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'admin/updateAdminPassword',
                params: params
            });
        },
        //退出
        logout (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'admin/logout',
                params: params
            });
        },
        //新增管理员
        addAdmin (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'admin/addAdmin',
                params: params
            });
        },
        //获取管理员列表
        getAdminList (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'admin/getAdminList',
                params: params
            });
        },
        //删除管理员
        removeAdmin (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'admin/removeAdmin',
                params: params
            });
        },
        // 获取统计数据
        getAllStatistics (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'statistics/getAllStatistics',
                params: params
            });
        },
        // 获取登陆设备统计数据
        getStatisticsDeviceResult (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'statisticsDevice/getStatisticsDeviceResult',
                params: params
            });
        },
        //资讯上下架
        updatePromulgatorState (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'promulgator/updatePromulgatorState',
                params: params
            });
        },
        //删除资讯
        removePromulgator (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'promulgator/removePromulgator',
                params: params
            });
        },
        
        //获取资讯的分页列表
        getPromulgatorList (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'promulgator/getPromulgatorList',
                params: params
            });
        },
        //添加资讯
        addPromulgator (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'promulgator/addPromulgator',
                params: params
            });
        },
        //根据id获取资讯详情
        getPromulgatorInfo (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'promulgator/getPromulgatorInfo',
                params: params
            });
        },
        //编辑资讯
        updatePromulgator (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'promulgator/updatePromulgator',
                params: params
            });
        },
        //上传富文本图片
        uploadPic (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'promulgator/addContentPicture',
                type:"formData",
                params: params
            });
        },
        // 获取简历列表
        getResumeList(params){
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'user/getResumeList',
                params: params
            });
        },
        // 批量下载在线简历
        getUserResumeInBatch(params){
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'user/getUserResumePdfInBatch',
                params: params
            });
        },
        // 批量下载用户上传简历
        getUserUploadResumeInBatch(params){
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'user/getUserUploadResumeInBatch',
                params: params
            });
        },
        // 获取用户管理列表
        getUserList(params){
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'user/getUserList',
                params: params
            });
        },
        // 新增用户评论
        addUserAppraise(params){
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'user/addUserAppraise',
                params: params
            });
        },
        // 删除用户评论
        removeUserAppraise(params){
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'user/removeUserAppraise',
                params: params
            });
        },
        // 更新后台评论列表
        updateUserAppraise(params){
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'user/updateUserAppraise',
                params: params
            });
        },
        // 在线简历生成pdf
        getUserResumePdf(params){
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'user/getUserResumePdf',
                params: params
            });
        }
    }
  },

}
