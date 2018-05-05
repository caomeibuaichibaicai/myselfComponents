<template>
	<div class="invariable-form-wrap">
		<el-form :inline="true" class="invariable" :model="lease_invariableForm" label-width="150px" ref="lease_invariableForm" :rules="rules">
			<el-form-item label="房产名称" class="toBeBlock">
				<span class="form_link_underLine" @click="goHouseView">{{lease_invariableForm.houseFullName}}</span>
			</el-form-item>
			<el-form-item label="业主" class="toBeBlock">
				<span class="form_link_underLine" @click="goCusView(newOwner.ownerId)">{{newOwner.ownerName}}</span>
			</el-form-item>
			<div class="el-group-top-line" v-if="isOldRentShow">
				<el-form-item label="原租户" class="toBeBlock">
					<span class="form_link_underLine" @click="goCusView(oldRentOwner_ownerId)">{{lease_invariableForm.oldRentOwner_ownerName}}</span>
				</el-form-item>
				<el-form-item style="float:left" label="证件号码">
					<el-input size="small"  disabled class="width200" v-model="lease_invariableForm.oldRentOwner_certificate"></el-input>
				</el-form-item>
				<el-form-item style="float:left" v-if="lease_invariableForm.oldRentOwner_ownerType =='0'" label="移动电话" prop="oldRentOwner_mobile">
					<el-input size="small" class="width200" readonly disabled v-model="lease_invariableForm.oldRentOwner_mobile"></el-input>
				</el-form-item>
				<el-form-item style="float:left" v-else label="联系电话" prop="oldRentOwner_linkmanPhone" :label-width="secLabelWidth">
					<el-input size="small" readonly disabled class="width200" v-model="lease_invariableForm.oldRentOwner_linkmanPhone"></el-input>
				</el-form-item>
				<el-form-item label="退租日期 " prop="applyDate">
					<el-date-picker class="width200" size="small" value-format = "yyyy-MM-dd 00:00:00" v-model="lease_invariableForm.applyDate" type="date" placeholder="选择日期 ">
					</el-date-picker>
				</el-form-item>
			</div>
		</el-form>	
		<!--新业主/新产权人搜索-->
		<ns-form-rentowner-select 
			v-if = "isNewRentShow"
			title="新租户" 
			@update-returnData="updateReturnData" 
			@updateValidateFlag2 = "updateValidateFlag2"
			ref = "form-owner-select"
			:houseId = "bindData.fromOutsideData.houseId"
			:bindData = "bindData"
		></ns-form-rentowner-select>
	</div>
</template>
<script>
	import EventHub from '@/utils/eventHub/eventHub'

	export default {
		name: "salesHouseinvariableForm",
		props: {
			bindData: {
				type: Object,
				require: true
			},
			isOldRentShow:{
				require: true
			},
			isNewRentShow:{
				default:true
			}
		},
		data() {
			return {
				secLabelWidth : "150px",
				lease_invariableForm: {
					houseFullName: "",
					newRentOwner_ownerName:"",
					developer_ownerName: "",
					oldRentOwner_ownerName: "",
					oldRentOwner_certificate: "",
					oldRentOwner_mobile: "",
					oldRentOwner_linkmanPhone: "",
					
					oldRentOwner_ownerName: "",
					oldRentOwner_certificate: "",
					oldRentOwner_ownerType: "",
					oldRentOwner_mobile: "",
					oldRentOwner_linkmanPhone: "",
					oldCheckInDate: "",
					applyDate: "",
				},
				rules: {
					oldCheckInDate: [{
						required: true,
						message: '请选择入住日期',
						trigger: 'blur'
					}],
					applyDate: [{
						required: true,
						message: '请选择搬离日期',
						trigger: 'blur'
					}],
				},
				stage: "",
				developer_ownerId:"",
				oldRentOwner_ownerId:"",
				newRentOwner:{},
				newRentOwner:{},
				isMainHouse:"false",
				validateSwitch:{
					flag1:false,
					flag2:false,
				},
				newOwner:{},
				//
				newPropertyOwnerObj:{},
				seloRelateOptions:[],
			}
		},
		methods: {
			getPropertyNewOwner(info) {
				this.newPropertyOwnerObj = info;
			},
			updateValidateFlag2(valid){
				this.validateSwitch.flag2 = valid;
			},
			updateReturnData(returnData){
				this.newRentOwner = returnData.newRentOwner;
			},
			goHouseView(){
				this.$emit('goHouseView');
			},
			goCusView(ownerId){
				this.$emit('goCusView',ownerId);
				// this.$emit('goCusView',this.developer_ownerId);
			},
			goCusView2(){
				this.$emit('goCusView',this.oldRentOwner_ownerId);
			},
			//获得有效的BindData
			getAvailableBindData() {
				const gp = this.gainObejectProperty;
				this.lease_invariableForm.houseFullName = gp(this.bindData, '.fromOutsideData.houseFullName');
				this.lease_invariableForm.developer_ownerName = gp(this.bindData, '.fromModelData.developer.ownerName');
				this.lease_invariableForm.newRentOwner_ownerName = gp(this.bindData, '.fromModelData.newRentOwner.ownerName');
				this.lease_invariableForm.oldRentOwner_ownerName = gp(this.bindData, '.fromModelData.oldRentOwner.ownerName');
				this.lease_invariableForm.oldRentOwner_certificate = gp(this.bindData, '.fromModelData.oldRentOwner.certificate');
				this.lease_invariableForm.oldRentOwner_mobile = gp(this.bindData, '.fromModelData.oldRentOwner.mobile');
				this.lease_invariableForm.oldRentOwner_linkmanPhone = gp(this.bindData, '.fromModelData.oldRentOwner.linkmanPhone');

				this.lease_invariableForm.oldRentOwner_ownerName = gp(this.bindData, '.fromModelData.oldRentOwner.ownerName');
				this.lease_invariableForm.oldRentOwner_mobile = gp(this.bindData, '.fromModelData.oldRentOwner.mobile');
				this.lease_invariableForm.oldRentOwner_certificate = gp(this.bindData, '.fromModelData.oldRentOwner.certificate');
				this.lease_invariableForm.oldRentOwner_ownerType = gp(this.bindData, '.fromModelData.oldRentOwner.ownerType');
				this.lease_invariableForm.oldRentOwner_linkmanPhone = gp(this.bindData, '.fromModelData.oldRentOwner.linkmanPhone');
				this.oldRentOwner_ownerId = gp(this.bindData, '.fromModelData.oldRentOwner.ownerId');
				this.newOwner = gp(this.bindData, '.fromModelData.newOwner');

				this.lease_invariableForm.oldCheckInDate = gp(this.bindData, '.fromModelData.oldCheckInDate');
				this.lease_invariableForm.applyDate = gp(this.bindData, '.fromModelData.applyDate');
				this.developer_ownerId = gp(this.bindData, '.fromModelData.developer.ownerId');
				this.stage = gp(this.bindData, '.fromOutsideData.stage');
			},
			//提交数据混合
			assignSubmitData(){
				this.bindData.fromModelData.houseId = this.bindData.fromOutsideData.houseId;
				this.bindData.fromModelData.houseName = this.bindData.fromOutsideData.houseName;
				if(!this.bindData.fromModelData.oldRentOwner){
					this.bindData.fromModelData.oldRentOwner = {};
				}
				this.bindData.fromModelData.oldRentOwner.mobile = this.lease_invariableForm.oldRentOwner_mobile;
				this.bindData.fromModelData.oldRentOwner.certificate = this.lease_invariableForm.oldRentOwner_mobile;
				this.bindData.fromModelData.newRentOwner = this.newRentOwner;
				this.bindData.fromModelData.applyDate = this.lease_invariableForm.applyDate
			},
			//监听BindData
			listenBindData() {
				EventHub.$on('invariableFormDataListen', () => {
					this.getAvailableBindData();
				});
			},
			//监听验证事件
			listenValidate(){
				let invValidate = false;
				this.$refs['lease_invariableForm'].validate((valid) => {
					invValidate = valid
				});
				let newRentOwnerValidate = this.$refs['form-owner-select'];
				let newRentOwnerValidate_= newRentOwnerValidate?newRentOwnerValidate.listenValidate():true;
				if(!invValidate||!newRentOwnerValidate_){
					return false
				}
				return true
			},
			listenBackData(){
				EventHub.$on('invariableFormBackDataListen',()=>{
					this.assignSubmitData()	
				})
			},
			submitForm(formName) {
				this.$refs['lease_invariableForm'].validate((valid) => {
					if(valid) {
						alert('submit!');
					} else {
						alert('error');
						return false;
					}
				});
			},
			lsitResetForm() {
				EventHub.$on('invariableFormReset',()=>{
					this.$refs['lease_invariableForm'].resetFields();
				})
			}
		},
		created() {
			this.getAvailableBindData();
			this.listenBackData();
		}
	}
</script>

<style rel="stylesheet/less" lang="scss">
	@import "../../../../assets/css/Modular/invariable-form/invariable-form.scss";
</style>