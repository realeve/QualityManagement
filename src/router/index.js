import Vue from 'vue'
import Router from 'vue-router'

import Main from '@/components/Main'
import Add from '@/components/Add'
import View from '@/components/View'
import List from '@/components/List'
import Media from '@/components/Media'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  routes: [{
    path: '/',
    name: 'Main',
    component: Main
  }, {
    path: '/list/:category',
    name: 'List',
    component: List
  }, {
    path: '/add',
    name: 'Add',
    component: Add
  }, {
    path: '/view/:id',
    name: 'View',
    component: View
  }, {
    path: '/media',
    name: 'Media',
    component: Media
  }]
})
