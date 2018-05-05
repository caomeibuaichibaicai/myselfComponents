<template>
  <ns-dialog :title="title" id="bank_dialog" width="764px" :visible.sync="visible" @close="dialogClose">
    <ns-auto-form
      autoFormID="bank_dialog_form"
      :cover-data="coverData"
      :is-local="true"
      :local-data="autoFormoLcaldata"
      cue-type="only-error"
      @afterRequest="afterRequest"
      @submit-success="submitSuccess"
    >
    </ns-auto-form>
    <!--按钮-->
    <div slot="footer">
      <ns-auto-form-operation :buttonInfo="buttonInfo" autoFormID="bank_dialog_form"></ns-auto-form-operation>
    </div>
  </ns-dialog>
</template>

<script>
  import ns from '@/utils/nsQuery/nsQuery'
  import * as store from '@/utils/nsQuery/nsStore'
  import resetData from './reset'
  import {fetchBankSingleDetail} from '../../../api/add-bank.js'

  export default {
    props: {
      visible: {
        type: Object,
        default() {
          return {
            /**/
            visible: true
          }
        }
      },
      itemInfo: {
        type: Object,
        required: true
      },
      type: null
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
            index: '6',
            event: this.submit
          },
          {
            funcType: 'custom',
            style: '',
            code: 'formCancelBtn',
            name: '取消',
            areaType: 'FORM',
            btnType: 'single',
            event: this.cancelHandle
          },
        ],
        submitUrl: "/owner/customer/add-bank",
        autoFormoLcaldata: resetData,
        coverData: {},
        title: "",
        detailInfo: {}
      }
    },
    created() {
      if (this.type === "add") {
        this.title = '新增银行账户';
        //注册自动表单，获取请求数据
        this.changeDialogShowState(true)
      } else {
        this.title = '编辑银行账户';
        this.fetchEditInfo();
      }
    },
    methods: {
      fetchEditInfo() {
        fetchBankSingleDetail({
          ownerBankAccountId: this.itemInfo.ownerBankAccountId
        }).then((r) => {
          this.detailInfo = r.resultData;
          if (this.detailInfo.isEnable == 1) {
            this.detailInfo.isEnable = true
          } else {
            this.detailInfo.isEnable = false
          }
          this.changeDialogShowState(true)
        })
      },
      afterRequest(vm, data) {
        this.modelShowData = data;
        //编辑时赋值
        if (this.type === "edit") {
          this.modelShowData.modelData = this.detailInfo;
        }
      },
      //dialog关闭回调
      dialogClose(formName) { //dialog关闭清空表单内容
        this.changeDialogShowState(false)
      },
      //自动表单 "提交成功后" 的操作
      submitSuccess(params) {
        this.$emit('query');
        this.$message({
          message: '保存成功',
          type: 'success'
        });
        this.changeDialogShowState(false)
      },
      cancelHandle(formName) {
        this.changeDialogShowState(false)
      },
      //执行dialog开关的一系列操作
      changeDialogShowState(type) {
        if (type) {
          store.formController.set('bank_dialog_form', {
            show: true
          });
        } else {
          this.autoForm.resetForm('bank_dialog_form').then(params => {
            this.$set(this.visible, 'visible', false)
            store.formController.delete('bank_dialog_form');
          });
          //手动清空
          for (let key in resetData.modelData) {
            if (key == 'isEnable') {
              resetData.modelData[key] = true
            } else {
              resetData.modelData[key] = ''
            }
          }
        }
      },
      submit(formName) {
        //1、再进行JEPF动态表单验证
        this.autoForm.validate(formName).then(
          //2、JEPF动态表单验证通过
          params => {
            //设置提交参数，根据实际情况
            const query = JSON.parse(JSON.stringify(params.formData.modelData));
            if (query.isEnable) {
              query.isEnable = 1
            } else {
              query.isEnable = 0
            }
            query.ownerId = this.itemInfo.ownerId;
            //提交后台
            this.autoForm.submit(this.submitUrl, query, () => {
              this.submitSuccess()
            })
          }
        ).catch((err) => {
          return false;
        })
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="scss">
  #bank_dialog {
    .el-dialog {
      width: 760px;
    }
    .el-dialog__header {
      height: 60px;
    }
    .el-dialog__title {
      float: left;
      height: 60px;
      line-height: 60px;
      padding-left: 16px;
    }
    .el-dialog__body {
      height: auto;
    }
  }
</style>
