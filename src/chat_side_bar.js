import Vue from 'vue';
import ChatSidebar from './components/ChatSidebar.vue';
import install from 'quasar/src/install.js';
import * as directives from 'quasar/src/directives.js'
import * as plugins from 'quasar/src/plugins.js'
// import { date } from 'quasar'
import ZAFClient from 'zendesk_app_framework_sdk'
const client = ZAFClient.init()

Vue.prototype.$client = client
// Vue.prototype.$date = date

Vue.use({
    install
}, {
    directives,
    plugins,
})

new Vue({
    el: '#chat_sidebar',
    render: h => h(ChatSidebar),
})