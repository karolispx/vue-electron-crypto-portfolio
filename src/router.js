import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router);

export const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/home',
            meta: {
                title: 'Crypto Portfolio App'
            }
        },
        {
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '*',
            redirect: '/home'
        }
    ]
});