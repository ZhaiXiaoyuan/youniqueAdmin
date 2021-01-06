// 账号管理
<template>
    <div class="table">
        <div class="crumbs"></div>
        <div class="container">
            <el-row class="handle-box">
                <el-col :span="24">
                    <el-button type="primary" icon="el-icon-plus" @click="openFormModal()">
                        Create
                    </el-button>
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable" v-loading="pager.loading">
                <!-- <el-table-column label="serial number" align="center" width="100">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column> -->
                <el-table-column prop="name" label="Name" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" align="center">
                    <!-- <template slot-scope="scope">
                        {{scope.id}}
                    </template> -->
                </el-table-column>
                <el-table-column label="Initial Password" align="center">123456</el-table-column>
                <el-table-column label="Password" align="center">
                    <template slot-scope="scope">
                        <span @click="initialize(scope.row)" class="cm-btn cm-link-btn">Initialize</span>
                    </template>
                </el-table-column>
                <el-table-column label="Operation"  align="center">
                    <template slot-scope="scope">
                        <span @click="openFormModal(scope.row)" class="cm-btn cm-link-btn">Edit</span>
                        <span @click="remove(scope.$index)" class="cm-btn cm-link-btn">Delete</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    @current-change="getList"
                    layout="prev, pager, next"
                    :page-size="pager.pageSize"
                    :total="pager.total">
                </el-pagination>
            </div>
        </div>


        <el-dialog :title="curEntry?'Create account':'Edit account'" class="edit-dialog" :visible.sync="formModalFlag" v-if="formModalFlag" width="320px"  :close-on-click-modal="false">
            <div class="dialog-body">
                <div>
                    <el-form ref="form" :model="form" label-width="0">
                        <div style="width: 100%;">
                            <el-form-item>
                                <el-input v-model="form.name" placeholder="Name"></el-input>
                            </el-form-item>
                            <el-form-item v-if="!curEntry">
                                <el-input v-model="form.password" placeholder="Initial Password" type="password"></el-input>
                            </el-form-item>
                        </div>
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
<style scoped>
    .handle-box{
        margin-bottom: 20px;
    }
    .handle-select{
        width: 120px;
    }
    .handle-input{
        width: 300px;
        display: inline-block;
    }

</style>
<script>
    import Vue from 'vue'

    export default {
        data() {
            return {
                account:{},
                pager:{
                  pageIndex:1,
                  pageSize:20,
                  total:0,
                  loading:false
                },
                entryList:[],
                curEntry:null,
                formModalFlag:false,
                form:{}
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            // 获取用户列表
            getList (pageIndex) {
                this.pager.pageIndex=pageIndex?pageIndex:1;
                let params={
                    regionCode:'',
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                }
                this.pager.loading=true;
                Vue.api.getAdminList(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        if(data.list=="[]"){
                            this.entryList=[];
                            this.pager.total=0;
                        }else{
                            let list=data.list;
                            this.entryList=list;
                            this.pager.total=data.count;
                        }
                    };
                    let timeout=setTimeout(()=>{
                        this.pager.loading=false;
                        clearTimeout(timeout);
                    },500)
                });
            },
            // 重置密码
            initialize(row){
                let fb=Vue.operationFeedback({text:'In the reset...'});
                Vue.api.updateAdminPassword({id:row.id,newPassword:'ADMIN_PASSWORD_RESET',oldPassword:'123'}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:'Password reset successful'});
                    }else{
                        fb.setOptions({type:'warn',text:resp.respMsg});
                    };
                });
            },
            // 打开新增或编辑弹窗
            openFormModal (entry) {
                this.resetForm();
                this.curEntry=entry;
                if(this.curEntry){
                    this.form={...this.curEntry}
                };
                this.formModalFlag=true;
            },
            // 关闭编辑弹窗
            closeFormModal () {
                this.formModalFlag=false;
            },
            // 重置表单
            resetForm () {
                this.form={
                    name:null,
                    password:null
                };
                this.curEntry=null;
            },
            // 保存
            save () {
                if(!this.form.name){
                    Vue.operationFeedback({type:'warn',text:'Please enter the account name'});
                    return;
                };
                let params={
                    name:this.form.name
                };
                if(!this.curEntry){
                    if(!this.form.password){
                        Vue.operationFeedback({type:'warn',text:'Please enter the password'});
                        return;
                    };
                    if(this.form.password.length<6){
                        Vue.operationFeedback({type:'warn',text:'Password length cannot be less than 6'});
                        return;
                    };
                    params.password=this.form.password;
                };
                let fb=Vue.operationFeedback({text:'In the save...'});
                if(this.curEntry){
                    params.id=this.curEntry.id;
                    Vue.api.updateAdmin(params).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList(this.pager.pageIndex);
                            fb.setOptions({type:'complete',text:'Save success'});
                            this.closeFormModal();
                        }else{
                            fb.setOptions({type:'warn',text:'Save failed,'+resp.respMsg});
                        }
                    });
                }else{
                    Vue.api.addAdmin(params).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList();
                            fb.setOptions({type:'complete',text:'Save success'});
                            this.closeFormModal();
                        }else{
                            fb.setOptions({type:'warn',text:'Save failed,'+resp.respMsg});
                        }
                    });
                }
            },
            // 删除管理员账号
            remove (index) {
                let fb=Vue.operationFeedback({text:'Delete the...'});
                Vue.api.removeAdmin({id:this.entryList[index].id}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:'Delete the success'});
                        this.entryList.splice(index,1);
                        if(this.entryList.length==0){
                            this.getList();
                        };
                    }else{
                        fb.setOptions({type:'warn',text:'Delete failed,'+resp.respMsg});
                    };
                });
            },
        },
        mounted () {
            this.account=this.getAccountInfo();
            this.getList();
        },
    }
</script>
