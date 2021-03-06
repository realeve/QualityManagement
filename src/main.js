// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import VueResource from 'vue-resource'
Vue.use(VueResource)

//see detail here: https://github.com/ElemeFE/vue-infinite-scroll
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)

import animate from 'animate.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
        App
    }
})