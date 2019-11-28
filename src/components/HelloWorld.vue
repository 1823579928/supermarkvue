<template>
	<div>
		<h2>登录</h2>
			<el-form :inline="true" :model="userInfo" class="demo-form-inline">
				<el-form-item label="用户名">
					<el-input v-model="userInfo.username" placeholder="用户名"></el-input>
				</el-form-item><br>
				<el-form-item label="密码">
					<el-input v-model="userInfo.password" show-password placeholder="密码"></el-input>
				</el-form-item>
			</el-form>
			<el-button type="primary" @click="submitUser()">确 定</el-button>
	</div>
</template>

<script>
	import {
		setCookie,
		getCookie
	} from '../assets/cookie.js';
	export default {
		data() {
			return {
				userInfo: {
					username: '',
					password: ''
				}
			}
		},
		methods: {
			submitUser() {
				this.$axios.post("/user/login/", this.qs.stringify({
					'nickname': this.userInfo.username,
					'password': this.userInfo.password
				})).then((response) => {
					var res = response.data.msg;
					alert(res);
					if (res == '登录成功') {
						setCookie('roles', response.data.success.roleList,(24*60*60)); // 使用cookie来记录是否登陆，这边跨域
						let roles = getCookie('roles');
						localStorage.setItem("ms_username", this.username); // 使用localstoage来记录登陆信息
						localStorage.setItem("roles", response.data.success.roleList);
						localStorage.setItem("permissions", response.data.success.permissionList);
						this.$router.replace('/main'); //跳转
					} else {
						alert('登录失败')
					}
				}).catch((error) => {
					alert(error) //请求失败返回的数据
				})
			}
		}
	}
</script>

<style>
</style>
