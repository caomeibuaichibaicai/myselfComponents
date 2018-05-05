<template>
  <div id="changeReport">
    <el-table :cell-class-name="tableRowClassName" :data="tableData" border style="width: 100% ;margin-top:2%"
              v-model="change" @cell-click="jump">
      <el-table-column prop="houseName" label="项目名称" width="150">
      </el-table-column>

      <el-table-column prop="companyName" label="所属公司" width="240">
      </el-table-column>
      <el-table-column prop="houseTypeName" label="房产类型" width="120">
      </el-table-column>
      <el-table-column prop="houseSubTypeName" label="房态类型" width="120">
      </el-table-column>

      <el-table-column label="初期">
        <el-table-column prop="beforeInfo.count" label="数量" width="120">



        </el-table-column>
        <el-table-column prop="beforeInfo.chargingArea" label="计费面积" width="120">
        </el-table-column>
        <el-table-column prop="beforeInfo.counRatio" label="数量比率" width="120">
        </el-table-column>
        <el-table-column prop="beforeInfo.chargingAreaRatio" label="面积比率" width="120">
        </el-table-column>

      </el-table-column>

      <el-table-column label="本期">
        <el-table-column prop="benInfo.count" label="数量" width="120">
        </el-table-column>
        <el-table-column prop="benInfo.chargingArea" label="计费面积" width="120">
        </el-table-column>
        <el-table-column prop="benInfo.counRatio" label="数量比率" width="120">
        </el-table-column>
        <el-table-column prop="benInfo.chargingAreaRatio" label="面积比率" width="120">
        </el-table-column>

      </el-table-column>

      <el-table-column label="期末">
        <el-table-column prop="afterInfo.count" label="数量" width="120">
        </el-table-column>
        <el-table-column prop="afterInfo.chargingArea" label="计费面积" width="120">
        </el-table-column>
        <el-table-column prop="afterInfo.counRatio" label="数量比率" width="120">
        </el-table-column>
        <el-table-column prop="afterInfo.chargingAreaRatio" label="面积比率" width="120">
        </el-table-column>

      </el-table-column>

      <el-table-column label="累积">
        <el-table-column prop="nowInfo.count" label="数量" width="120">
        </el-table-column>
        <el-table-column prop="nowInfo.chargingArea" label="计费面积" width="120">
        </el-table-column>
        <el-table-column prop="nowInfo.counRatio" label="数量比率" width="120">
        </el-table-column>
        <el-table-column prop="nowInfo.chargingAreaRatio" label="面积比率" width="120">
        </el-table-column>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
  import {listMenuFetch} from '@/api/houseList'

  export default {
    data() {
      return {
        change: '',

      }
    },
    props: {
      tableData: {
        type: null
      },
      treeCondition: {
        type: null
      }
    },
    methods: {

      jump(row, column, cell, event) {
        if ( column.label === '数量') {
          listMenuFetch().then((r) => {
            console.log(r)
            let funcid = r.resultData[0].childMenus[0].funcId;

            //path: this.treeCondition.path,
            this.$router.push({
              name: '房产管理',
              params: {
                organizationId: row.organizationId,
                houseType: row.houseType,
                funcid: funcid
              }
            })
          })

        }else if(row.prop.beforeInfo.count === '未装修' &&  column.label === '数量'){
          this.$router.push({
              name: '装修管理',
              params: {
                organizationId: row.organizationId,
                houseType: row.houseType,
                funcid: funcid
              }
          })

        }
      },

      tableRowClassName({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 4 || columnIndex === 8 || columnIndex === 12 || columnIndex === 16) {
          return 'warning-row';
        } else if (columnIndex == 20) {
          return 'success-row';
        }
        return '';
      }
    },
  }
</script>


<style rel="stylesheet/less" lang="scss">
  #changeReport {
      .el-table thead.is-group th {
        background: #f4f8fe;
      }
      .el-table th,
      .el-table td {
        padding: 0;
      }
      .el-table .warning-row {
        color: #0a7af8;
        cursor: pointer;
      }
      .el-table .success-row {
        color: #0a7af8;
        cursor: pointer;
      }
    }
</style>
