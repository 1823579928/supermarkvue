import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import Qs from 'qs'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "babel-polyfill"

Vue.use(ElementUI);
Vue.prototype.qs = Qs;
Vue.prototype.$axios = axios
/* axios.default.baseURL = 'http://localhost:8080' */
axios.defaults.baseURL = '/api/'  // api 即上面 vue.config.js 中配置的地址
Vue.config.productionTip = false
// axios.defaults.withCredentials = true


import {
	setCookie,
	getCookie
} from './assets/cookie.js';

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
	const roles = localStorage.getItem('roles');
	const permissions = localStorage.getItem('permissions');
	//这边可以用match()来判断所有需要权限的路径，to.matched.some(item => return item.meta.loginRequire)
	let cookieroles = getCookie('roles');
	console.log('cookie11s' + cookieroles);
	if (!cookieroles && to.path !== '/login') { // cookie中有登陆用户信息跳转页面，否则到登陆页面
		console.log('无权限');
		next('/login');
	} else if (to.meta.permission) { // 如果该页面配置了权限属性（自定义permission）
		// 如果是管理员权限则可进入
		console.log('可以进入');
		roles.indexOf('admin') > -1 ? next() : next('/403');
	}  else {
		// 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
		if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
			Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
				confirmButtonText: '确定'
			});
			console.log('IE10及以下拦截');
		} else {
			console.log('放行');
			next();
		}
	}
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


