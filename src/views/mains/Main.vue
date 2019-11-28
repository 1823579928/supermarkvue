<template>
	<el-container style="height: 100%; border: 1px solid #eee">
		<!--头部-->
		<el-header height="80px" width="100%">
			<el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff"
			 active-text-color="#ffd04b">
				<el-menu-item index="1">处理中心</el-menu-item>
				<el-submenu index="2">
					<template slot="title">我的工作台</template>
					<el-menu-item index="2-1">选项1</el-menu-item>
					<el-menu-item index="2-2">选项2</el-menu-item>
					<el-menu-item index="2-3">选项3</el-menu-item>
				</el-submenu>
				<el-menu-item index="3">订单管理</el-menu-item>
			</el-menu>
		</el-header>
		<el-row>
		<el-button type="primary" @click="clearCache">清除前端缓存</el-button>
		</el-row>
		<el-container style="overflow-y: hidden;">
			<el-aside width="27%" style="background-color:white;overflow: hidden;height:1000px;">
				<el-row class="tac">
					<el-col :span="12">
						<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
							<el-menu-item index="/BooksList" @click="goTo('/BooksList')">
								<i class="el-icon-menu"></i>
								<span slot="title">图书管理</span>
							</el-menu-item>
						</el-menu>
					</el-col>
				</el-row>
			</el-aside>
			<el-main>
				<router-view />
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	//映入 写好的cookie获取缓存
	import {
		setCookie,
		getCookie
	} from '../../assets/cookie.js';
	export default {
		data() {
			return {
			};
		},
		created() {
		},
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			goTo(path) {
				/**
				 * 跳转页面
				 * 参数path 为跳转的页面
				 */
				this.$router.replace(path);
			},
			clearCache(){	//清除缓存
				/**
				 * 修改缓存
				 * 参数、
				 * 1：缓存名称
				 * 2：缓存内容
				 * 3：缓存有效时间   -1失效
				 */
				setCookie('roles','',-1);
				/**
				 * 清空localStorage中的缓存信息
				 */
				localStorage.setItem("ms_username", ''); // 使用localstoage来记录登陆信息
				localStorage.setItem("roles", '');
				localStorage.setItem("permissions", '');
				
				this.$router.replace('/login');
			}
		}
	};
</script>

<style>
</style>
