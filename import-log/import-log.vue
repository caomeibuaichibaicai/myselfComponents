<!--导入日志-->
<template>
  <ns-dialog class="import-log" top="7%" :title="title" width="1300px" :modal='true' :visible.sync="importLogVisible">

    <span style="float: left;line-height: 32px">开始日期</span>
    <ns-date-picker v-model="startTime" type="date" placeholder="选择开始日期" format="yyyy - MM - dd"
                    valueFormat="yyyy-MM-dd" :clearable="true">

    </ns-date-picker>
    <span style="float: left;line-height: 32px">结束日期</span>
    <ns-date-picker v-model="endTime" type="date" placeholder="选择开始日期" format="yyyy - MM - dd"
                    valueFormat="yyyy-MM-dd" :clearable="true">

    </ns-date-picker>

    项目名称
    <el-input v-model="projectName" size="medium" placeholder="请输入项目名称"></el-input>
    房产名称
    <el-input v-model="propertyName" size="medium" placeholder="请输入房产名称"></el-input>

    <el-button @click="logSearch" type="primary" size="medium">搜索</el-button>

    <!--表格部分-->
    <el-table
      :data="tabledata"
      v-loading="loading"
      max-height="460"
      border>
      <el-table-column
        prop="importName"
        label="批次"
        width="250"
      >
      </el-table-column>
      <el-table-column
        prop="precinctName"
        label="项目名称 "
      >
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="houseName"-->
        <!--label="房产名称"-->
      <!--&gt;-->
      </el-table-column>
      <el-table-column
        prop="houseShortName"
        label="房产简称"
      >
      </el-table-column>

      <el-table-column
        prop="importIndex"
        label="所在行数"
        width="80"
      >
      </el-table-column>

      <el-table-column
        prop="importResultName"
        label="导入结果"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="importRemark"
        label="失败原因"
        width="300"
      >
      </el-table-column>
      <el-table-column
        prop="userName"
        width="100"
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="importDate"
        label="导入时间"
        width="150"
      >
      </el-table-column>

    </el-table>

    <!--搜索失败-->
    <div style="position: absolute;top:40%; left:40%" v-if="this.tabledata === undefined">
      <img src="../../../assets/img/error/searchNone.png">
      <p>抱歉,没有搜索到你要的结果</p>
    </div>

    <!--底部分页-->
    <span slot="footer" class="dialog-footer">
        <div class="logPage">
        <el-pagination
          v-if="dataEmpty"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          :current-page='pageNum'
          :page-size='pagesSize'
          layout="total, sizes, prev, pager, next, jumper"
          :total=total>
        </el-pagination>
        <el-button v-if="dataEmpty" type="primary" size="medium">确定</el-button>
      </div>
  </span>
  </ns-dialog>
</template>

<script>
  import {importFetch} from '@/api/import';
  import * as store from '@/utils/nsQuery/nsStore'
  import {importLogData} from '../../../api/summary'//下载请求地址


  export default {
    props: {
      importLogVisible: {
        type: Object,
        default: function () {
          return {
            visible: false
          }
        }
      },

      title: {
        type: String, 
        default: ''
      },

    },
    data() {
      return {
        dataEmpty: true,
        endTime: new Date().toISOString().slice(0, 10),
        startTime: '',
        loading: false,
        projectName: '',
        propertyName: '',
        pageNum: 1,
        pagesSize: 10,
        total: this.total,
        tabledata: this.tabledata,
      }
    },
    created() {
      this.importLogData();
    },
    methods: {
      //表格数据请求
      importLogData() {
        importLogData({
          "pageNum": 1,
          "pageSize": 10,

        }).then((result) => {
          console.log(result);
          this.tabledata = result.resultData;
          this.total = result.total;
          if (result.total === 0) {
            this.dataEmpty = false
          } else {
            this.dataEmpty = true
          }
        });
      },
      //搜索请求数据
      logSearch() {
        importLogData({
          'endTime': this.endTime,
          'precinctName': this.projectName,
          'houseName': this.propertyName,
          'startTime': this.startTime,
          "pageSize": this.pagesSize,
          "pageNum": this.pageNum,
        }).then((result) => {
          console.log(result);
          this.tabledata = result.resultData;
          if (result.total === 0) {
            this.dataEmpty = false
          } else {
            this.dataEmpty = true
          }
        })
      },
      //改变条数
      handleSizeChange(val) {
        this.pagesSize = val
        importLogData({
          "pageNum": this.pageNum,
          "pageSize": this.pagesSize,
        }).then((result) => {
          console.log(result);
          this.tabledata = result.resultData;
        })
      },
      //改变页数
      handleCurrentChange(val) {
        importLogData({
          "pageNum": val,
          "pageSize": this.pagesSize,

        }).then((result) => {
          console.log(result);
          this.tabledata = result.resultData;
        })
      },


    },

  }
</script>

<style rel="stylesheet/less" lang="scss">
  .import-log {
    .ns-dialog .el-dialog {
      max-height: 660px;
    }
    .el-table {
      max-height: 400px;
      overflow: hidden;
      border-right: 1px solid #d9d9d9;
      border-bottom: none;
    }
    .el-input {
      width: 200px;
      padding: 0px 10px 20px 10px;
    }
    .logPage {
      paddning: 0px;
      margin-top: 20px;
      height: 50px;
      line-height: 50px;
      .el-button {
        margin-top: -26px;

      }
    }
    .el-icon-arrow-up:before {
      content: "";
    }
    .el-icon-date:before {
      content: "\e608";
      margin-top: 0;
    }
    .el-icon-circle-close {
      position: relative;
      top: -10px;
      right: 10px;
    }
    .ns-date-picker {
      float: left;
      width: 200px !important;

    }
    p {
      padding-left: 40px
    }
    .dialog-footer {
      text-align: left;
      padding: 0px 42px;
      border: none;
    }
    .el-dialog__footer {
      height: 80px;
      padding: 0px 42px !important;
    }
    .el-dialog__body {
      padding: 24px 32px 0px 32px !important;
    }
    .el-input__icon.el-icon-date {
      margin: -10px 0px 0px 5px;

    }
    .el-table--group::after, .el-table--border::after {
      height: 0px;
      width: 0px;
    }

    .el-pagination__editor {
      width: 80px;
      .el-input__inner {
        width: 50px;
      }

    }
  }

</style>
