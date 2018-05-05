<template>
	<ns-form :inline="2" ref="addValidateForm" :model="addValidateForm" label-width="100px">
		<ns-form-item label="新业主">
			<el-select v-model="value9" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
				<el-option v-for="item in options4" :key="item.ownerId" :label="item.ownerId" :value="item.ownerId">
				</el-option>
			</el-select>

			<ns-button @click="show" icon="el-icon-search">新增</ns-button>
		</ns-form-item>
		
		<ns-form-item label="开发商">
								<el-select v-model="value9" :clearable="true" filterable remote placeholder="请输入开发商" :remote-method="developerMethod" :loading="developerloading">
									<el-option v-for="item in developerOptions" :key="item.ownerId" :label="item.ownerName" :value="item.ownerId">
									</el-option>
								</el-select>
		</ns-form-item> 

		<ns-form-item label="" prop="check">
			<el-radio v-model="decorateStage" label="0">男</el-radio>
			<el-radio v-model="decorateStage" label="1">女</el-radio>
		</ns-form-item>

		<ns-form-item label="证件号码">
			<ns-input v-model="input" placeholder="请输入内容"></ns-input>
		</ns-form-item>

		<ns-form-item label="移动电话">
			<ns-input v-model="input" placeholder="请输入内容"></ns-input>
		</ns-form-item>

	</ns-form>

</template>
<script>
	import { treeDataFetch, treeDrag, treeOpen, getInputData, changeData, treeDelete, getForm, handleForm, detailForm, getDeveloper } from '../../../api/house-tree'
	export default {
		data() {
			return {
               developerOptions: [],
				treeloading: true,
				developerloading: false,
				loading: false,
				decorateStage: '0',
				inp: "",
				options4: [],
				value9: [],
				list: [],
				loading: false,
				

			}
		},
		mounted() {
			this.list = this.states.map(item => {
				return {
					value: item.ownerId,
					label: item.ownerId
				};
			});

		},

		methods: {
			developerMethod(query) { 
				const _this = this;
				if(_this.isEdit) {
					_this.isEdit = false;
					return false;
				} else {
					if(query !== '') {
						_this.developerloading = true;
						getDeveloper({
							customerName: query 
						}).then(function(r) {
							_this.developerloading = false;
							_this.developerOptions = r.resultData;
						})
					} else {
						_this.developerOptions = [];
					}
				}
			},
			show() {
				const h = this.$createElement;
				this.$msgbox({
					title: '消息',
					message: h('p', null, [
						h('button', {
							style: 'margin-left: 100px'
						}, '个人 '),
						h('button', {
							style: 'text-align: center'
						}, '企业')
					]),

					confirmButtonText: '取消',

				})

			},
			
			//模糊查询
			remoteMethod(query) {
				if(query !== '') {
					this.loading = true;
					setTimeout(() => {
						this.loading = false;
						this.options4 = this.list.filter(item => {
							return item.label.toLowerCase()
								.indexOf(query.toLowerCase()) > -1;
						});
					}, 200);
				} else {
					this.options4 = [];
				}
			}
		}
	}
</script>

<style scoped="scoped">

</style>