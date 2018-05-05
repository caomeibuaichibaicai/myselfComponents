<template>
  <div id="houseReport" >
    <el-table :cell-class-name="tableRowClassName" :data="tableData" border style="width: 100%;margin-top: 2%;" v-model="house" @cell-click=jump>
      <el-table-column prop="precinctName" label="项目名称" width="150">
      </el-table-column>

      <el-table-column prop="companyName" label="所属公司" width="120">
      </el-table-column>
      <el-table-column prop="houseTypeName" id="a" label="收费项目" width="120">
        <el-table-column prop="houseSubTypeName" id="b" label="" width="60">
        </el-table-column>
        <el-table-column prop="houseSubType" id="c" label="" width="60">
        </el-table-column>
      </el-table-column>
      <el-table-column prop="companyName" label="单价" width="120">
      </el-table-column>
      <el-table-column prop="count" label="房产数量" width="120">

      </el-table-column>
      <el-table-column prop="chargingArea" label="计费面积" width="120">
      </el-table-column>
      <el-table-column prop="buildingArea" label="建筑面积" width="120">
      </el-table-column>
      <el-table-column prop="poolArea" label="公摊面积" width="120">
      </el-table-column>
      <el-table-column prop="insidingArea" label="套内面积" width="120">
      </el-table-column>

      <el-table-column label="出售信息">
        <el-table-column prop="saledInfo" label="已售" width="120">
          <el-table-column prop="saledInfo.count" label="数量" width="120">
          </el-table-column>
          <el-table-column prop="saledInfo.chargingArea" label="计费面积" width="120">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="saleNoInfo" label="空置" width="120">
          <el-table-column prop="saleNoInfo.count" label="数量" width="120">
          </el-table-column>
          <el-table-column prop="saleNoInfo.chargingArea" label="计费面积" width="120">
          </el-table-column>
        </el-table-column>

      </el-table-column>

      <el-table-column label="收房信息">
        <el-table-column prop="soufangWaitInfo" label="待收房" width="120">
          <el-table-column prop="soufangWaitInfo.count" label="数量" width="120">
          </el-table-column>
          <el-table-column prop="soufangWaitInfo.chargingArea" label="计费面积" width="120">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="soufangedInfo" label="已收房" width="120">
          <el-table-column prop="soufangedInfo.count" label="数量" width="120">
          </el-table-column>
          <el-table-column prop="soufangedInfo.chargingArea" label="计费面积" width="120">
          </el-table-column>
        </el-table-column>

      </el-table-column>

      <el-table-column label="入住信息">
        <el-table-column prop="ruzhuInfo" label="入住" width="120">
          <el-table-column prop="ruzhuInfo.count" label="数量" width="120">
          </el-table-column>
          <el-table-column prop="ruzhuInfo.chargingArea" label="计费面积" width="120">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="ruzhuNotInfo" label="空关" width="120">
          <el-table-column prop="ruzhuInfo.count" label="数量" width="120">
          </el-table-column>
          <el-table-column prop="ruzhuNotInfo.chargingArea" label="计费面积" width="120">
          </el-table-column>
        </el-table-column>

      </el-table-column>

      <el-table-column label="装修信息">
        <el-table-column prop="decoratingInfo" label="装修中" width="120">
          <el-table-column prop="decoratingInfo.count" label="数量" width="120">
          </el-table-column>
          <el-table-column prop="decoratingInfo.chargingArea" label="计费面积" width="120">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="decoratedInfo" label="已装修" width="120">
          <el-table-column prop="decoratedInfo.count" label="数量" width="120">
          </el-table-column>
          <el-table-column prop="decoratedInfo.chargingArea" label="计费面积" width="120">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="decorateNotInfo" label="未装修" width="120">
          <el-table-column prop="decorateNotInfo.count" label="数量" width="120">
          </el-table-column>
          <el-table-column prop="decorateNotInfo.chargingArea" label="计费面积" width="120">
          </el-table-column>
        </el-table-column>

      </el-table-column>

      <el-table-column prop="rentInfo" label="出租" width="120">
        <el-table-column prop="rentInfo.count" label="数量" width="120">
        </el-table-column>
        <el-table-column prop="rentInfo.chargingArea" label="计费面积" width="120">
        </el-table-column>
      </el-table-column>

      <el-table-column prop="stopInfo" label="停用" width="120">
        <el-table-column prop="stopInfo.count" label="数量" width="120">
        </el-table-column>
        <el-table-column prop="stopInfo.chargingArea" label="计费面积" width="120">
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
        house: '',
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
        if (column.label === '房产数量') {
          listMenuFetch().then((r) => {
            let funcid = r.resultData[0].childMenus[0].funcId;
            //path: this.treeCondition.path,
            this.$router.push({
              name: '房屋管理',
              params: {
                organizationId: row.organizationId,
                houseType: row.houseType,
                funcid: funcid
              }
            })
          })
        }
        if (column.label === '数量') {
          this.$router.push({
            name: '房屋管理',
            params: {
              path: 123,
              houseName: row.houseName,
              insidingArea: row.insidingArea
            }
          })
        }

      },
      tableRowClassName({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 10 || columnIndex === 16 || columnIndex === 18 || columnIndex === 20 || columnIndex === 22 || columnIndex === 24 || columnIndex === 26) {
          return 'warning-row';
        } else if (columnIndex === 5 || columnIndex === 28 || columnIndex === 30) {
          return 'success-row';
        }
        else if (columnIndex === 10) {
          return 'success-row';
        }
        else if (columnIndex === 12) {
          return 'success-row';
        }
        else if (columnIndex === 14) {
          return 'success-row';
        }
        return '';
      }

    }

  }
</script>

<style  rel="stylesheet/less" lang="scss">
  #houseReport{
  .el-table thead.is-group th{
  background:#f4f8fe;

  }
  .el-table th, .el-table td{
  padding: 0;
  }
  .el-table .warning-row {
  color:#0a7af8;
  }
  .el-table .success-row {
  color:#0a7af8;
  }
  }

</style>
