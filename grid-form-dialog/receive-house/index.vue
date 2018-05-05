<template>
    <div class="grid-form-dialog">
        <ns-dialog 
        class="grid-form-dialog" 
        :title="dialogTit" 
        width="900px" 
        :visible.sync="dialogVisible" 
        @close="dialogClose"  
        v-loading="subLoading" 
        element-loading-text="正在提交">
					<ns-tabs type="arrow" :activeName="tab_active" :v-model="tab_active" @tabClick="tab_handleClick">
						<ns-tab-Pane label="业主登记" name='1'>
							<!--固定表单-->
							<ns-invariable-form
								ref = "receiveInvariableForm"
								v-if = "invariableBindData.visible"
								:bindData = "invariableBindData"
								@goHouseView = "goHouseView"
								@goCusView = "goCusView"
								@updateValidateResult = "updateValidateResult"
								@updateBackData = "updateBackData"
							>
							</ns-invariable-form>
							<ns-auto-form
								autoFormID="addReceiveForm"
								:request-url="requestUrl"
								:query="{houseId: bindNodeObj.houseId,detailId:bindNodeObj.detailId,houseOperateType:houseOperateType,isEdit:isEdit}"
								:cover-data="coverData"
								cue-type="only-error"
								@afterRequest="afterRequest"
							>
							</ns-auto-form>
						</ns-tab-Pane>
						<ns-tab-Pane label="仪表抄表" name='2'>仪表抄表</ns-tab-Pane>
						<ns-tab-Pane label="收费对象" name='3'>收费对象</ns-tab-Pane>
						<ns-tab-Pane label="应用收费" name='4'>应用收费</ns-tab-Pane>
						<ns-tab-Pane label="预付款" name='5'>预付款</ns-tab-Pane>
					</ns-tabs>
					<!--按钮-->
          <div slot="footer">
            <ns-auto-form-operation :buttonInfo="buttonInfo" autoFormID="addReceiveForm"></ns-auto-form-operation>
          </div>
				</ns-dialog>
        <house-view :viserble="houseDetailVisible" v-if="houseDetailVisible.visible" :houseId="bindNodeObj.houseId"></house-view>
        <customer-view :viserble="ownerDetailVisible" v-if="ownerDetailVisible.visible" :ownerId="ownerDetailVisible.ownerId"></customer-view>
    </div>
</template>
<script>
import * as store from "@/utils/nsQuery/nsStore";
import EventHub from "@/utils/eventHub/eventHub.js";
import nsInvariableForm from "./invariable-form";
import houseView from "@/views/owner/house-information/house-view.vue";
import customerView from "@/views/owner/customer-information/customer-view.vue";

export default {
  name: "salesList",
  components: {
    nsInvariableForm,
    houseView,
    customerView
  },
  props: {
    dialogVisible: {
      type: Object,
      default() {
        return {
          visible: false
        };
      }
    },
    bindNodeObj: {
      type: Object
    },
    gridFormType: {
      type: String
    }
  },
  data() {
    return {
      houseOperateType: "",
      isEdit: "0", //0-add,1-edit
      coverData: {},
      requestUrl: "/owner/houseOperate/init-form",
      submitUrl: "",
      submitUrl_add: "/owner/houseOperate/house-operate-add-take",
      submitUrl_edit: "/owner/houseOperate/house-operate-edit-house-stage",
      dialogTit: "",
      subLoading: false,
      tab_active: "1",
      buttonInfo: [],
      buttonInfo1: [
        {
          funcType: "custom",
          style: "",
          code: "formCancelBtn",
          name: "取消",
          areaType: "FORM",
          btnType: "single",
          event: this.cancelHandle
        }
      ],
      buttonInfo2: [
        {
          style: "primary",
          name: "下一步",
          event: "nextClick",
          coerciveShow: true,
          event: this.nextClick
        },
        {
          funcType: "custom",
          style: "",
          code: "formCancelBtn",
          name: "取消",
          areaType: "FORM",
          btnType: "single",
          event: this.cancelHandle
        }
      ],
      buttonInfo3: [
        {
          funcType: "submit",
          style: "primary",
          code: "formConfirmBtn",
          name: "确定",
          areaType: "FORM",
          btnType: "single",
          index: "6",
          event: this.submit_
        },
        {
          funcType: "custom",
          style: "",
          code: "formCancelBtn",
          name: "取消",
          areaType: "FORM",
          btnType: "single",
          event: this.cancelHandle
        }
      ],
      //固定表单数据↓
      invariableBindData: {
        //从外面带进来的数据
        fromOutsideData: {},
        //modeldata的数据
        fromModelData: {},
        visible: false,
        selectItem: [],
        validateResult: false
      },
      houseDetailVisible: {
        visible: false
      },
      ownerDetailVisible: {
        visible: false,
        ownerId: ""
      }
      //固定表单数据↑
    };
  },
  methods: {
    /*===========↓固定表单部分↓==============*/
    updateBackData(data) {},
    //更新固定表单的验证结果
    updateValidateResult(valid) {
      this.invariableBindData.validateResult = valid;
      //				debugger
    },
    goHouseView() {
      this.houseDetailVisible.visible = true;
    },
    goCusView(ownerId) {
      this.ownerDetailVisible.ownerId = ownerId;
      this.ownerDetailVisible.visible = true;
    },
    /*===========↑固定表单部分↑==============*/

    getNewOwner(info) {
      this.newOwnerObj = info;
    },
    changeMainhouse(val) {
      this.isMainHouse = val;
      console.log(this.isMainHouse);
    },
    getPropertyNewOwner(info) {
      this.newPropertyOwnerObj = info;
    },
    //侦听切换tab
    tab_handleClick(vm) {
      let tab = vm.name;
      this.tab_active = tab;
      if (this.dialogTit == "查看") {
        this.buttonInfo = this.buttonInfo1;
      } else {
        if (tab == 5) {
          this.buttonInfo = this.buttonInfo3;
        } else {
          this.buttonInfo = this.buttonInfo2;
        }
      }
    },
    //下一步
    nextClick() {
      let now_tab = Number(this.tab_active);
      const tabAddOne = () => {
        if (now_tab < 5) {
          now_tab++;
          if (now_tab === 5) {
            this.buttonInfo = this.buttonInfo3;
          }
        }
        this.tab_active = now_tab.toString();
      };

      if (now_tab == 1) {
        this.submit("addReceiveForm", false, () => {
          tabAddOne();
        });
      } else {
        tabAddOne();
      }
    },
    //dialog相关操作
    dialogClose(formName) {
      this.$set(this.dialogVisible, "visible", false);
      store.formController.delete("addReceiveForm");
      this.invariableBindData.visible = false;
    },
    //自动表单请求获取数据 之后 操作
    afterRequest(vm, data) {
      //固定表单
      this.invariableBindData.fromModelData = data.modelData;
      this.invariableBindData.selectItem = data.selectItem;
      this.invariableBindData.visible = true;
    },
    validateBefore(vm) {
      let data = vm.formData;
      //固定表单提交数据混合
      EventHub.$emit("invariableFormBackDataListen");
    },
    cancelHandle(formName) {
      this.$set(this.dialogVisible, "visible", false);
      this.autoForm.resetForm(formName).then(params => {
        //固定表单清除
        this.invariableBindData.visible = false;
      });
    },
    submit_(formName){
      this.$set(this.dialogVisible, "visible", false);
      this.autoForm.resetForm(formName).then(params => {
        //固定表单清除
        this.invariableBindData.visible = false;
      });
    },
    submit(formName, isClose = true, submitScuccessCallback) {
      //1、再进行JEPF动态表单验证
      this.autoForm
        .validate(formName)
        .then(
          //2、JEPF动态表单验证通过
          params => {
            //固定表单验证
            let invariableValidate = this.$refs[
              "receiveInvariableForm"
            ].listenValidate();
            if (invariableValidate) {
              //固定表单提交数据混合
              EventHub.$emit("invariableFormBackDataListen");
              //设置提交参数，根据实际情况
              const query = params.formData.modelData;
              //提交后台
              this.autoForm.submit(this.submitUrl, query, () => {
                if (isClose) {
                  this.$set(this.dialogVisible, "visible", false);
                  store.formController.set(formName, {
                    show: false
                  });
                  //固定表单清除
                  this.invariableBindData.visible = false;
                }

                if (submitScuccessCallback) {
                  submitScuccessCallback();
                }
                this.$message({ message: "保存成功", type: "success" });
                this.$emit("query");
              });
            }
          }
        )
        .catch(err => {
          //进行静态表单验证
          this.$refs["receiveInvariableForm"].listenValidate();
          return false;
        });
    },
    //表单初始化
    initForm() {
      this.invariableBindData.fromOutsideData = this.bindNodeObj;
      if (this.gridFormType === "receive") {
        //收房
        this.isEdit = 0;
        this.dialogTit = "收房";
        this.houseOperateType = 2;
        this.submitUrl = this.submitUrl_add;
        this.buttonInfo = this.buttonInfo2;
        let interpreter = null;
        if(this.bindNodeObj.houseStage == '10'){
          interpreter = 10
        }
        store.formController.set("addReceiveForm", {
          show: true,
          formOperateType: 0,
          interpreter:interpreter
        });
      } else if (this.gridFormType === "see") {
        //查看
        this.isEdit = 1;
        this.dialogTit = "查看";
        this.houseOperateType = this.bindNodeObj.houseOperateType;
        this.buttonInfo = this.buttonInfo1;
        store.formController.set("addReceiveForm", {
          show: true,
          formOperateType: 1
        });
      } else if (this.gridFormType === "edit") {
        //修改
        this.isEdit = 1;
        this.houseOperateType = this.bindNodeObj.houseOperateType;
        this.dialogTit = "修改";
        this.buttonInfo = this.buttonInfo2;
        this.submitUrl = this.submitUrl_edit;
        store.formController.set("addReceiveForm", {
          show: true,
          formOperateType: 1
        });
      }
    }
  },
  created() {
    this.initForm();
  }
};
</script>
<style>

</style>