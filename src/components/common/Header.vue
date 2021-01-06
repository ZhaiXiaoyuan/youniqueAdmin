<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">Younique Recruiment Platform Administrator Program</div>
        <div class="header-right">
            <span class="change-password" @click="formModalFlag=true">Change Password</span>
            <span command="loginout" @click="loginout">Sign Out</span>
        </div>
        <el-dialog :title="'Reset Password'" class="edit-dialog" :visible.sync="formModalFlag" v-if="formModalFlag" width="320px" :close-on-click-modal="false">
            <div class="dialog-body">
                <div style="width: 100%;">
                    <el-form ref="form" label-width="0">
                        <el-form-item label="">
                            <el-input v-model="form.password" type="password" placeholder="Enter the old password"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input v-model="form.nepassword" type="password" placeholder="Enter your new password"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input v-model="form.rePassword" type="password" placeholder="Enter your new password again"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeFormModal()">取 消</el-button>
                <el-button type="primary" @click="save()">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import bus from '../common/bus';
    import Vue from 'vue'
    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                name: 'linxin',
                message: 2,
                formModalFlag:false,
                form:{}
            }
        },
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods:{
            // 保存密码
            save(){
                if(!this.form.password||this.form.password==''){
                    Vue.operationFeedback({type:'warn',text:'Please enter the old password'});
                    return;
                };
                if(!this.form.nepassword||this.form.nepassword==''){
                    Vue.operationFeedback({type:'warn',text:'Please enter your new password'});
                    return;
                };
                if(this.form.nepassword.length<6){
                   Vue.operationFeedback({type:'warn',text:'Password length cannot be less than 6'});
                   return;
                };
                if(!this.form.rePassword||this.form.rePassword==''){
                    Vue.operationFeedback({type:'warn',text:'Please enter your new password again'});
                    return;
                };
                if(this.form.nepassword!=this.form.rePassword){
                   Vue.operationFeedback({type:'warn',text:'The passwords entered do not match'});
                   return;
                }
                let params={
                    id:this.account.admin.id,
                    newPassword:this.form.nepassword,
                    oldPassword:this.form.password,
                };
                let fb=Vue.operationFeedback({text:'In the save...'});
                Vue.api.updateAdminPassword(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:'Save successfully, the system will exit the account later, please login again'});
                        setTimeout(()=>{
                            this.loginout();
                        },2000)
                    }else{
                        fb.setOptions({type:'warn',text:'Save failed，'+resp.respMsg});
                    }
                })
            },
            // 登出
            loginout(){
                Vue.api.logout({adminId:this.account.admin.id}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        Vue.operationFeedback({type:'warn',text:'Successfully logout of the account'});
                        localStorage.removeItem('ms_username')
                        Vue.cookie.set('account','');
                        this.$router.push('/login');
                    }else{
                        Vue.operationFeedback({type:'warn',text:resp.respMsg});
                    };
                })
            },
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command == 'loginout'){
                    localStorage.removeItem('ms_username')
                    this.$router.push('/login');
                }
            },
            closeFormModal(){
                this.formModalFlag=false;
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            }
        },
        mounted(){
            if(document.body.clientWidth < 1200){
                this.collapseChage();
                bus.$emit('collapse', this.collapse);
            };
            this.account=this.getAccountInfo();
            if(this.account.admin){
                this.form={
                    id:this.account.admin.id,
                    password:this.account.admin.password
                };
            };
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #4d4d4d;
        box-shadow: 0 8px 16px 
		rgba(57, 57, 57, 0.06);
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }
    .header .logo{
        float: left;
        line-height: 70px;
        font-size:16px;
    }
    .header-right{
        float: right;
        padding-right: 50px;
    }
    .header-right span{
        line-height: 70px;
        margin-left:12px;
        cursor: pointer;
        font-size:14px;
        color: #64cce6;
    }
    .header-right span:hover{
        opacity: .9;
    }
</style>
