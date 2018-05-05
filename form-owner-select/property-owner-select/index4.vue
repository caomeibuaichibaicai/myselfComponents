<template>
	<el-form :inline="true" ref="propertySelectForm4" :model="propertySelectForm4" id="propertySelectForm4" class="invariable propertySelectForm4 el-group-top-line" :rules="rules" label-width="150px">
		<el-form-item label="产权人5" prop="ownerName">
			<el-select v-model="propertySelectForm4.ownerName" filterable remote
				reserve-keyword
				placeholder="请输入关键词"
				:loading-text="searchTip"
				:remote-method="remoteMethod"
				:loading="loading"
				@change="handleSelect"
				clearable class="width200" size="small">
				<el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value" :info="item.info">
				</el-option>
			</el-select>
			<!--新增-->
			<el-dropdown size="medium" trigger="click" @command="ownerCommand">
				<el-button size="medium">
					新增
				</el-button>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command="person">个人</el-dropdown-item>
					<el-dropdown-item command="company">企业</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<el-button type="default" size="medium" @click="deletePr">删除</el-button>
		</el-form-item>

		<!--与业主关系-->
		<el-form-item label="与业主关系" prop="ownerRelationship" class="width100">
			<el-select v-model="propertySelectForm4.ownerRelationship" size="small" @change="ownerRelationChange" placeholder="请选择关系">
				<el-option v-for="item in selectItem" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</el-form-item>
		<!--证件号码-->
		<el-form-item label="证件号码" style="float:left">
			<el-input class="width200" disabled readonly v-model="propertySelectForm4.certificate" placeholder="请输入内容" size="small"></el-input>
		</el-form-item>
		<!--移动电话-->
		<el-form-item :label="phoneNumTit" style="float:left">
			<el-input class="width200" disabled readonly v-model="propertySelectForm4.phoneNum" placeholder="请输入内容" size="small"></el-input>
		</el-form-item>

		<!--新增个人企业客户-->
		<ns-dialog width="900px" :title="dialogTit" :visible.sync="dialogVisible" :modal="true">
			<ns-auto-form
				autoFormID="personalOwner"
				request-url="/owner/customer/init-form"
				submit-url="/owner/customer/add-customer"
				:query="{}"
				:cover-data="addOwnerCover"
				cue-type="only-error"
				@afterRequest="afterRequest_personal"
			>
			</ns-auto-form>
			<ns-auto-form
				autoFormID="companyOwner"
				request-url="/owner/customer/init-form"
				submit-url="/owner/customer/add-customer"
				:query="{}" 
				:cover-data="addOwnerCover"
				cue-type="only-error"
				@afterRequest="afterRequest_company"
			>
			</ns-auto-form>
			<div slot="footer">
				<ns-auto-form-operation :buttonInfo="buttonInfo" :autoFormID="ownerAutoFormID"></ns-auto-form-operation>
			</div>
		</ns-dialog>
	</el-form>
</template>

<script>
	import { fetchListData } from '@/api/ownerSelect';
	import EventHub from '@/utils/eventHub/eventHub.js'
	import * as store from '@/utils/nsQuery/nsStore'

	export default {
		props:{
			selectItem:{
				require:true
			},
			propertyBind:{
				default(){
					return{}
				}
			},
			houseId:{
				require:true
			},
		},
		data() {
			return {
				ownerAutoFormID: "",
				buttonInfo: [{
						funcType: 'submit',
						style: 'primary',
						code: 'formConfirmBtn',
						name: '确定',
						areaType: 'FORM',
						btnType: 'single',
						event: this.autoFormSubmit
					},
					{
						funcType: 'custom',
						style: '',
						code: 'formCancelBtn',
						name: '取消',
						areaType: 'FORM',
						btnType: 'single',
						event: this.autoFormCancel
					},
				],
				requestUrl: "/owner/customer/init-form",
				submitUrl: "/owner/customer/add-customer",
				propertySelectForm4: {
					ownerName: '',
					phoneNum: '',
					certificate: '',
					ownerRelationship:"",
				},
				rules: {
					ownerName: [{
						required: true,
						message: '请选择产权人',
						trigger: 'change'
					}],
					ownerRelationship:[{
						required: true,
						message: '请选择与业主关系',
						trigger: 'change'
					}],
				},
				searchTip: '搜索数据中...',
				selectItemObj: [],
				secLabelWidth: "244px",
				dialogTit: '新增个人客户', //dialog-title
				dialogVisible: {
					visible: false
				},
				isDeveloper: 0,
				loading: false,
				mobile: '',
				ownerType: 1,
				linkmanPhone: '',
				isMainHouse: "0",
				searchTip: '搜索数据中...',
				list: [],
				phoneNumTit: '联系电话',
				newProperty: {},
				ownerRelationship:"",
				//新增客户管理 cover-data
				addOwnerCover: {
					//表头
					tableHead: {
						mainHouseList: null
					},
					//绑定事件
					resourcefieldBindingfnList: {
						ownerType: function(params) {
							const webVm = store.vm.get('ownerSelect');
							if(params.type === 'change' && params.type !== 'visibleChange') {
								if(params.formData.modelData[params.modelKey] === '0') {
									store.formController.delete('companyOwner');
									store.formController.set('personalOwner', {
										interpreter: "0",
										show: true
									});
									webVm.ownerAutoFormID = 'personalOwner'; //设置 - 按钮对应表单ID值
									webVm.dialogTit = '新增个人客户';
								}
								if(params.formData.modelData[params.modelKey] === '1') {
									store.formController.delete('personalOwner');
									store.formController.set('companyOwner', {
										interpreter: "1",
										show: true
									});
									webVm.ownerAutoFormID = 'companyOwner'; //设置 - 按钮对应表单ID值
									params.vm.$set(params.vm.coverData.tableHead, 'mainHouseList', 'enterpriseManage');
									webVm.dialogTit = '新增企业客户';
								}
							}
						}
					},
				},
			}
		},
		methods: {
			//与业主关系选择回调
			ownerRelationChange(val) {
				this.propertySelectForm4.ownerRelationship = val;
				this.newProperty.ownerRelationship = val;
				this.$emit('update-returnData', this.newProperty)
			},
			ownerCommand(val) {
				if(val === 'person') {
					this.ownerAutoFormID = "personalOwner"
					//销毁 企业'companyOwner' 表单
					store.formController.delete('companyOwner');
					//注册 个人'personalOwner' 表单
					store.formController.set('personalOwner', {
						interpreter: "0",
						formOperateType: null,
						show: true
					});
					//改变弹窗title
					this.dialogTit = '新增个人客户';
				}
				if(val === 'company') {
					this.ownerAutoFormID = "companyOwner"
					//销毁 个人'personalOwner' 表单
					store.formController.delete('personalOwner');
					//注册 企业'companyOwner' 表单
					store.formController.set('companyOwner', {
						interpreter: "1",
						formOperateType: null,
						show: true
					});
					//change tableHead for enterpriseManage-form
					this.$set(this.addOwnerCover.tableHead, 'mainHouseList', 'enterpriseManage');
					//改变弹窗title
					this.dialogTit = '新增企业客户';
				}
				//打开 dialogVisible 的弹窗
				this.$set(this.dialogVisible, 'visible', true);
			},
			assignPropertyData(val){
				this.mobile = val.mobile;
				this.linkmanPhone = val.linkmanPhone;
				this.ownerType = val.ownerType;
				this.propertySelectForm4.certificate = val.certificate;
				if(this.ownerType == 0) {
					this.phoneNumTit = '移动电话'
					this.propertySelectForm4.phoneNum = this.mobile;
				} else {
					this.phoneNumTit = '联系电话'
					this.propertySelectForm4.phoneNum = this.linkmanPhone
				}
				this.newProperty = val;
			},
			//选择人员回调
			handleSelect(item) {
				for(let i = 0, val; val = this.list[i]; i++) {
					if(val.value === item) {
						this.assignPropertyData(val.info)
						break;
					} else {
						this.mobile = '';
						this.linkmanPhone = '';
						this.ownerType = 1;
						this.propertySelectForm4.certificate = '';
						this.propertySelectForm4.phoneNum = "";
						this.newProperty = {};
					}
				};
				this.$emit('update-returnData', this.newProperty)
			},
			listHandle(data) {
				return data.map((value, index, array) => {
					return {
						label: value.ownerName,
						value: value.ownerId,
						info: value
					}
				});
			},
			//模糊查询
			remoteMethod(query,defBack) {
				if(query != '' && query != ' ') {
					this.loading = true;
					fetchListData({
						customerName: query,
						isDeveloper: this.isDeveloper
					}).then((r) => {
						this.loading = false;
						this.list = this.listHandle(r.resultData);
						if(defBack){
							defBack(r.resultData[0])
						}
					}).catch((err) => {
						this.searchTip = "服务器出错";
					})
				} else {
					this.list = [];
				}
			},
			deletePr(){
				this.$emit('deletePr')
			},
			//监听验证事件
			listenValidate() {
				let $vali = false;
				this.$refs['propertySelectForm4'].validate((valid) => {
					$vali = valid
				})
				return $vali
			},
			lsitResetForm() {
				EventHub.$on('invariableFormReset', () => {
					this.$refs['propertySelectForm4'].resetFields();
				})
			},
			//新增完客户直接赋值
			afterAddSuccess(params){
				this.remoteMethod(params.formData.modelData.ownerName,(val)=>{
					this.newProperty.ownerRelationship = '';
					this.ownerRelationship = '';
					this.propertySelectForm4.ownerRelationship = '';
					this.propertySelectForm4.ownerName = val.ownerName;
					this.assignPropertyData(val);
				})
			},
			afterRequest_personal(vm, data) {
				data.modelData.ownerType = '0';
				data.modelData.precinctId = this.houseId;
			},
			afterRequest_company(vm, data) {
				data.modelData.ownerType = '1';
				data.modelData.precinctId = this.houseId;
			},
			//自动表单提交与取消--操作
			autoFormSubmit(formName) {
				this.autoForm.validate(formName).then(
					params => { //submit request
						this.autoForm.submit(this.submitUrl, params.formData.modelData, () => {
							this.afterAddSuccess(params)
							this.$set(this.dialogVisible, 'visible', false); //dialog-close
							this.$message({
								message: '保存成功',
								type: 'success'
							});
							this.afterAddSuccess(params)
							store.formController.set(params.formName, {
								show: false
							});
							//清空
							params.vm.elResetForm(params.formName);
						})
					}
				).catch((err) => {

				})
			},
			autoFormCancel(formName) {
				this.autoForm.resetForm(formName).then(
					params => {
						this.dialogVisible.visible = false;
						store.formController.delete(params.formName);
					}
				)
			},
			assignData(){
				if(this.propertyBind){
					this.newProperty.ownerRelationship = this.propertyBind.ownerRelationship;
					this.ownerRelationship = this.propertyBind.ownerRelationship;
					this.propertySelectForm4.ownerRelationship = this.propertyBind.ownerRelationship;
					this.propertySelectForm4.ownerName = this.propertyBind.ownerName;
					this.assignPropertyData(this.propertyBind);
				}
			},
			resetForm(){
				this.$refs['propertySelectForm4'].resetFields();
			}
		},
		created(){
			//存储当前页面的vue实例
      		store.vm.set('ownerSelect', this);
		},
		mounted(){
			this.resetForm()
			this.assignData();
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss">
	@import "../../../../assets/css/Modular/invariable-form/invariable-form.scss";
	#propertySelectForm4 {
		.el-input {
			width: 200px;
		}
		.el-form-item {
			margin-right: 0px;
		}
		.el-dropdown {
			margin-left: 10px;
		}
		.el-button-group .el-button:first-child {
			border-right: 1px solid #ccc;
			margin-right: 0px;
		}
		.width200 .el-input {
			width: 200px;
		}
		.addBtn.el-button--small {
			height: 30px;
		}
		.addBtnItem>.el-form-item__content {
			float: right;
			margin-right: 78px;
		}
		.width100{
			width: 100%;
		}
	}

	.ownerSelect_dropdown {
		min-width: 80px;
		text-align: center;
		padding: 0;
		.el-dropdown-menu__item {
			display: block;
		}
	}
</style>
