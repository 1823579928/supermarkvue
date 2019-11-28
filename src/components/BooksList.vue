<template>
	<div>
		<el-main>
			<el-button type="success" :disabled="judge" size="small" @click="add">增加</el-button>
			<el-table :data="list">
				<el-table-column prop="id" label="编号" width="140">
				</el-table-column>
				<el-table-column prop="booksName" label="图书名称" width="120">
				</el-table-column>
				<el-table-column prop="inventory" label="图书库存" width="120">
				</el-table-column>
				<el-table-column prop="recordDate" label="计入日期" align="center" header-align="center" :formatter="formatDate">
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="primary" size="small" :disabled="judge" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" size="small" :disabled="judge" @click="remove(scope.$index, scope.row)">删除</el-button>
						<!-- scope.row代表当前对应行 -->
					</template>
				</el-table-column>
			</el-table>
		</el-main>

		<!-- 分页 paging -->
		<!--:page-size表示每页显示的数据条数；
		    :total：表示总的数据数量；
		    :page-sizes：表示我们可以自定义每页显示的数量；
		    :currentPage:表示当前的页码；
		    @size-change="handleSizeChange"，@current-change="handleCurrentChange" 是el-pagination中的事件，表示每页显示的数据和页码的变化；
		    layout:表示分页栏的布局;
		    background:表示是否带背景色-->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
		 :page-size="pageSize" layout="total, prev, pager, next" background :total="total"></el-pagination>

		<!-- 编辑图书弹窗  -->
		<el-dialog :title="dialogTitle" width="50%" :visible.sync="iconFormVisible">
			<el-form :inline="true" :model="BooksInfo" class="demo-form-inline">
				<el-form-item label="图书名称">
					<el-input v-model="BooksInfo.booksName" placeholder="图书名称"></el-input>
				</el-form-item>
				<el-form-item label="图书库存">
					<el-input v-model="BooksInfo.inventory" placeholder="图书库存"></el-input>
				</el-form-item>
				<el-form-item label="计入日期">
					<el-date-picker v-model="BooksInfo.recordDate" type="date" placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="iconFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitUser()">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 添加图书弹窗  -->
		<el-dialog :title="dialogTitle" width="50%" :visible.sync="addiconFormVisible">
			<el-form :inline="true" :model="BooksInfo" class="demo-form-inline">
				<el-form-item label="图书名称">
					<el-input v-model="BooksInfo.booksName" placeholder="图书名称"></el-input>
				</el-form-item>
				<el-form-item label="图书库存">
					<el-input v-model="BooksInfo.inventory" placeholder="图书库存"></el-input>
				</el-form-item>
				<el-form-item label="计入日期">
					<el-date-picker v-model="BooksInfo.recordDate" type="date" placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addiconFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitUser()">确 定</el-button>
			</div>
		</el-dialog>



	</div>
</template>

<script>
	export default {
		data() {
			return {
				list: [], //获取遍历集合
				total: 0, //条数
				pageSize: 5,
				currentPage: 1,
				iconFormVisible: false, //判编辑图书的弹窗是否显示
				BooksInfo: {}, //books对象
				dialogTitle: '增加', //窗口的名称
				rowIndex: null, //获取选中的行数
				addiconFormVisible: false, //判断添加图书的弹窗是否显示
				judge: true //判断按钮是否显示
			}
		}, //加载函数
		created() {
			/**
			 * 需要用户角色中有admin角色 才能有增删改查的编辑权限  		
			 * 对权限的一个控制
			 */
			if ((localStorage.getItem('roles').indexOf('admin') > -1)) {
				this.judge = false;
			}
			//显示列表
			this.showTable(this.currentPage, this.pageSize);
			//条数
			this.count();
		},
		methods: {
			handleSizeChange: function(size) {
				this.pageSize = size;
				console.log(this.pageSize); //每页下拉显示数据
				this.showTable(this.currentPage, this.pageSize);
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
				console.log(this.currentPage); //点击第几页
				this.showTable(this.currentPage, this.pageSize);
			},
			showTable(currentPage, pageSize) {
				//axios获取books列表
				this.$axios.post("/books/getBooks", this.qs.stringify({
					currentPage: this.currentPage,
					pageSize: this.pageSize
				})).then((response) => {
					this.list = response.data;
				}).catch((error) => {
					alert(error) //请求失败返回的数据
				})
			},
			count() {
				this.$axios.post("/books/count").then((response) => {
					this.total = response.data;
				}).catch((error) => {
					alert(error) //请求失败返回的数据
				})
			},
			handleEdit(index, row) { //打开编辑弹窗
				//设计弹窗标题
				this.dialogTitle = '编辑';
				//选中的对象赋值给books对象
				this.BooksInfo = row;
				//显示弹窗
				this.iconFormVisible = true;
				//选中集合行数
				this.rowIndex = index;
			},
			submitUser() { //编辑窗口
				if (this.dialogTitle === '编辑') {
					/**
					 * 修改选中列表的books对象
					 */
					this.list[this.rowIndex].booksName = this.BooksInfo.booksName;
					this.list[this.rowIndex].inventory = this.BooksInfo.inventory;
					this.list[this.rowIndex].recordDate = this.BooksInfo.recordDate;
					
					//关闭编辑弹窗
					this.iconFormVisible = false;
					
					/**
					 * $axios的post提交
					 * 参数
					 * 1：api接口路径
					 * 2：需要传入的参数  必须要使用this.qs.stringify的方式传入参数
					 * .then为成功后的请求
					 * .catch为失败的请求
					 */
					this.$axios.post("/books/upBooks", this.qs.stringify({
						'booksName': this.BooksInfo.booksName,
						'inventory': this.BooksInfo.inventory,
						'recordDate': this.formSetDate(this.BooksInfo),
						'id': this.BooksInfo.id
					})).then((response) => {
						var res = response.data;
						if (res.msg != null) {
							alert('该用户未拥有该权限')
						} else {
							if (res == true) {
								alert('编辑成功');
								
								this.BooksInfo = {};
							} else {
								alert('编辑失败')
							}
						}
					}).catch((error) => {
						alert(error) //请求失败返回的数据
					});
					return;
				} else {
					//关闭添加弹窗
					this.addiconFormVisible = false;
					/**
					 * $axios的post提交
					 * 参数
					 * 1：api接口路径
					 * 2：需要传入的参数  必须要使用this.qs.stringify的方式传入参数
					 * .then为成功后的请求
					 * .catch为失败的请求
					 */
					this.$axios.post("/books/addBooks", this.qs.stringify({
						'booksName': this.BooksInfo.booksName,
						'inventory': this.BooksInfo.inventory,
						'recordDate': this.formSetDate(this.BooksInfo)
					})).then((response) => {
						var res = response.data;
						if (res.msg != null) {
							alert('该用户未拥有该权限')
						} else {
							if (res != '0') {
								alert('添加成功');
								//条数+1
								this.total++;
								//res 返回的是添加记录的id
								this.BooksInfo.id = res;
								//追加一条记录到list数组中
								this.list.splice(0, 0, this.BooksInfo); //添加到第一行
								//清空books
								this.BooksInfo = {};
							} else {
								alert('添加失败')
							}
						}
					}).catch((error) => {
						alert(error) //请求失败返回的数据
					});
					return;
				}
			},
			add() {
				//修改弹窗 标题
				this.dialogTitle = '增加';
				//清空books
				this.BooksInfo = {};
				//打开添加弹窗
				this.addiconFormVisible = true;
			},
			formatDate(row) { //获取日期格式
				if (row.recordDate != null) {
					let date = new Date(row.recordDate);
					let Y = date.getFullYear() + '-';
					let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
					let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
					/* let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
					let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
					let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(); */
					return Y + M + D /* + h + m + s */ ;
				} else {
					return '无';
				}
			},
			formSetDate(row) { //修改日期格式
				let date = new Date(row.recordDate);
				let Y = date.getFullYear() + '-';
				let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
				let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
				return Y + M + D + '00:00:00';
			},
			remove(index, row) { //删除一条记录
				this.$confirm(`确定删除${row.name}吗?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'error',
				}).then(() => {
					this.$axios({
							method: "post",
							url: '/books/delBooks',
							params: {
								"id": row.id //row返回的是一个对象
							}
						})
						.then(response => {
							var res = response.data;
							if (res.msg != null) {
								alert('该用户未拥有该权限')
							} else {
								if (res == true) {
									alert("删除成功");
									this.total--;
									this.list.splice(index, 1); //删除当前list对象
								} else {
									alert("删除失败");
								}
							}
						})
						.catch(error => {
							console.log(error);
						});
				});
			}
		}
	}
</script>

<style>
</style>
