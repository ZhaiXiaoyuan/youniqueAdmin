// 简历管理
<template>
    <div class="table">
        <div class="container">
            <el-row class="handle-box" :gutter="20">
                <el-col :span="5"  style="padding:0 3px;">
                    <el-select v-model="search.diploma">
                        <el-option
                            v-for="item in diploma"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="5" :offset="1" style="padding:0 3px;">
                    <el-select v-model="search.gender">
                        <el-option
                            v-for="item in gender"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="5" :offset="1" style="padding:0 3px;">
                    <el-select v-model="search.nationality" v-if="nationality">
                        <el-option label="Nationality" value=""></el-option>
                        <el-option
                            v-for="item in nationality"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="5" :offset="1" style="padding:0 3px;">
                    <el-select v-model="search.currentCountry" v-if="nationality">
                        <el-option label="CurrentCountry" value=""></el-option>
                        <el-option
                            v-for="item in nationality"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="handle-box">
                <el-col :span="5">
                    <div class="sub-title">Age</div>
                    <div>
                        <el-input v-model="search.ageLowerBound" class="age-input"></el-input>
                        <span class="age-span">~</span>
                        <el-input v-model="search.ageUpperBound" class="age-input"></el-input>
                    </div>
                </el-col>
                <el-col :span="5" :offset="1">
                    <div class="sub-title">City</div>
                    <el-input v-model="search.currentCity"></el-input>
                </el-col>
                <el-col :span="5" :offset="1">
                    <div class="sub-title">School</div>
                    <el-input v-model="search.school"></el-input>
                </el-col>
                <el-col :span="5" :offset="1">
                    <div class="sub-title">Major</div>
                    <el-input v-model="search.major"></el-input>
                </el-col>
            </el-row>
            <el-row class="handle-box" :gutter="20">
                <el-col style="text-align: center;">
                    <el-button type="primary" icon="el-icon-search" @click="getList()">search</el-button>
                </el-col>
            </el-row>
            <el-row class="handle-box" :gutter="20">
                <el-col>
                    <el-button type="primary" @click="openFormModal1()">Batch download</el-button>
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable" v-loading="pager.loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="Name" align="center">
                    <template slot-scope="scope">
                        {{scope.row.user.firstName+' '+scope.row.user.lastName}}
                    </template>
                </el-table-column>
                <el-table-column prop="user.age" label="Age" align="center">
                    <template slot-scope="scope">
                       {{scope.row.user.birthday|age()}}
                    </template>
                </el-table-column>
                <el-table-column prop="user.gender" label="Gender" align="center"></el-table-column>
                <el-table-column prop="user.diplomas" label="Diplomas" align="center"></el-table-column>
                <el-table-column prop="user.currentCountry" label="Country/Region" align="center"></el-table-column>
                <el-table-column prop="user.currentCity" label="City" align="center"></el-table-column>
                <el-table-column prop="user.nationality" label="Nationality" align="center"></el-table-column>
                <el-table-column prop="user.schoolMajorList" label="School" align="center">
                    <template slot-scope="scope">
                       {{scope.row.user.schoolMajorList.length>0?scope.row.user.schoolMajorList[0].school:'-'}}
                    </template>
                </el-table-column>
                <el-table-column prop="user.schoolMajorList" label="Major" align="center">
                    <template slot-scope="scope">
                       {{scope.row.user.schoolMajorList.length>0?scope.row.user.schoolMajorList[0].major:'-'}}
                    </template>
                </el-table-column>
                <el-table-column label="Online resume" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.user.resumeState==='imcomplete'">Incomplete</span>
                        <span v-if="scope.row.user.resumeState!=='imcomplete'" @click="onlineRead(scope.row.user.id)" :href="scope.row.user.uploadResumeUrl" class="cm-btn cm-link-btn">Read</span>
                        <span target="_blank" download v-if="scope.row.user.resumeState!=='imcomplete'" @click="onlineDownload(scope.row.user.id)"  class="cm-btn cm-link-btn">Download</span>
                    </template>
                </el-table-column>
                <el-table-column label="Uploaded resume" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.uploadResumeState==='null'">Null</span>
                        <span v-if="scope.row.uploadResumeState!=='null'" @click="read(scope.row.user.uploadResumeUrl)" :href="scope.row.user.uploadResumeUrl" class="cm-btn cm-link-btn">Read</span>
                        <span target="_blank" v-if="scope.row.uploadResumeState!=='null'" @click="download(scope.row.user.uploadResumeUrl)" class="cm-btn cm-link-btn">Download</span>
                    </template>
                </el-table-column>
                <el-table-column label="Operation" align="center">
                    <template slot-scope="scope">
                        <span @click="openFormModal(scope.row)" class="cm-btn cm-link-btn">Appraise</span>
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

        <el-dialog title="Appraise（about name）" class="edit-dialog appraise-dialog" :visible.sync="formModalFlag" v-if="formModalFlag" width="500px"  :close-on-click-modal="false">
            <div class="dialog-body">
                <div>
                    <el-form ref="form" :model="form" label-width="0">
                        <el-form-item prop="reason">
                            <el-input
                                type="textarea"
                                :rows="5"
                                placeholder=""
                                v-model="form.appraise">
                            </el-input>
                        </el-form-item>
                        <div style="text-align:center">
                            <el-button type="primary" @click="save()">Save</el-button>
                        </div>
                    </el-form>
                    <p class="review-tit">Review</p>
                    <div class="review-list">
                        <div class="review-item" 
                            v-for="item in appraiseList"
                            :key="item.id">
                            <p>{{item.appraise}} (<span class="cm-btn cm-link-btn" style="padding:0" @click="removePromulgator(item.id)">Delete</span>)<span class="mr-span"></span></p>
                            <p class="review-date">{{item.submitDate}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
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
                    <el-button type="primary" @click="confirm()">confirm</el-button>
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
        width: 100px;
    }
    .handle-input{
        width: 200px;
        display: inline-block;
    }
    .age-input{
        width: 38%;
    }
    .sub-title{
        text-align: center;
        line-height: 18px;
        padding:0 0 8px;
        font-size:14px;
        color:#8492a6;
    }
    .age-span{
        width:16%;
        display: inline-block;
        text-align: center;
        color:#8492a6;
    }
    .review-tit{
        line-height: 40px;
        font-size:16px;
    }
    .review-item{
        position: relative;
        line-height: 18px;
        font-size:12px;
    }
    .review-item  .mr-span{
        width:70px;
        height:10px;
        display: inline-block;
    }
    .review-date{
        position: absolute;
        right:0;
        bottom:0;
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
                    diploma:'',
                    gender:'',
                    nationality:'',
                    currentCountry:'',
                    currentCity:'',
                    ageLowerBound:'16',
                    ageUpperBound:'150',
                    school:'',
                    major:''
                },
                formModalFlag:false,
                form:{
                    appraise:null
                },
                editor:null,
                appraiseList:null,
                diploma:[
                    {
                        label:'Diploma',
                        value:'',
                    },
                    {
                        label:'Bachelor',
                        value:'Bachelor',
                    },
                    {
                        label:'Master',
                        value:'Master',
                    },
                    {
                        label:'Doctor',
                        value:'Doctor',
                    },
                    {
                        label:'Post Doctor',
                        value:'Post Doctor',
                    }
                ],
                gender:[
                    {
                        label:'Gender',
                        value:'',
                    },
                    {
                        label:'Male',
                        value:'male',
                    },
                    {
                        label:'Female',
                        value:'female',
                    }
                ],
                nationality:[],
                batchDownloadFlag:false,
                batchDownloadType:'',
                userIdList:[],
                // 是否显示预览简历
                showPdf:false,
                pdfUrl:''
            }
        },
        created(){
            this.nationality=this.getNationality();
        },
        computed: {
        },
        methods: {
            dow(){
                this.bulkDownload(['http://www.51purse.com/pdf/web/b.pdf']);
            },
            bulkDownload(list){
                for(var i =0;i<list.length;i++){  //循环遍历调用downloadFile方法
                    const url = list[i];
                    this.downloadFile(url);         
                };
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
            // 批量下载
            confirm:function () {
                console.log(this.batchDownloadType);
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
            // 下载
            download(url){
                window.location.href=this.basicConfig.resumeUrl+url;
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
            // 获取列表
            getList (pageIndex) {
                this.pager.pageIndex=pageIndex?pageIndex:1;
                let params={
                    diploma:this.search.diploma,
                    gender:this.search.gender,
                    nationality:this.search.nationality,
                    currentCountry:this.search.currentCountry,
                    currentCity:this.search.currentCity,
                    ageLowerBound:this.search.ageLowerBound,
                    ageUpperBound:this.search.ageUpperBound,
                    school:this.search.school,
                    major:this.search.major,
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                };
                if(this.search.ageLowerBound!=''&&this.search.ageLowerBound<16){
                    Vue.operationFeedback({type:'warn',text:'Age minimum 16'});
                    return;
                };  
                if(this.search.ageUpperBound!=''&&this.search.ageUpperBound>150){
                    Vue.operationFeedback({type:'warn',text:'Age maximum 150'});
                    return;
                };
                this.pager.loading=true;
                Vue.api.getResumeList(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        if(data.list=="[]"){
                            this.entryList=[];
                            this.pager.total=0;
                        }else{
                            let list=data.list;
                            this.entryList=list;
                            this.pager.total=data.count;
                        };
                        this.entryList.forEach(e=>{
                            if(e.user.schoolMajorList=="[]"||e.user.schoolMajorList==''){
                                e.user.schoolMajorList=[];
                            }else{
                                e.user.schoolMajorList=JSON.parse(e.user.schoolMajorList);
                            };
                        });
                    };
                    let timeout=setTimeout(()=>{
                        this.pager.loading=false;
                        clearTimeout(timeout);
                    },500)
                });
            },
            // 打开弹窗
            openFormModal(row) {
                this.resetForm();
                this.curEntry=row;
                this.appraiseList=JSON.parse(row.user.appraise);
                this.formModalFlag=true;
            },
            // 隐藏弹窗
            closeFormModal:function () {
                this.formModalFlag=false;
            },
            // 重置表单
            resetForm:function () {
                this.form={
                    appraise:null
                };
                this.curEntry=null;
            },
            // 提交
            save:function () {
                if(!this.form.appraise){
                    Vue.operationFeedback({type:'warn',text:'Please enter the Appraise'});
                    return;
                };
                let params={
                    userId:this.curEntry.user.id,
                    appraise:this.form.appraise,
                    adminId:this.account.admin.id
                };
                let fb=Vue.operationFeedback({text:'In the save...'});
                Vue.api.addUserAppraise(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        this.getList(this.pager.pageIndex);
                        this.form={
                            appraise:null
                        };
                        fb.setOptions({type:'complete',text:'Save success'});
                        this.appraiseList=JSON.parse(resp.respMsg);
                    }else{
                        fb.setOptions({type:'warn',text:'Save failed，'+resp.respMsg});
                    };
                });
            },
            // 删除评价
            removePromulgator(appraiseId) {
                let params={
                    userId:this.curEntry.user.id,
                    appraiseId:appraiseId
                };
                let fb=Vue.operationFeedback({text:'Delete the...'});
                Vue.api.removeUserAppraise(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:'Delete the success'});
                        this.appraiseList=JSON.parse(resp.respMsg);
                    }else{
                        fb.setOptions({type:'warn',text:'Delete failed,'+resp.respMsg});
                    };
                });
            },
            // 上传
            selectFile:function () {
                let file=document.getElementById('file-input').files[0];
              /*  this.form.file=file;*/
                Vue.tools.fileToBlob(file,(data)=>{
                    this.cropModal({
                        img:data,
                        ok:(data)=>{
                            this.form.logo=data.base64;
                            this.form.file=data.blob;
                        }
                    });
                });
            }
        },
        mounted () {
            this.account=this.getAccountInfo();
            this.nationality=this.getNationality();
            this.getList();
        },
    }
</script>
