// 用户信息管理
<template>
    <div class="table">
        <div class="container">
            <el-row class="handle-box" :gutter="20">
                <el-col :span="4">
                    <el-button type="primary" @click="openFormModal1()">
                        Batch download
                    </el-button>
                </el-col>
                <el-col :span="18" :offset="2"  style="text-align: right;">
                    <el-select v-model="search.onlineResumeState" class="handle-select mr10">
                        <el-option
                            v-for="item in onlineResumeState"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="search.uploadResumeState" class="handle-select mr10">
                        <el-option
                            v-for="item in uploadResumeState"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-model="search.searchContent" placeholder="User ID or Phone number" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="getList()">Search</el-button>
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable" v-loading="pager.loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="user.id" label="User ID" align="center"></el-table-column>
                <el-table-column prop="name" label="Name"  align="center">
                    <template slot-scope="scope">
                        {{scope.row.user.firstName+' '+scope.row.user.lastName}}
                    </template>
                </el-table-column>
                <el-table-column prop="user.createdAt" label="Registration time"  align="center">
                    <template slot-scope="scope">
                       {{scope.row.user.createdAt|formatDate('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column prop="user.lastLoginTime" label="Last signing time"  align="center">
                    <template slot-scope="scope">
                       {{scope.row.user.lastLoginTime|formatDate('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column label="Online resume" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.user.resumeState==='imcomplete'">Incomplete</span>
                        <span v-if="scope.row.user.resumeState!=='imcomplete'" @click="onlineRead(scope.row.user.id)" class="cm-btn cm-link-btn">Read</span>
                        <span v-if="scope.row.user.resumeState!=='imcomplete'" @click="onlineDownload(scope.row.user.id)" class="cm-btn cm-link-btn">Download</span>
                    </template>
                </el-table-column>
                <el-table-column label="Uploaded resume" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.uploadResumeState==='null'">Null</span>
                        <span v-if="scope.row.uploadResumeState!=='null'" @click="read(scope.row.user.uploadResumeUrl)" class="cm-btn cm-link-btn">Read</span>
                        <span v-if="scope.row.uploadResumeState!=='null'" @click="download(scope.row.user.uploadResumeUrl)" class="cm-btn cm-link-btn">Download</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    @current-change ="getList"
                    layout="prev, pager, next"
                    :page-size="pager.pageSize"
                    :total="pager.total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="Batch download" class="edit-dialog" :visible.sync="batchDownloadFlag" v-if="batchDownloadFlag" width="360px"  :close-on-click-modal="false">
            <div class="dialog-body">
                <el-row class="handle-box" :gutter="20">
                    <el-col :span="10">
                        <div :class="['resumes-download',{active:batchDownloadType===0}]" @click="changeBatchDownloadType(0)">Online resumes</div>
                    </el-col>
                    <el-col :span="10" :offset="2"  style="text-align: right;">
                        <div :class="['resumes-download',{active:batchDownloadType===1}]" @click="changeBatchDownloadType(1)">Uploaded resumes</div>
                    </el-col>
                </el-row>
                <div style="text-align:center">
                    <el-button type="primary" @click="save()">confirm</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 预览pdf -->
        <PdfView :show="showPdf" v-if="showPdf" @hide="showPdf=false" :url="pdfUrl"></PdfView>
    </div>
</template>
<style scoped>
    .handle-box{
        margin-bottom: 20px;
    }
    .handle-select{
        width: 160px;
    }
    .handle-input{
        width: 200px;
        display: inline-block;
    }
    .resumes-download{
        text-align: center;
        width:150px;
        height:150px;
        line-height: 150px;
        background: #f6f6f6;
        cursor: pointer;
    }
    .resumes-download.active{
        background: #cfd8f9;
    }
</style>
<script>
    import Vue from 'vue'
    import PdfView from "../../components/PdfView";
    export default {
        components:{
            PdfView
        },
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
                search:{
                    onlineResumeState:'',
                    uploadResumeState:'',
                    searchContent:''
                },
                batchDownloadFlag:false,
                batchDownloadType:'',
                form:{
                    title:null,
                    state:null,
                    content:null,
                },
                editor:null,
                onlineResumeState:[
                    {
                        label:'Online resume',
                        value:'',
                    },
                    {
                        label:'Complete',
                        value:'complete',
                    },
                    {
                        label:'Incomplete',
                        value:'imcomplete',
                    }
                ],
                uploadResumeState:[
                    {
                        label:'Uploaded resume',
                        value:'',
                    },
                    {
                        label:'Null',
                        value:'null',
                    },
                    {
                        label:'Uploaded',
                        value:'uploaded',
                    }
                ],
                userIdList:[],
                // 是否显示预览简历
                showPdf:false,
                pdfUrl:''
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            // 获取列表
            getList (pageIndex) {
                this.pager.pageIndex=pageIndex?pageIndex:1;
                let params={
                    onlineResumeState:this.search.onlineResumeState,
                    uploadResumeState:this.search.uploadResumeState,
                    searchContent:this.search.searchContent,
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                };
                this.pager.loading=true;
                Vue.api.getUserList(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        console.log(data);
                        if(data.list=="[]"){
                            this.entryList=[];
                            this.pager.total=0;
                        }else{
                            let list=data.list;
                            this.entryList=list;
                            this.pager.total=data.count;
                        };
                    };
                    let timeout=setTimeout(()=>{
                        this.pager.loading=false;
                        clearTimeout(timeout);
                    },500)
                });
            },
            // 批量选择
            handleSelectionChange(val){
                let list=[];
                val.forEach(e => {
                    list.push({
                        userId:e.user.id
                    })
                });
                this.userIdList=list;
            },
            // 打开弹窗
            openFormModal1:function (entry) {
                if(this.userIdList.length==0){
                    Vue.operationFeedback({type:'warn',text:'Please choose'});
                    return;
                };
                this.resetForm();
                this.batchDownloadType='';
                this.batchDownloadFlag=true;
            },
            // 选择下载哪种类型的简历
            changeBatchDownloadType(type){
                this.batchDownloadType=type;
            },
            // 隐藏弹窗
            closeFormModal1:function () {
                this.batchDownloadFlag=false;
            },
            // 重置表单
            resetForm:function () {
                this.form={
                    title:null,
                    state:null,
                    content:null,
                };
                this.curEntry=null;
            },
            // 批量下载
            save:function () {
                if(this.batchDownloadType===''){
                    Vue.operationFeedback({type:'warn',text:'Please choose type'});
                    return;
                };
                let fb=Vue.operationFeedback({text:'In the download...'});
                let params={
                    jsonArrayString:JSON.stringify(this.userIdList)
                };
                if(this.batchDownloadType===0){
                    // 批量下载在线简历
                    Vue.api.getUserResumeInBatch(params).then((resp)=>{
                        if(resp.respCode=='2000'){
                            fb.setOptions({type:'complete',text:'Save success'});
                            window.location.href=this.basicConfig.resumeUrl+resp.respMsg;
                            this.closeFormModal1();
                        }else{
                            fb.setOptions({type:'warn',text:'Save failed，'+resp.respMsg});
                        }
                    });
                }else{
                    // 批量下载上传简历
                    Vue.api.getUserUploadResumeInBatch(params).then((resp)=>{
                        if(resp.respCode=='2000'){
                            fb.setOptions({type:'complete',text:'Save success'});
                            window.location.href=this.basicConfig.resumeUrl+resp.respMsg;
                            this.closeFormModal1();
                        }else{
                            fb.setOptions({type:'warn',text:'Save failed，'+resp.respMsg});
                        }
                    });
                }
            },
            onlineRead(id){
                this.getUserResumePdf(id,res=>{
                    this.read(res);
                })
            },
            onlineDownload(id){
                this.getUserResumePdf(id,res=>{
                    this.download(res);
                })
            },
            // 预览
            read(url){
                this.pdfUrl=this.basicConfig.resumeUrl+url;
                if(!PDFObject.supportsPDFs&&(url.indexOf('.pdf')>-1||url.indexOf('.PDF')>-1)){
                    Vue.operationFeedback({type: "warn", text: "Preview is not supported in your browser..." });
                    return;
                };
                this.showPdf=true;
            },
            // 下载
            download(url){
                window.location.href=this.basicConfig.resumeUrl+url;
            }

        },
        mounted () {
            this.account=this.getAccountInfo();
            this.getList();
        },
    }
</script>
