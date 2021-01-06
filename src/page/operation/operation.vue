// 首页 数据展示
<template>
    <div class="operation">
        <div class="operation-cont">
            <div class="circle flex">
                <div class="flex1" id="Gender" style="width:400px;height:400px;"></div>
                <div class="flex1" id="Age" style="width:400px;height:400px;"></div>
            </div>
            <div class="bar-box">
                <div id="City" style="800px;height:400px;"></div>
            </div>
            <div class="bar-box">
                <div id="School" style="800px;height:400px;"></div>
            </div>
            <div class="circle flex">
                <div class="flex1" id="Equipment" style="width:400px;height:400px;"></div>
                <div class="flex1" id="Diplomas" style="width:400px;height:400px;"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    export default {
        data() {
            return {
                account:null,
                genderList:null,
                ageList:null,
                diplomaList:null,
                equipmentList:null,
                cityList:null,
                schoolList:null
            }
        },
        created(){
            this.account=this.getAccountInfo();
            if(this.account.admin){
                this.getAllStatistics();
                this.getStatisticsDeviceResult();
            };
        },
        mounted () {
           
        },
        computed: {

        },
        methods: {
            // 获取大部分数据统计
            getAllStatistics(){
                Vue.api.getAllStatistics({}).then((res)=>{
                    if(res.respCode=='2000'){
                        let datas=JSON.parse(res.respMsg);
                        datas.forEach(e => {
                           let item= JSON.parse(e);
                            item.list.forEach(ev=>{
                                ev.value=ev.count;
                            });
                            if(item.type=='gender'){
                                this.genderList=item.list;
                            };
                            if(item.type=='age'){
                                this.ageList=item.list;
                            };
                            if(item.type=='city'){
                                this.cityList=item.list;
                            };
                            if(item.type=='diploma'){
                                this.diplomaList=item.list;
                            };
                            if(item.type=='school'){
                                this.schoolList=item.list;
                            };
                        });
                        this.getChartPie('Gender',this.genderList);
                        this.getChartPie('Age',this.ageList,1);
                        this.getChartPie('Diplomas',this.diplomaList,1);
                        this.getChartBar('City',this.cityList);
                        this.getChartBar('School',this.schoolList);
                    }else{
                        Vue.operationFeedback({type:'warn',text:res.respMsg});
                    }
                })
            },
            // 获取登陆设备数据统计
            getStatisticsDeviceResult(){
                Vue.api.getStatisticsDeviceResult({dayDuration:90}).then((res)=>{
                    if(res.respCode=='2000'){
                        let datas=JSON.parse(res.respMsg);
                        this.equipmentList=[
                            {"name":"PC","value":datas.PC},
                            {"name":"Mobile","value":(datas.total-datas.PC)}
                        ];
                        this.getChartPie('Equipment',this.equipmentList);
                    }else{
                        Vue.operationFeedback({type:'warn',text:res.respMsg});
                    }
                })
            },
            // 获取圆形图
            getChartPie(id,datas,color){
                var dom = document.getElementById(id);
                var myChart = this.echarts.init(dom);
                let nameList=[];
                datas.forEach(e=>{
                   nameList.push(e.name);
                })
                myChart.setOption({
                    title: {
                        text: id,
                        left: 30,
                        top: 20,
                        textStyle: {
                            color: '#666'
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        right: 30,
                        align:'left',
                        itemWidth:10,
                        itemHeight:10,
                        itemRadius:5,
                        data:nameList
                    },
                    series: [{
                        name: id,
                        color:color==undefined?['#7ed0f6','#f56262','#ffdd8c','#9985f0','#55ee96','#d3ee55','#f77c0f','#d55ece']:['#d55ece','#f77c0f','#d3ee55','#55ee96','#9985f0','#ffdd8c','#f56262','#7ed0f6'],
                        type: 'pie',
                        radius: ['46%', '70%'],
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                textStyle : {
                                    fontWeight : 300 ,
                                    fontSize : 16    //文字的字体大小
                                },
                                formatter:'{d}%'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: 24,
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        data:datas
                    }]
                });
            },
            // 获取柱形图
            getChartBar(id,datas){
                var dom = document.getElementById(id);
                var myChart = this.echarts.init(dom);
                let nameList=[];
                let dataList=[];
                datas.forEach(e=>{
                   nameList.push(e.name);
                   dataList.push(e.value)
                })
                myChart.setOption({
                    title: {
                        text: id,
                        left: 30,
                        top: 20,
                        textStyle: {
                            color: '#666'
                        }
                    },
                    xAxis: {
                        show:false,
                        type: 'value'
                    },
                    yAxis: {
                        show:false,
                        type: 'category',
                        data: nameList
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} {c}"
                    },
                    series: [{
                        color:['#64cce6'],
                        data: dataList,
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                textStyle : {
                                    fontWeight : 600 ,
                                    color:'#999',
                                    fontSize : 16    //文字的字体大小
                                },
                                formatter:'{c}'
                            }
                        },
                    }]
                })
            }
        }
    }
</script>
<style scoped>
    .operation-cont{
        background: #fff;
        margin:10px;
        border-radius: 20px;
        padding:20px 10px;
    }
</style>