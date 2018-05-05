<template>
	<div class="invariable-form-wrap">
		<el-form :inline="true" class="invariable" :model="live_invariableForm" label-width="150px" ref="live_invariableForm" :rules="rules">
			<el-form-item label="房产名称" class="toBeBlock">
				<span class="form_link_underLine" @click="goHouseView">{{live_invariableForm.houseFullName}}</span>
			</el-form-item>
			<el-form-item label="业主名称" class="toBeBlock">
				<span class="form_link_underLine" @click="goCusView2">{{live_invariableForm.newOwner_ownerName}}</span>
			</el-form-item>
			<el-form-item style="float:left" label="证件号码">
				<el-input size="small" disabled class="width200" v-model="live_invariableForm.newOwner_certificate"></el-input>
			</el-form-item>
			<el-form-item style="float:left" v-if="live_invariableForm.newOwner_ownerType =='0'" label="移动电话" prop="newOwner_mobile">
				<el-input size="small" disabled class="width200" readonly v-model="live_invariableForm.newOwner_mobile"></el-input>
			</el-form-item>
			<el-form-item style="float:left" v-else disabled label="联系电话" prop="newOwner_linkmanPhone" :label-width="secLabelWidth">
				<el-input size="small" readonly class="width200" v-model="live_invariableForm.newOwner_linkmanPhone"></el-input>
			</el-form-item>
		</el-form>
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
				secLabelWidth : "150px",
				live_invariableForm: {
					houseFullName: "",
					developer_ownerName: "",
					newOwner_ownerName: "",
					newOwner_certificate: "",
					newOwner_ownerType: "",
					newOwner_mobile: "",
					newOwner_linkmanPhone: "",
				},
				rules: {},
				stage: "",
				developer_ownerId:"",
				newOwner_ownerId:"",
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
				this.$emit('goCusView',this.newOwner_ownerId);
			},
			//获得有效的BindData
			getAvailableBindData() {
				const gp = this.gainObejectProperty;
				this.$set(this.live_invariableForm,'houseFullName',gp(this.bindData, '.fromOutsideData.houseFullName'))
				this.live_invariableForm.developer_ownerName = gp(this.bindData, '.fromModelData.developer.ownerName');
				this.live_invariableForm.newOwner_ownerName = gp(this.bindData, '.fromModelData.newOwner.ownerName');
				this.live_invariableForm.newOwner_mobile = gp(this.bindData, '.fromModelData.newOwner.mobile');
				this.live_invariableForm.newOwner_certificate = gp(this.bindData, '.fromModelData.newOwner.certificate');
				this.live_invariableForm.newOwner_ownerType = gp(this.bindData, '.fromModelData.newOwner.ownerType');
				this.live_invariableForm.newOwner_linkmanPhone = gp(this.bindData, '.fromModelData.newOwner.linkmanPhone');
				this.newOwner_ownerId = gp(this.bindData, '.fromModelData.newOwner.ownerId');


				this.developer_ownerId = gp(this.bindData, '.fromModelData.developer.ownerId');

				this.newPropertyOwnerList = gp(this.bindData, '.fromModelData.newPropertyOwnerList');

				this.stage = gp(this.bindData, '.fromOutsideData.stage');
				
				this.render = true
			},
			//提交数据混合
			assignSubmitData(){
				const gp = this.gainObejectProperty;
				this.bindData.fromModelData.houseId = gp(this.bindData, '.fromOutsideData.houseId');
			},
			//监听验证事件
			listenValidate(){
				let invValidate = false;
				this.$refs['live_invariableForm'].validate((valid) => {
					invValidate = valid
				});
				if(!invValidate){
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
				this.$refs['live_invariableForm'].validate((valid) => {
					if(valid) {
						alert('submit!');
					} else {
						alert('error');
						return false;
					}
				});
			},
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
