<template>
	<div class="invariable-form-wrap">
		<el-form :inline="true" class="invariable" :model="receiveHouse_invariableForm" label-width="150px" ref="receiveHouse_invariableForm" :rules="rules">
			<el-form-item label="房产名称" class="toBeBlock">
				<span class="form_link_underLine" @click="goHouseView">{{receiveHouse_invariableForm.houseFullName}}</span>
			</el-form-item>
			<el-form-item label="开发商" class="toBeBlock">
				<span class="form_link_underLine" @click="goCusView">{{receiveHouse_invariableForm.developer_ownerName}}</span>
			</el-form-item>
		</el-form>
		
		<!--新业主/新产权人搜索-->
		<ns-form-owner-select 
			v-if = "render"
			title="新业主" 
			isMainHoouseShow 
			isPropertyShow
			:selectItem = "bindData.selectItem"
			@update-returnData="updateReturnData" 
			@updateValidateFlag2 = "updateValidateFlag2"
			ref = "form-owner-select"
			:houseId = "bindData.fromOutsideData.houseId"
			:bindData = "bindData"
			:newPropertyOwnerList = "newPropertyOwnerList"
		></ns-form-owner-select>
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
		},
		data() {
			return {
				secLabelWidth : "244px",
				receiveHouse_invariableForm: {
					houseFullName: "",
					developer_ownerName: "",
					oldOwner_ownerName: "",
					oldOwner_certificate: "",
					oldOwner_ownerType: "",
					oldOwner_mobile: "",
					oldOwner_linkmanPhone: "",
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
				oldOwner_ownerId:"",
				newOwner:{},
				isMainHouse:"0",
				validateSwitch:{
					flag1:false,
					flag2:false,
				},
				//
				newPropertyOwnerList:{},
				seloRelateOptions:[],
				render:true
			}
		},
		methods: {
//			getPropertyNewOwner(info) {
//				this.newPropertyOwnerObj = info;
//			},
			updateValidateFlag2(valid){
				this.validateSwitch.flag2 = valid;
			},
			updateReturnData(returnData){
				this.newOwner = returnData.newOwner;
				this.isMainHouse = returnData.isMainHouse;
				this.newPropertyOwnerList = returnData.newPropertyOwnerList;
				console.log(returnData)
			},
			goHouseView(){
				this.$emit('goHouseView');
			},
			goCusView(){
				this.$emit('goCusView',this.developer_ownerId);
			},
			goCusView2(){
				this.$emit('goCusView',this.oldOwner_ownerId);
			},
			//获得有效的BindData
			getAvailableBindData() {
				const gp = this.gainObejectProperty;
				this.$set(this.receiveHouse_invariableForm,'houseFullName',gp(this.bindData, '.fromOutsideData.houseFullName'))
				this.receiveHouse_invariableForm.developer_ownerName = gp(this.bindData, '.fromModelData.developer.ownerName');
				this.receiveHouse_invariableForm.oldOwner_ownerName = gp(this.bindData, '.fromModelData.oldOwner.ownerName');
				this.receiveHouse_invariableForm.oldOwner_mobile = gp(this.bindData, '.fromModelData.oldOwner.mobile');
				this.receiveHouse_invariableForm.oldOwner_certificate = gp(this.bindData, '.fromModelData.oldOwner.certificate');
				this.receiveHouse_invariableForm.oldOwner_ownerType = gp(this.bindData, '.fromModelData.oldOwner.ownerType');
				this.receiveHouse_invariableForm.oldOwner_linkmanPhone = gp(this.bindData, '.fromModelData.oldOwner.linkmanPhone');
				this.oldOwner_ownerId = gp(this.bindData, '.fromModelData.oldOwner.ownerId');


				this.receiveHouse_invariableForm.oldCheckInDate = gp(this.bindData, '.fromModelData.oldCheckInDate');
				this.receiveHouse_invariableForm.applyDate = gp(this.bindData, '.fromModelData.applyDate');
				this.developer_ownerId = gp(this.bindData, '.fromModelData.developer.ownerId');
				
				this.newPropertyOwnerList = gp(this.bindData, '.fromModelData.newPropertyOwnerList');
				
				this.stage = gp(this.bindData, '.fromOutsideData.stage');
				
				this.render = true
			},
			//提交数据混合
			assignSubmitData(){
				this.bindData.fromModelData.houseId = this.bindData.fromOutsideData.houseId;
				this.bindData.fromModelData.houseName = this.bindData.fromOutsideData.houseName;
				if(!this.bindData.fromModelData.oldOwner){
					this.bindData.fromModelData.oldOwner = {};
				}
				this.bindData.fromModelData.oldOwner.mobile = this.receiveHouse_invariableForm.oldOwner_mobile;
				this.bindData.fromModelData.oldOwner.certificate = this.receiveHouse_invariableForm.oldOwner_certificate;
				this.bindData.fromModelData.newOwner = this.newOwner;
				this.bindData.fromModelData.newPropertyOwnerList = this.newPropertyOwnerList;
				this.bindData.fromModelData.isMainHouse = this.isMainHouse
				this.bindData.fromModelData.oldCheckInDate = this.receiveHouse_invariableForm.oldCheckInDate
				this.bindData.fromModelData.applyDate = this.receiveHouse_invariableForm.applyDate
			},
			//监听验证事件
			listenValidate(){
				let invValidate = false;
				this.$refs['receiveHouse_invariableForm'].validate((valid) => {
					invValidate = valid
				});
				let newOwnerValidate = this.$refs['form-owner-select'];
				let newOwnerValidate_= newOwnerValidate?newOwnerValidate.listenValidate():true;
				let propertyValidate1 = this.$refs['form-owner-select'].$refs['property-select1'];
				let propertyValidate1_ = propertyValidate1 ? propertyValidate1.listenValidate() : true;
				let propertyValidate2 = this.$refs['form-owner-select'].$refs['property-select2'];
				let propertyValidate2_ = propertyValidate2 ? propertyValidate2.listenValidate() : true;
				let propertyValidate3 = this.$refs['form-owner-select'].$refs['property-select3'];
				let propertyValidate3_ = propertyValidate3 ? propertyValidate3.listenValidate() : true;
				let propertyValidate4 = this.$refs['form-owner-select'].$refs['property-select4'];
				let propertyValidate4_ = propertyValidate4 ? propertyValidate4.listenValidate() : true;
				if(!invValidate||!newOwnerValidate_||!propertyValidate1_||!propertyValidate2_||!propertyValidate3_||!propertyValidate4_){
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
				this.$refs['receiveHouse_invariableForm'].validate((valid) => {
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
					this.$refs['receiveHouse_invariableForm'].resetFields();
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