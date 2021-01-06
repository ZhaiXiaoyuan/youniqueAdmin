// 资讯管理
<template>
    <div class="table">
        <div class="container">
            <el-row class="handle-box" :gutter="20">
                <el-col :span="4">
                    <el-button type="primary" icon="el-icon-plus" @click="openFormModal()">
                        Create
                    </el-button>
                </el-col>
                <el-col :span="18" :offset="2"  style="text-align: right;">
                       <el-select v-model="search.state" class="handle-select mr10">
                            <el-option
                                v-for="item in regionList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input v-model="search.searchContent" placeholder="title key words" class="handle-input mr10"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="getList()">search</el-button>
                    </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable" v-loading="pager.loading">
                <el-table-column prop="title" label="title" align="center"></el-table-column>
                <el-table-column prop="updatedAt" label="Last edit time"  align="center">
                    <template slot-scope="scope">
                       {{scope.row.updatedAt|formatDate('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="Published time"  align="center">
                    <template slot-scope="scope">
                       {{scope.row.createdAt|formatDate('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="Status"  align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state!=='published'" @click="updatePromulgatorState(scope.row)" class="cm-btn cm-link-btn">{{scope.row.state}}</span>
                        <span v-else>{{scope.row.state}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="Operation" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state==='published'" @click="updatePromulgatorState(scope.row)" class="cm-btn cm-link-btn">Recall</span>
                        <span v-if="scope.row.state!=='published'" @click="openFormModal(scope.row)" class="cm-btn cm-link-btn">Edit</span>
                        <span v-if="scope.row.state!=='published'" @click="removePromulgator(scope.$index)" class="cm-btn cm-link-btn">Delete</span>
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


        <el-dialog :title="curEntry?'Edit Publish':'Create Publish'" class="edit-dialog" :visible.sync="formModalFlag" v-if="formModalFlag" width="80%"  :close-on-click-modal="false">
            <div class="dialog-body">
                <div>
                    <el-form ref="form" :model="form" label-width="0">
                        <div style="width: 60%;">
                            <el-form-item prop="headline">
                                <el-input v-model="form.title" placeholder="Title"></el-input>
                            </el-form-item>
                            <el-select style="width: 100%;margin-bottom:20px" v-if="!curEntry" v-model="form.state">
                                <el-option
                                    v-for="item in regionList2"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <el-form-item prop="reason">
                            <div id="editor" style="max-width: 800px;"></div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeFormModal()">cancel</el-button>
                <el-button type="primary" @click="save()">confirm</el-button>
            </div>
        </el-dialog>

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
                search:{
                    state:'',
                    searchContent:''
                },
                formModalFlag:false,
                form:{
                    title:null,
                    state:null,
                    content:null,
                },
                editor:null,

                regionList:[
                    {
                        label:'All',
                        value:'',
                    },
                    {
                        label:'Published',
                        value:'published',
                    },
                    {
                        label:'Unpublished',
                        value:'unpublished',
                    }
                ],
                regionList2:[
                    {
                        label:'Published',
                        value:'published',
                    },
                    {
                        label:'Unpublished',
                        value:'unpublished',
                    }
                ]
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
                    state:this.search.state,
                    searchContent:this.search.searchContent,
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                };
                this.pager.loading=true;
                Vue.api.getPromulgatorList(params).then((resp)=>{
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
                    };
                    let timeout=setTimeout(()=>{
                        this.pager.loading=false;
                        clearTimeout(timeout);
                    },500)
                });
            },
            // 获取详情
            getPromulgatorInfo:function (entry) {
                Vue.api.getPromulgatorInfo({id:entry.id}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let detail=JSON.parse(resp.respMsg);
                        this.editor.txt.html(detail.content)
                    };
                });
            },
            // 打开弹窗
            openFormModal:function (entry) {
                this.resetForm();
                this.curEntry=entry;
                if(this.curEntry){
                    this.form={...this.curEntry}
                };
                this.formModalFlag=true;
                setTimeout(()=>{
                    let E = window.wangEditor;
                    this.editor = new E('#editor');
                    this.editor.customConfig.lang = {
                        '设置标题': 'title',
                        '正文': 'p',
                        '链接文字': 'link text',
                        '链接': 'link',
                        '上传图片': 'upload image',
                        '上传': 'upload',
                        '创建': 'init',
                        '字号': 'word size',
                        '字体': 'font',
                        '宋体': 'song typeface',
                        '微软雅黑': 'Microsoft jas black',
                        '文字颜色': 'color',
                        '背景色': 'background',
                        '对齐方式': 'alignment',
                        '设置列表': 'list',
                        '靠左': 'on the left',
                        '居中': 'In the middle',
                        '靠右': 'on the right',
                        '有序列表': 'an ordered list',
                        '无序列表': 'unordered list',
                        '网络图片': 'network image',
                        '默认': 'default',
                        '新浪': 'sina',
                        '插入表格':'insert table',
                        '插入视频':'insert the video',
                        '插入代码':'insert the code',
                        '插入':'insert',
                        '行':'line',
                        '列的表格':'column of the table',
                        '格式如':'format such as',
                        // 还可自定添加更多
                    }
                    this.editor.customConfig.colors =Vue.tools.basicConfig.colors;
                    this.editor.customConfig.uploadImgMaxSize = 5* 1024 * 1024;
                    this.editor.customConfig.uploadImgMaxLength = 1;
                    this.editor.customConfig.uploadImgTimeout = 3000;
                    this.editor.customConfig.customUploadImg = (files, insert) => {
                        // let formData = new FormData();
                        // formData.append('coverPicFile', files[0]);
                        let fb=Vue.operationFeedback({text:'Are uploading...'});
                        
                        Vue.api.uploadPic({apiParams:JSON.stringify({}),coverPicFile:files[0]}).then(function (data) {
                            if(data.status=='2000'){
                                fb.setOptions({type:'complete',text:'Uploaded successfully',delayForDelete:1500});
                                insert(Vue.basicConfig.imageUrl+data.respMsg);
                            }else{
                                fb.setOptions({type:'warn',text:'Upload failed'});
                            }
                        });
                    }
                    this.editor.create();
                    this.editor.txt.clear();
                    
                    if(this.curEntry){
                        this.getPromulgatorInfo(entry);
                    }
                },500);
            },
            // 隐藏弹窗
            closeFormModal:function () {
                this.formModalFlag=false;
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
            // 提交
            save:function () {
                if(!this.form.title){
                    Vue.operationFeedback({type:'warn',text:'Please enter the title'});
                    return;
                };
                this.form.content=this.editor.txt.html();
                this.form.content=this.form.content=='<p><br></p>'?'':this.form.content;
                if(!this.form.content){
                    Vue.operationFeedback({type:'warn',text:'Please enter the content'});
                    return;
                }
                let fb=Vue.operationFeedback({text:'In the save...'});
                let params={
                    title:this.form.title,
                    content:this.form.content
                }
                if(this.curEntry){
                    params.id=this.curEntry.id;
                    Vue.api.updatePromulgator(params).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList(this.pager.pageIndex);
                            fb.setOptions({type:'complete',text:'Save success'});
                            this.closeFormModal();
                        }else{
                            fb.setOptions({type:'warn',text:'Save failed，'+resp.respMsg});
                        }
                    });
                }else{
                    params.state=this.form.state;
                    Vue.api.addPromulgator(params).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList();
                            fb.setOptions({type:'complete',text:'Save success'});
                            this.closeFormModal();
                        }else{
                            fb.setOptions({type:'warn',text:'Save failed，'+resp.respMsg});
                        }
                    });
                }
            },
            // 删除资讯
            removePromulgator(index) {
                let fb=Vue.operationFeedback({text:'Delete the...'});
                Vue.api.removePromulgator({id:this.entryList[index].id}).then((resp)=>{
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
            },
            // 资讯上下架
            updatePromulgatorState (row) {
                console.log(row);
                let entry=row;
                let tips='';
                let state='';
                switch (entry.state){
                    case 'published':
                        tips='recall';
                        state='unpublished';
                        break;
                    case 'unpublished':
                        tips='published';
                        state='published';
                        break
                }
                let fb=Vue.operationFeedback({text:'In the '+tips+'...'});
                Vue.api.updatePromulgatorState({id:entry.id,state:state}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:tips+' successful'});
                        entry.state=state;
                    }else{
                        fb.setOptions({type:'warn',text:tips+'failure，'+resp.respMsg});
                    }
                });
            },
        },
        mounted () {
            this.account=this.getAccountInfo();
            this.getList();
        },
    }
</script>
