import Vue from 'vue';
import NavBar from './components/NavBar.vue';
import install from 'quasar/src/install.js';
import * as directives from 'quasar/src/directives.js'
import * as plugins from 'quasar/src/plugins.js'
import ZAFClient from 'zendesk_app_framework_sdk'
import VueRouter from 'vue-router'
import routes from './routes.js'
import request from '@/utils/request.js'
const client = ZAFClient.init()

Vue.prototype.$client = client
Vue.prototype.$request = request
Vue.use(VueRouter)
Vue.use({
    install
}, {
    directives,
    plugins
})


const router = new VueRouter({
    routes
})

new Vue({
    el: '#nav_bar',
    router,
    render: h => h(NavBar)
})