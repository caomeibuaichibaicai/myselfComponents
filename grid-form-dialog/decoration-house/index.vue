<template>
    <div class="grid-form-dialog">
        <!--弹窗-->
        <ns-dialog class="grid-form-dialog" width="900px" id="decoration-grid-form-dialog" @close="dialogClose" :title="dialogTit" :visible.sync="dialogVisible" >
          <ns-auto-form
            autoFormID="addDecorationForm"
            :request-url="requestUrl"
            :submit-url="submitUrl"
            :local-data="localData"
            :query="{houseId: bindNodeObj.houseId,detailId:bindNodeObj.detailId,houseOperateType:houseOperateType,isEdit:isEdit}"
            :cover-data="coverData"
            cue-type="only-error"
            @afterRequest="afterRequest"
          >
          </ns-auto-form>
          <!--按钮-->
          <div slot="footer">
            <ns-auto-form-operation :buttonInfo="buttonInfo" autoFormID="addDecorationForm"></ns-auto-form-operation>
          </div>
        </ns-dialog>
				<house-view :viserble="houseDetailVisible" v-if="houseDetailVisible.visible" :houseId="bindNodeObj.houseId"></house-view>

				<customer-view :viserble="ownerDetailVisible" v-if="ownerDetailVisible.visible" :ownerId="ownerDetailVisible.ownerId"></customer-view>
    </div>
</template>
<script>
import * as store from "@/utils/nsQuery/nsStore";
import EventHub from "@/utils/eventHub/eventHub.js";
import resetData from "./reset";
import houseView from "@/views/owner/house-information/house-view.vue";
import customerView from "@/views/owner/customer-information/customer-view.vue";

export default {
  name: "salesList",
  components: {
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
      //dialog
      formData: {},
      localData: resetData,
      requestUrl: "/owner/houseOperate/init-form",
      submitUrl: "",
      submitUrl_add: "/owner/houseOperate/house-operate-add-decorate",
      submitUrl_edit: "/owner/houseOperate/house-operate-edit-house-stage",
      coverData: {
        tableHead: { mainHouseList: null },
        resourcefieldBindingfnList: {
          //点击
          houseFullName(params) {
            const webVm = store.vm.get("decorate-grid-form");
            webVm.goHouseView();
          },
          ownerName(params) {
            const webVm = store.vm.get("decorate-grid-form");
            webVm.goCusView(params.formData.modelData.newOwner.ownerId);
          },
          renOwnerName(params){
            const webVm = store.vm.get("decorate-grid-form");
            webVm.goCusView(params.formData.modelData.newRentOwner.ownerId);
          }
        }
      },
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
        validateResult: false,
        isNewRentShow: false
      },
      houseDetailVisible: {
        visible: false
      },
      ownerDetailVisible: {
        visible: false,
        ownerId:''
      }
      //固定表单数据↑
    };
  },
  methods: {
    goHouseView() {
      this.houseDetailVisible.visible = true;
    },
    goCusView(ownerId) {
      if(ownerId){
        this.ownerDetailVisible.ownerId = ownerId;
        this.ownerDetailVisible.visible = true;
      }
    },
    //dialog关闭清空表单内容
    dialogClose(formName) {
      this.$set(this.dialogVisible, "visible", false);
      store.formController.delete("addDecorationForm");
    },
    //modelData赋值
    assignModelData(data) {
      data.modelData.houseFullName = this.bindNodeObj.houseFullName;
      this.ownerDetailVisible.ownerId = this.bindNodeObj.ownerId;
      if (data.modelData.newOwner) {
        data.modelData.mobile = data.modelData.newOwner.mobile;
        data.modelData.ownerName = data.modelData.newOwner.ownerName;
        data.modelData.certificate = data.modelData.newOwner.certificate;
      }
      if (data.modelData.newRentOwner) {
        data.modelData.renOwnerName = data.modelData.newRentOwner.ownerName;
        data.modelData.renMobile = data.modelData.newRentOwner.mobile;
      }
      data.modelData.houseId = this.bindNodeObj.houseId;
      data.modelData.houseName = this.bindNodeObj.houseName;
      data.modelData.detailId = this.bindNodeObj.detailId;
    },
    //自动表单请求获取数据之后 操作
    afterRequest(vm, data) {
      //从本地获取此表单的静态数据
      const formStaticData = this.localData; //this.autoFrom.getFixedFormData("roleStaticData").fixed;
      //将本地数据的modeldata和请求的数据的modeldata混合
      Object.assign(formStaticData.modelData, data.modelData);
      //将本地数据的fields和请求的数据的fields混合
      vm.$set(data, "fields", formStaticData.fields.concat(data.fields));
      //modelData赋值
      this.assignModelData(data);
    },
    validateBefore(vm, data) {},
    //提交成功
    submitSuccess() {
      this.$message({
        message: "保存成功",
        type: "success"
      });
      this.$set(this.dialogVisible, "visible", false);
      this.$emit("query");
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
            //设置提交参数，根据实际情况
            const query = params.formData.modelData;
            //提交后台
            this.autoForm.submit(this.submitUrl, query, () => {
              this.submitSuccess();
            });
          }
        )
        .catch(err => {
          return false;
        });
    },
    //表单初始化
    initForm() {
      this.invariableBindData.fromOutsideData = this.bindNodeObj;
      if (this.gridFormType === "decoration") {
        //装修
        this.isEdit = 0;
        this.buttonInfo = this.buttonInfo2;
        this.submitUrl = this.submitUrl_add;
        this.dialogTit = "装修";
        this.houseOperateType = 10;
        this.submitUrl = this.submitUrl_add;
        this.buttonInfo = this.buttonInfo2;
        store.formController.set("addDecorationForm", {
          interpreter: 0,
          formOperateType: 0,
          show: true
        });
      } else if (this.gridFormType === "see") {
        //查看
        this.houseOperateType = this.bindNodeObj.houseOperateType;
        this.dialogTit = "查看";
        this.buttonInfo = this.buttonInfo1;
        this.isEdit = 1;
        store.formController.set("addDecorationForm", {
          show: true,
          interpreter: 0,
          formOperateType: 0
        });
      } else if (this.gridFormType === "edit") {
        //修改
        this.houseOperateType = this.bindNodeObj.houseOperateType;
        this.dialogTit = "修改";
        this.isEdit = 1;
        this.submitUrl = this.submitUrl_edit;
        this.buttonInfo = this.buttonInfo2;
        this.submitUrl = this.submitUrl_edit;
        store.formController.set("addDecorationForm", {
          show: true,
          interpreter: 0,
          formOperateType: 0
        });
      }
    }
  },
  created() {
    store.vm.set("decorate-grid-form", this);
    this.initForm();
  }
};
</script>
<style rel="stylesheet/less" lang="scss">
  #decoration-grid-form-dialog {
    .ns-text-span {
      color: #20a0ff;
      cursor: pointer;
    }
    .ns-text-span:hover {
      text-decoration: underline;
    }
  }
</style>