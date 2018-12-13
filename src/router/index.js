import Vue from 'vue';
import Router from 'vue-router';

import Main from '@/components/Main';
import Add from '@/components/Add';
import View from '@/components/View';
import List from '@/components/List';
import Media from '@/components/Media';
import Search from '@/components/Search';
import * as db from '../config/db';
Vue.use(Router);

let routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/list/:category',
    name: 'List',
    component: List
  },
  {
    path: '/add',
    name: 'Add',
    component: Add
  },
  {
    path: '/edit/:id',
    name: 'Edit',
    component: Add
  },
  {
    path: '/view/:id',
    name: 'View',
    component: View
  }
];
if (db.sys_id === 0) {
  routes = [
    ...routes,
    {
      path: '/media',
      name: 'Media',
      component: Media
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    }
  ];
}
export default new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return {
        x: 0,
        y: 0
      };
    }
  },
  routes
});
