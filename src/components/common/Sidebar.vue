<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#fff"
            text-color="#000000" active-text-color="#64cce6" unique-opened router>
            <template v-for="item in items">
                <el-menu-item :index="item.index" :key="item.index">
                    <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-s-data',
                        index: '/operation',
                        title: 'Operation data'
                    },
                    {
                        icon: 'el-icon-s-tools',
                        index: '/users',
                        title: 'Users management'
                    },
                    {
                        icon: 'el-icon-document',
                        index: '/resumes',
                        title: 'Resumes management'
                    },
                    {
                        icon: 'el-icon-s-promotion',
                        index: '/promulgator',
                        title: 'Promulgator'
                    },
                    {
                        icon: 'el-icon-s-custom',
                        index: '/account',
                        title: 'Account management'
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
        box-shadow: 8px 0px 16px 0px 
		rgba(57, 57, 57, 0.06);
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
