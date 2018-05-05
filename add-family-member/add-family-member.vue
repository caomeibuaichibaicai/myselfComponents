<template>
  <div>
    <ns-dialog id="adfm_dialog" width="546px" class="invariable" :visible="visible" :title="title" @close="dialogClose">
      <el-form ref="form" :model="form" class="form" label-width="155px" :rules="rules">
        <el-form-item label="所属项目" prop="precinct" v-if="isAdd">
          <el-select size="small" v-model="form.precinct" @change="ownerPrecinctChange" placeholder="请选择">
            <el-option v-for="(item,index) in precinctOptions" :key="item.index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="与客户关系" prop="relation">
          <el-select size="small" v-model="form.relation" @change="ownerRelationChange" placeholder="请选择">
            <el-option v-for="(item,index) in relationOptions" :key="item.index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-select size="small" v-model="form.name" :disabled="!isAdd" filterable remote reserve-keyword :loading-text="searchTip" :remote-method="remoteMethod" :loading="loading"
                     @change="handleSelect" clearable placeholder="请输入关键字">
            <el-option v-for="(item,index) in selectOptions" :key="item.index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button v-if="isAdd" @click.native="open_edit_dialog" size="medium">新增</el-button>
        </el-form-item>
        <el-form-item label="移动电话" prop="mobile">
          <el-input size="small" v-model="form.mobile" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker :disabled="true" v-model="form.birthday" type="date" size="small" placeholder="选择日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="submitHandle('form')">确 定</el-button>
        <el-button size="medium" @click="closeHandle">取 消</el-button>
      </div>
    </ns-dialog>
    <ns-dialog class="grid-form-dialog" width="900px" :title="addCusObj.dialogTit" :visible.sync="addCusObj">
      <!--auto form-->
      <ns-auto-form autoFormID="personalOwner" :request-url="requestUrl" :submit-url="submitUrl" :query="{}" :cover-data="coverData" cue-type="only-error"
                    @afterRequest="afterRequest_personal"></ns-auto-form>
      <!--auto form-->
      <ns-auto-form autoFormID="companyOwner" :request-url="requestUrl" :submit-url="submitUrl" :query="{}" :cover-data="coverData" cue-type="only-error"
                    @afterRequest="afterRequest_company"></ns-auto-form>
      <div slot="footer">
        <ns-auto-form-operation :buttonInfo="buttonInfo" :autoFormID="ownerAutoFormID"></ns-auto-form-operation>
      </div>
    </ns-dialog>
  </div>
</template>

<script>
  import {fetchListData, fetchRelateData, fetchPrecinctData, addFamilyData} from '@/api/add-family-member.js';
  import * as store from '@/utils/nsQuery/nsStore'

  export default {
    props: {
      visible: {
        type: Object,
        default: function () {
          return {
            visible: false
          }
        }
      },
      type: null,
      ownerId: {
        type: [Number, String],
        required: true
      },
      assignInfo: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        buttonInfo: [
          {
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
        ownerAutoFormID: "",
        ownerType: "0",
        //编辑客户auto-form
        formData: {},
        requestUrl: '/owner/customer/init-form',
        submitUrl: "/owner/customer/add-customer",
        coverData: {
          //表头
          tableHead: {
            mainHouseList: null
          },
          //绑定事件
          resourcefieldBindingfnList: {
            ownerType: function (params) {
              const webVm = store.vm.get('add-family');
              if (params.type === 'change' && params.type !== 'visibleChange') {
                if (params.formData.modelData[params.modelKey] === '0') {
                  store.formController.delete('companyOwner');
                  store.formController.set('personalOwner', {
                    interpreter: "0",
                    show: true
                  });
                  webVm.ownerAutoFormID = 'personalOwner'; //设置 - 按钮对应表单ID值
                  webVm.addCusObj.dialogTit = '新增个人客户';
                }
                if (params.formData.modelData[params.modelKey] === '1') {
                  store.formController.delete('personalOwner');
                  store.formController.set('companyOwner', {
                    interpreter: "1",
                    show: true
                  });
                  webVm.ownerAutoFormID = 'companyOwner'; //设置 - 按钮对应表单ID值
                  //change tableHead for enterpriseManage-form
                  params.vm.$set(params.vm.coverData.tableHead, 'mainHouseList', 'enterpriseManage');
                  webVm.addCusObj.dialogTit = '新增企业客户';
                }
              }
            }
          },
        },
        addCusObj: {
          visible: false,
          dialogTit: "",
        },
        modal: false,
        modalAppendToBody: false,
        loading: false,
        searchTip: '搜索数据中...',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        form: {
          precinct: "",
          relation: "",
          name: "",
          mobile: "",
          birthday: "",
        },
        rules: {
          precinct: [{
            required: true,
            message: '请选择所属项目',
            trigger: 'blur'
          }],
          relation: [{
            required: true,
            message: '请选择客户关系',
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: '请填写姓名',
            trigger: 'blur'
          }],
          /*					mobile: [{
                                  required: true,
                                  message: '请填写移动电话',
                                  trigger: 'blur'
                              }],*/
        },
        selectOptions: [],
        relationOptions: [],
        precinctOptions: [],
        activeRelateId: '',
        precinctId: '',
        //关联客户信息
        customerInfo: {},
        isAdd: true,
        title: "新增成员关系"
      }
    },
    created() {
      store.vm.set('add-family', this);
      this.getRelationList();
      this.getPrecinctList();
      this.customerInfoAssign();
    },
    methods: {
      /**
       * 自动表单 'personalOwner' 请求获取数据之后操作
       */
      afterRequest_personal(vm, data) {
        data.modelData.ownerType = '0';
        data.modelData.precinctId = this.precinctId;
      },
      /**
       * 自动表单 'companyOwner' 请求获取数据之后操作
       */
      afterRequest_company(vm, data) {
        data.modelData.ownerType = '1';
        data.modelData.precinctId = this.precinctId;
      },
      //打开客户信息
      open_edit_dialog() {
        if (this.precinctId == '') {
          this.$message({
            message: '请选择所属项目',
            type: 'warning'
          });
        } else {
          if (this.ownerType == 0) {
            this.addCusObj.dialogTit = '新增个人客户';
            this.ownerAutoFormID = 'personalOwner' //设置 - 按钮对应表单ID值
            store.formController.set('personalOwner', {
              interpreter: 0,
              show: true
            });
            this.addCusObj.visible = true;
          } else {
            this.addCusObj.dialogTit = '新增企业客户';
            this.ownerAutoFormID = 'companyOwner' //设置 - 按钮对应表单ID值
            store.formController.set('companyOwner', {
              interpreter: 1,
              show: true
            });
            this.addCusObj.visible = true;
          }
        }
      },
      //提交编辑客户信息
      submitSuccess() {
        this.$message({
          message: '保存成功',
          type: 'success'
        });
        this.init();
        this.addCusObj.visible = false;
      },
      dialogClose() {
        this.resetForm();
      },
      listHandle(data) { //==格式化姓名列表
        return data.map((value, index, array) => {
          return {
            label: value.ownerName,
            value: value.ownerId,
            info: value
          }
        });
      },
      //新增完客户直接赋值
      afterAddSuccess(params) {
        this.remoteMethod(params.formData.modelData.ownerName, (val) => {
          this.form.name = val.ownerName;
          this.form.mobile = val.mobile;
          this.form.birthday = val.birthday;
          this.customerInfo = val;
        })
      },
      remoteMethod(query, defBack) { //==模糊查询
        if (query != '' && query != ' ') {
          this.loading = true;
          fetchListData({
            customerName: query,
            isDeveloper: 3
          }).then((r) => {
            this.loading = false;
            this.selectOptions = this.listHandle(r.resultData);
            if (defBack) {
              defBack(r.resultData[0])
            }
          }).catch((err) => {
            this.searchTip = "服务器出错";
          })
        } else {
          this.selectOptions = [];
        }
      },
      handleSelect(item) { //==选择姓名回调
        if (this.selectOptions.length > 0) {
          for (let i = 0, val; val = this.selectOptions[i]; i++) {
            if (val.value === item) {
              this.form.mobile = val.info.mobile;
              this.form.birthday = val.info.birthday;
              this.form.name = val.info.ownerName;
              this.customerInfo = val.info;
              break;
            } else {
              this.form.mobile = "";
              this.form.birthday = "";
            }
          }
          ;
        } else {
          this.form.mobile = "";
          this.form.birthday = "";
        }
      },
      ownerRelationChange(val) { //==切换关系
        this.activeRelateId = val;
      },
      ownerPrecinctChange(val) { //==切换关系
        this.precinctId = val;
      },
      getRelationList() { //==获取关系
        fetchRelateData({
          dictionaryDdcode: "ownerRelationship"
        }).then((res) => {
          let idata = res.resultData.dictionaryitemVos;
          this.relationOptions = idata.map((value, index, array) => {
            return {
              label: value.dictionaryitemItemname,
              value: value.dictionaryitemItemcode,
              info: value
            }
          });
        })
      },
      getPrecinctList() { //==获取项目
        fetchPrecinctData().then((res) => {
          let idata = res.resultData;
          this.precinctOptions = idata.map((value, index, array) => {
            return {
              label: value.houseName,
              value: value.houseId,
              info: value
            }
          });
        })
      },
      closeHandle(params) { //==取消
        this.visible.visible = false;
      },
      resetForm() { //==重置
        this.$refs['form'].resetFields();
      },
      submitHandle(formName) { //==提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addFamilyData({
              ownerRelationship: this.activeRelateId,
              relationOwnerId: this.ownerId,
              ownerId: this.customerInfo.ownerId,
              familyId: this.customerInfo.familyId
            }).then(() => {
              this.$emit('query');
              this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.visible.visible = false;
            }).catch((r) => {
              this.$message({
                message: r.resultMsg,
                type: 'warning'
              });
            })
          } else {
            return false;
          }
        });
      },
      //编辑时数据赋值
      customerInfoAssign() {
        if (this.type !== 'edit')
          return;
        this.isAdd = false;
        this.form.relation = this.assignInfo.relationShip;
        this.form.name = this.assignInfo.name;
        this.form.mobile = this.assignInfo.phone;
        this.form.birthday = this.assignInfo.memberData.customerVo.birthday;
        this.customerInfo = this.assignInfo.memberData;
        this.activeRelateId = this.assignInfo.memberData.ownerRelationship;
        this.title = "编辑成员关系"
      },
      autoFormSubmit(formName) {
        this.autoForm.validate(formName).then(
          params => {
            //submit request
            this.autoForm.submit(this.submitUrl, params.formData.modelData, () => {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.afterAddSuccess(params)
              this.$set(this.addCusObj, 'visible', false); //dialog-close
              store.formController.delete(params.formName);
            })
          }
        ).catch((err) => {
          console.log('请检查业务逻辑代码是否正确以及请求方法是否正确');
        })
      },
      /**
       * auto-form Cancel  ( 取消按钮事件操作 )
       * @param formName       button-info
       */
      autoFormCancel(formName) {
        this.autoForm.resetForm(formName).then(
          params => {
            this.$set(this.addCusObj, 'visible', false);
            store.formController.delete(params.formName);
          }
        )
      },

    },

  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "../../../assets/css/Modular/invariable-form/invariable-form.scss";
  #adfm_dialog.ns-dialog {
    .el-dialog {
      .el-dialog__header {
        height: 60px;
      }
      .el-dialog__title {
        float: left;
        height: 60px;
        line-height: 60px;
        padding-left: 16px;
      }
    }
    .el-input {
      width: 200px;
    }
    .el-form-item__error {
      z-index: 99999;
    }
    .el-form-item__label {
      padding-right: 20px;
    }
    .el-form-item {
      margin-bottom: 24px;
    }
    .form {
      padding-top: 48px;
      box-sizing: border-box;
    }
    .el-dialog .el-dialog__body {
      height: auto;
    }
    .el-dialog__footer {
      display: block;
    }
    .el-button--default {
      line-height: 1;
    }
  }

</style>
