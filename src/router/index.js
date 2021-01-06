import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/operation'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/operation',
                    name:'operation',
                    component: resolve => require(['../page/operation/operation.vue'], resolve),
                    meta: { title: 'Operation data' }
                },
                {
                    path: '/users',
                    name:'users',
                    component: resolve => require(['../page/users/users.vue'], resolve),
                    meta: { title: 'Users management' }
                },
                {
                    path: '/resumes',
                    name:'resumes',
                    component: resolve => require(['../page/resumes/resumes.vue'], resolve),
                    meta: { title: 'Resumes management' }
                },
                {
                    path: '/promulgator',
                    name:'promulgator',
                    component: resolve => require(['../page/promulgator/promulgator.vue'], resolve),
                    meta: { title: 'Promulgator' }
                },
                {
                    path: '/account',
                    name:'account',
                    component: resolve => require(['../page/account/account.vue'], resolve),
                    meta: { title: 'Account management' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                }
            ]
        },
        {
            path: '/login',
            name:'login',
            component: resolve => require(['../page/account/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
