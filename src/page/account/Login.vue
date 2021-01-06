// 登录
<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="logo-box"><img src="../../assets/img/img.jpg"/></div>
            <div class="ms-title">Younique Recruiment Platform Administrator Program</div>
            <el-form :model="ruleForm" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="ID">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="Password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">Sign In</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm() {
                if(!this.ruleForm.username||this.ruleForm.username==''){
                    Vue.operationFeedback({type:'warn',text:'Please enter the account number'});
                    return;
                }
                if(!this.ruleForm.password||this.ruleForm.password==''){
                    Vue.operationFeedback({type:'warn',text:'Please enter your password'});
                    return;
                }
                let fb=Vue.operationFeedback({text:'In the login...'});
                Vue.api.login({name:this.ruleForm.username,password:this.ruleForm.password}).then((res)=>{
                    if(res.respCode=='2000'){
                        let data=JSON.parse(res.respMsg);
                        this.$cookie.set('account',JSON.stringify(data),7);
                        fb.setOptions({type:'complete',text:'Login successful'});
                        this.$router.push({name:'operation',params:{}}); 
                    }else{
                        fb.setOptions({type:'warn',text:'Login failed，'+res.respMsg});
                    };
                });
            }
        },
        created(){

        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .logo-box{
        height:120px;
        text-align: center;
        padding:20px;
    }
    .logo-box img{
        
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:600px;
        margin:-190px 0 0 -300px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 130px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>