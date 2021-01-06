<template>
  <el-dialog
  title="Review"
  :visible.sync="show" :fullscreen="true" top="0" :before-close="handleClose" class="view">
    <div v-if="isPdf" id="pdf_viewer" :style="{height:height+'px'}"><div class="loading"><i class="el-icon-loading"></i><p class="hint">In the open</p></div></div>
    <iframe v-else :style="{height:height+'px'}" :src='"https://view.officeapps.live.com/op/view.aspx?src="+url' width='100%' height='100%' frameborder='1'></iframe>
  </el-dialog>
</template>
<script>
import { setTimeout } from 'timers';
// const { PDFObject } =require('../../public/pdfobject')
export default {
    props:{
        url:'',
        show:true
    },
  data() {
    return {
        height:500,
        isPdf:true
    };
  },
  methods: {
    handleClose(){this.$emit('hide')},
  },
  created() {
      this.height=document.documentElement.clientHeight-60;
      this.isPdf=this.url.indexOf('.pdf')>-1||this.url.indexOf('.PDF')>-1?true:false;
      if(this.isPdf){
        setTimeout(()=>{
          PDFObject.embed(this.url, "#pdf_viewer");
        },100)
      };
  },
  mounted() {

  },
}
</script>
<style scoped>
.loading{
    width:300px;
    margin:100px auto;
    text-align: center;
}
.el-icon-loading{
    font-size:40px;
    line-height:80px;
}
.hint{
    font-size:20px;
}
</style>