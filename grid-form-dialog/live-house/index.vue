<template>
    <div class="grid-form-dialog">
        <ns-dialog :title="dialogTit" :visible.sync="dialogVisible" width="900px" @close="dialogClose" class="grid-form-dialog" v-loading="subLoading" element-loading-text="正在提交">
					<!--固定表单-->
					<ns-invariable-form
						ref = "liveInvariableForm"
						v-if = "invariableBindData.visible"
						:bindData = "invariableBindData"
						@goHouseView = "goHouseView"
						@goCusView = "goCusView"
						@updateValidateResult = "updateValidateResult"
					>
					</ns-invariable-form>

					<!--自动表单-->
					<!--入住-->
					<ns-auto-form
						autoFormID="liveForm"
						:request-url="requestUrl"
						:query="{houseId: bindNodeObj.houseId,detailId:bindNodeObj.detailId,houseOperateType:houseOperateType,isEdit:isEdit}" :cover-data="coverData" cue-type="only-error"
						@afterRequest="afterRequest"
					></ns-auto-form>
					<!--按钮-->
			        <div slot="footer">
			          <ns-auto-form-operation :buttonInfo="buttonInfo" autoFormID="liveForm"></ns-auto-form-operation>
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
      coverData: {
        tableHead: {
          mainHouseList: null
        },
        dynamicUrl: {
          sex: "system/dictionary/select"
        },
        dynamicQuery: {
          sex: "education"
        },
        scale: {
          userAvatar: 1
        },
        resourcefieldBindingfnList: {}
      },
      requestUrl: "/owner/houseOperate/init-form",
      submitUrl: "",
      submitUrl_checkin_add: "/owner/houseOperate/house-operate-add-check-in",
      submitUrl_empty_add: "/owner/houseOperate/house-operate-add-empty",
      submitUrl_moveout_add: "/owner/houseOperate/house-operate-add-move-out",
      submitUrl_edit: "/owner/houseOperate/house-operate-edit-house-stage",
      dialogTit: "",
      subLoading: false,
      tab_active: "1",
      isOldOwnerSHow: false,
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
          funcType: "submit",
          style: "primary",
          code: "formConfirmBtn",
          name: "确定",
          areaType: "FORM",
          btnType: "single",
          index: "6",
          event: this.submit
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
    //更新固定表单的验证结果
    updateValidateResult(valid) {
      this.invariableBindData.validateResult = valid;
    },
    goHouseView() {
      this.houseDetailVisible.visible = true;
    },
    goCusView(ownerId) {
      this.ownerDetailVisible.ownerId = ownerId;
      this.ownerDetailVisible.visible = true;
    },
    /*===========↑固定表单部分↑==============*/
    //dialog相关操作
    dialogClose(formName) {
      this.$set(this.dialogVisible, "visible", false);
      store.formController.delete("liveForm");
      this.invariableBindData.visible = false;
    },
    //自动表单请求获取数据 之后 操作
    afterRequest(vm, data) {
      //固定表单
      this.invariableBindData.fromModelData = data.modelData;
      this.invariableBindData.selectItem = data.selectItem;
      this.invariableBindData.visible = true;
    },
    submitSuccess() {
      this.$message({
        message: "保存成功",
        type: "success"
      });
      this.$set(this.dialogVisible, "visible", false);
      //固定表单清除
      this.invariableBindData.visible = false;
      this.$emit('query');
    },
    cancelHandle(formName) {
      this.$set(this.dialogVisible, "visible", false);
      this.autoForm.resetForm(formName).then(params => {
        //固定表单清除
        this.invariableBindData.visible = false;
      });
    },
    submit(formName) {
      //1、再进行JEPF动态表单验证
      this.autoForm
        .validate(formName)
        .then(
          //2、JEPF动态表单验证通过
          params => {
            //固定表单验证
            let invariableValidate = this.$refs[
              "liveInvariableForm"
            ].listenValidate();
            if (invariableValidate) {
              //固定表单提交数据混合
              EventHub.$emit("invariableFormBackDataListen");
              //设置提交参数，根据实际情况
              //提交后台
              const query = params.formData.modelData;
              this.autoForm.submit(this.submitUrl, query, () => {
                this.submitSuccess();
              });
            }
          }
        )
        .catch(err => {
          //进行静态表单验证
          this.$refs["liveInvariableForm"].listenValidate();
          return false;
        });
    },
    //表单初始化
    initForm() {
      this.invariableBindData.fromOutsideData = this.bindNodeObj;
      if (this.gridFormType === "addCheckin") {
        //新增入住
        this.isEdit = 0;
        this.dialogTit = "入住";
        this.houseOperateType = 3;
        this.submitUrl = this.submitUrl_checkin_add;
        this.buttonInfo = this.buttonInfo2;
        store.formController.set("liveForm", {
          interpreter: 3,
          show: true
        });
      } else if (this.gridFormType === "addEmpty") {
        //新增空关
        this.houseOperateType = 8;
        this.dialogTit = "空关";
        this.buttonInfo = this.buttonInfo2;
        this.submitUrl = this.submitUrl_empty_add;
        this.isEdit = 0;
        store.formController.set("liveForm", {
          interpreter: 8,
          show: true
        });
      } else if (this.gridFormType === "addMoveout") {
        //新增搬出
        this.submitUrl = this.submitUrl_moveout_add;
        this.houseOperateType = 4;
        this.dialogTit = "搬出";
        this.buttonInfo = this.buttonInfo2;
        this.isEdit = 0;
        store.formController.set("liveForm", {
          interpreter: 4,
          show: true
        });
      } else if (this.gridFormType === "see") {
        //查看
        this.houseOperateType = this.bindNodeObj.houseOperateType; 
        this.dialogTit = "查看";
        this.isEdit = 1;
        this.buttonInfo = this.buttonInfo1;
        store.formController.set("liveForm", {
          show: true,
          formOperateType: 1
        });
        store.formController.set("addSalesForm", {
          show: true,
          interpreter: 203040,
          formOperateType: 1
        });
      } else if (this.gridFormType === "edit") {
        //修改
        this.houseOperateType =  this.bindNodeObj.houseOperateType;
        this.dialogTit = "修改";
        this.isEdit = 1;
        this.submitUrl = this.submitUrl_edit;
        this.buttonInfo = this.buttonInfo2;
        store.formController.set("liveForm", {
          show: true,
          formOperateType: 1,
          interpreter: 3,
        });
      } else if (this.gridFormType === "transfer") {
        //转让
        this.houseOperateType = 9;
        this.isEdit = 0;
        this.dialogTit = "转让";
        this.submitUrl = this.submitUrl_add;
        this.buttonInfo = this.buttonInfo2;
        store.formController.set("addSalesForm", {
          show: true,
          interpreter: 203040,
          formOperateType: 0
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