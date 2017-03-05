import Vue from 'vue';
import Router from 'vue-router';

import Main from '@/components/Main';
import Add from '@/components/Add';
import View from '@/components/View';
import List from '@/components/List';

Vue.use(Router);

export default new Router({
	routes: [{
		path: '/',
		name: 'Main',
		component: Main
	}, {
		path: '/list',
		name: 'List',
		component: List
	}, {
		path: '/add',
		name: 'Add',
		component: Add
	}, {
		path: '/view',
		name: 'View',
		component: View
	}]
});