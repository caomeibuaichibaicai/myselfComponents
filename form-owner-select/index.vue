<template>
	<el-form :inline="true" ref="ownerSelectForm" :model="ownerSelectForm" id="ownerSelect" class="invariable ownerSelect el-group-top-line" :rules="rules" label-width="150px">
		<el-form-item :label="title" prop="ownerName" :class="!isMainHoouseShow ? 'toBeBlock' : ''">
			<el-select v-model="ownerSelectForm.ownerName" filterable remote reserve-keyword placeholder="请输入关键词" :loading-text="searchTip" :remote-method="remoteMethod" :loading="loading" @change="handleSelect" clearable class="width200" size="small">
				<el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value" :info="item.info"></el-option>
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
		</el-form-item>

		<!--是否主房产-->
		<el-form-item v-if="isMainHoouseShow" label="是否主房产" prop="switchFlag" :label-width="secLabelWidth">
			<el-switch v-model="ownerSelectForm.switchFlag" active-value="1" inactive-value="0" @change="isMainHouseChange">
			</el-switch>
		</el-form-item>
		<!--证件号码-->
		<el-form-item label="证件号码" prop="certificate" style="float:left">
			<el-input class="width200" disabled readonly v-model="ownerSelectForm.certificate" size="small"></el-input>
		</el-form-item>
		<!--移动电话-->
		<el-form-item :label="phoneNumTit" prop="phoneNum" style="float:left" :label-width="secLabelWidth">
			<el-input class="width200" disabled readonly v-model="ownerSelectForm.phoneNum" size="small"></el-input>
		</el-form-item>

		<template v-if="isPropertyShow">
			<property-select1 ref="property-select1" :selectItem="selectItem" :houseId="houseId" :propertyBind="propertyBind[0]" @update-returnData="updatePropertyData(0,$event)" @deletePr="deletePrClick(0)" v-if="newProShow[0]"></property-select1>
			<property-select2 ref="property-select2" :selectItem="selectItem" :houseId="houseId" :propertyBind="propertyBind[1]" @update-returnData="updatePropertyData(1,$event)" @deletePr="deletePrClick(1)" v-if="newProShow[1]"></property-select2>
			<property-select3 ref="property-select3" :selectItem="selectItem" :houseId="houseId" :propertyBind="propertyBind[2]" @update-returnData="updatePropertyData(2,$event)" @deletePr="deletePrClick(2)" v-if="newProShow[2]"></property-select3>
			<property-select4 ref="property-select4" :selectItem="selectItem" :houseId="houseId" :propertyBind="propertyBind[3]" @update-returnData="updatePropertyData(3,$event)" @deletePr="deletePrClick(3)" v-if="newProShow[3]"></property-select4>
		</template>

		<!--新增共有产权人-->
		<el-form-item v-if="isPropertyShow" class="toBeBlock addBtnItem" :label-width="secLabelWidth">
			<el-button type="default" size="small" class="addBtn" @click.native="addPrClick">新增共有产权人</el-button>
		</el-form-item>

		<!--新增个人企业客户-->
		<ns-dialog top="7%" :title="dialogTit" width="900px" :visible.sync="dialogVisible" :modal="true">
			<ns-auto-form autoFormID="personalOwner" :request-url="requestUrl" :cover-data="addOwnerCover" cue-type="only-error" @afterRequest="afterRequest_personal">
			</ns-auto-form>
			<ns-auto-form autoFormID="companyOwner" :request-url="requestUrl" :cover-data="addOwnerCover" cue-type="only-error" @afterRequest="afterRequest_company">
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
	import propertySelect1 from './property-owner-select/index1.vue'
	import propertySelect2 from './property-owner-select/index2.vue'
	import propertySelect3 from './property-owner-select/index3.vue'
	import propertySelect4 from './property-owner-select/index4.vue'

	export default {
		components: {
			propertySelect1,
			propertySelect2,
			propertySelect3,
			propertySelect4
		},
		name: "ownerSelect",
		props: {
			isMainHoouseShow: {
				type: Boolean,
				default: false
			},
			isPropertyShow: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: '标题'
			},
			houseId: {
				require: true
			},
			selectItem: {
				require: true
			},
			bindData: {
				require: true
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
				propertyBind: [],
				newProShow: [false, false, false, false],
				selectItemObj: [],
				secLabelWidth: "150px",
				dialogTit: '新增个人客户', //dialog-title
				dialogVisible: {
					visible: false
				},
				//新增个人/ 企业 - dialog-visible
				ownerSelectForm: {
					ownerName: '',
					phoneNum: '',
					certificate: '',
					switchFlag: "0",
				},
				rules: {
					ownerName: [{
						required: true,
						message: '请选择' + this.title,
						trigger: 'change'
					}],
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
				newOwner: {},
				returnData: {
					newOwner: {},
					isMainHouse: "",
					newPropertyOwnerList: []
				},
				newPropertyOwnerList: [],
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
		watch: {
			ownerType(nval) {

			}
		},
		methods: {
			deletePrClick(i) {
				this.$set(this.newProShow, i, false)
				this.newPropertyOwnerList.splice(i, 1);
			},
			addPrClick() {
				for(let i = 0; i < 4; i++) {
					if(!this.newProShow[i]) {
						this.$set(this.newProShow, i, true)
						break
					}
				}
				console.log(this.newProShow)
			},
			//新增完客户直接赋值
			afterAddSuccess(params) {
				this.remoteMethod(params.formData.modelData.ownerName, (val) => {
					this.ownerSelectForm.ownerName = val.ownerName;
					this.ownerSelectForm.switchFlag = '0'
					this.isMainHouse = '0';
					this.ownerAssign(val)
					this.updateReturnData();
					this.$emit('update-returnData', this.returnData)
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
			//更新产权人信息
			updatePropertyData(i, returnData) {
				this.newPropertyOwnerList[i] = returnData;
				this.updateReturnData()
			},
			//更新业主选择返回信息
			updateReturnData() {
				this.returnData.newOwner = this.newOwner;
				this.returnData.isMainHouse = this.isMainHouse;
				this.returnData.newPropertyOwnerList = this.newPropertyOwnerList;
			},
			//是否主房产切换回调
			isMainHouseChange(val) {
				this.isMainHouse = val;
				this.updateReturnData();
				this.$emit('update-returnData', this.returnData)
			},
			ownerAssign(val) {
				this.mobile = val.mobile;
				this.linkmanPhone = val.linkmanPhone;
				this.ownerType = val.ownerType;
				this.ownerSelectForm.certificate = val.certificate;
				if(this.ownerType == 0) {
					this.phoneNumTit = '移动电话'
					this.ownerSelectForm.phoneNum = this.mobile;
				} else {
					this.phoneNumTit = '联系电话'
					this.ownerSelectForm.phoneNum = this.linkmanPhone
				}
				this.newOwner = val;
			},
			//选择人员回调
			handleSelect(item) {
				for(let i = 0, val; val = this.list[i]; i++) {
					if(val.value === item) {
						this.ownerAssign(val.info)
						break;
					} else {
						this.mobile = '';
						this.linkmanPhone = '';
						this.ownerType = 1;
						this.ownerSelectForm.certificate = '';
						this.ownerSelectForm.phoneNum = "";
						this.newOwner = {};
					}
				};
				this.updateReturnData();
				this.$emit('update-returnData', this.returnData)
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
			assignBindData() {
				if(this.bindData.fromModelData.newOwner) {
					this.ownerSelectForm.ownerName = this.bindData.fromModelData.newOwner.ownerName;
					this.ownerSelectForm.switchFlag = this.bindData.fromModelData.isMainHouse.toString();
					this.isMainHouse = this.bindData.fromModelData.isMainHouse.toString();
					this.newPropertyOwnerList = this.bindData.fromModelData.newPropertyOwnerList;

					this.ownerAssign(this.bindData.fromModelData.newOwner)
					this.updateReturnData();
					this.$emit('update-returnData', this.returnData)
				}
				//产权人赋值
				let newPropertyOwnerList = this.bindData.fromModelData.newPropertyOwnerList;
				if(newPropertyOwnerList && newPropertyOwnerList.length > 0) {
					for(let i = 0; i < newPropertyOwnerList.length; i++) {
						this.$set(this.newProShow, i, true);
						this.propertyBind = newPropertyOwnerList;
					};

				}
			},
			//模糊查询
			remoteMethod(query, defBack) {
				if(query != '' && query != ' ') {
					this.loading = true;
					fetchListData({
						customerName: query,
						isDeveloper: this.isDeveloper
					}).then((r) => {
						this.loading = false;
						this.list = this.listHandle(r.resultData);
						if(defBack) {
							defBack(r.resultData[0])
						}
					}).catch((err) => {
						this.searchTip = "服务器出错";
					});
				} else {
					this.list = [];
				}
			},
			//监听验证事件
			listenValidate() {
				//新业主信息可编辑-暂时不需要
				// this.returnData.newOwner.certificate = this.ownerSelectForm.certificate;
				// if(this.ownerType == 0) {
				// 	this.returnData.newOwner.mobile = this.ownerSelectForm.phoneNum;
				// } else {
				// 	this.returnData.newOwner.linkmanPhone = this.ownerSelectForm.phoneNum;
				// }
				// this.updateReturnData();
				// this.$emit('update-returnData', this.returnData)
				let $vali = false;
				this.$refs['ownerSelectForm'].validate((valid) => {
					$vali = valid
				})
				return $vali
			},
			lsitResetForm() {
				EventHub.$on('invariableFormReset', () => {
					this.resetForm()
				})
			},
			//自动表单提交与取消--操作
			autoFormSubmit(formName) {
				this.autoForm.validate(formName).then(
					params => { //submit request
						this.autoForm.submit(this.submitUrl, params.formData.modelData, () => {
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
		},
		created() {
			//存储当前页面的vue实例
      		store.vm.set('ownerSelect', this);
		},
		mounted() {
			this.assignBindData()
			this.lsitResetForm();
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss">
	@import "../../../assets/css/Modular/invariable-form/invariable-form.scss";
	#ownerSelect {
		.el-input {
			width: 200px;
		}
		.el-form-item {
			margin-right: 0px;
		}
		.el-dropdown {
			margin-left: 10px;
		}
		.width200 .el-input {
			width: 200px;
		}
		.addBtnItem>.el-form-item__content {
			float: right;
			margin-right: 132px;
		}
		.ns-autoForm-content {
			max-height: auto!important;
		}
		.el-dialog__body {
			height: auto!important;
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
