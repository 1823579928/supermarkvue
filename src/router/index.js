import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
		path: '/login',
		name: 'home',
		component: Home
	},
	{
		path: '/main',
		name: 'main',
		component: () => import('../views/mains/Main.vue'),
		/* resolve => require(['../views/mains/Main.vue'], resolve) */
		meta: {
			title: '权限测试',
			permission: true //开启权限验证
		},
		children: [{
			path: "/BooksList",
			name: "BooksList",
			component: () => import('@/components/BooksList.vue')
		}]
	},
	{
		path: '/about',
		name: 'about',
		component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
