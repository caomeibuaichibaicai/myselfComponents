<template>
  <div id="houseReport">
    <el-table :header-cell-class-name="headerClass" :cell-class-name="tableRowClassName" :data="tableData" border
              style="width: 100%;margin-top: 2%;" v-model="house" v-if="tableData && tableHeadData" >
      <!--一级循环-->
      <el-table-column v-for="(firstItem,firstIndex) in tableHeadData" :index="firstIndex" :key="firstIndex"
                       :align="firstItem.align" :label="firstItem.label" :width="firstItem.width">
        <!--二级循环 - 有二级内容-->
        <el-table-column v-for="(secondItem,secondIndex) in firstItem.child" :index="secondIndex" :key="secondIndex"
                         :align="secondItem.align" :label="secondItem.label" :width="secondItem.width"
                         v-if="firstItem.child.length>0">
          <!--三级循环 - 有三级内容-->
          <el-table-column v-for="(thirdItem,thirdIndex) in secondItem.child" :index="thirdIndex" :key="thirdIndex"
                           v-if="secondItem.child.length>0"
                           :align="thirdItem.align" :label="thirdItem.label" :width="thirdItem.width">

            <!--三级循环 - 内容部分-->
            <template slot-scope="scope">

              <span  class="" v-html="judgehasObj(scope.row,secondItem.prop,thirdItem.prop)"
                    @click="thirdItem.prop ==='count'?tableJumpTo(firstItem.label,secondItem.label,thirdItem.label):null"></span>


            </template>
          </el-table-column>
          <!--三级循环 - 无三级内容 =>   二级循环 - 内容部分-->
          <template slot-scope="scope" v-if="secondItem.child.length===0">
            <span @click="secondItem.prop ==='count'?tableJumpTo(firstItem.label,secondItem.label,''):null"
                  class="">
              {{scope.row[secondItem.prop]}}
            </span>
          </template>
        </el-table-column>
        <!--二级循环 - 无二级内容 =>   一级循环 - 内容部分-->
        <template slot-scope="scope" v-if="firstItem.child.length===0">
          <span @click="firstItem.prop ==='count'?tableJumpTo(firstItem.label,'',''):null"
                class="">
            {{scope.row[firstItem.prop]}}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import ns from '@/utils/nsQuery/nsQuery'
  import {listMenuFetch} from '@/api/houseList'

  export default {
    data() {
      return {
        //表头
        tableHeadData: [
          //项目名称
          {prop: 'precinctName', label: '项目名称', align: "left", width: "150", child: []},
          //所属公司
          {prop: 'companyName', label: '所属公司', align: "left", width: "120", child: []},
          //房产类型
          {
            prop: 'houseTypeName', label: '房产类型', align: "left", width: "120",
            child: [
              {prop: 'houseTypeName', label: '项目名称', align: "left", width: "60", child: []},
              {prop: 'houseSubTypeName', label: '项目名称', align: "left", width: "60", child: []}
            ]
          },
          //房产数量
          {prop: 'count', label: '房产数量', align: "left", width: "120", child: []},
          //计费面积
          {prop: 'chargingArea', label: '计费面积', align: "left", width: "120", child: []},
          //建筑面积
          {prop: 'buildingArea', label: '建筑面积', align: "left", width: "120", child: []},
          //公摊面积
          {prop: 'poolArea', label: '公摊面积', align: "left", width: "120", child: []},
          //套内面积
          {prop: 'insidingArea', label: '套内面积', align: "left", width: "120", child: []},
          //出售信息
          {
            prop: '', label: '出售信息', align: "left", width: "",
            child: [
              {
                prop: 'saledInfo', label: '已售', align: "left", width: "120", child:
                [
                  {prop: 'count', label: '数量', align: "left", width: "120", child: []},
                  {prop: 'chargingArea', label: '计费面积', align: "left", width: "120", child: []},
                ]
              },
              {
                prop: 'saleNotInfo', label: '空置', align: "left", width: "120", child:
                [
                  {prop: 'count', label: '数量', align: "left", width: "120", child: []},
                  {prop: 'chargingArea', label: '计费面积', align: "left", width: "120", child: []},
                ]
              },
            ]
          },
          //收房信息
          {
            prop: '', label: '收房信息', align: "left", width: "",
            child: [
              {
                prop: 'soufangWaitInfo', label: '待收房', align: "left", width: "120", child:
                [
                  {prop: 'count', label: '数量', align: "left", width: "120", child: []},
                  {prop: 'chargingArea', label: '计费面积', align: "left", width: "120", child: []},
                ]
              },
              {
                prop: 'soufangedInfo', label: '已收房', align: "left", width: "120", child:
                [
                  {prop: 'count', label: '数量', align: "left", width: "120", child: []},
                  {prop: 'chargingArea', label: '计费面积', align: "left", width: "120", child: []},
                ]
              },
            ]
          },
          //入住信息
          {
            prop: '', label: '入住信息', align: "left", width: "",
            child: [
              {
                prop: 'ruzhuInfo', label: '入住', align: "left", width: "120", child:
                [
                  {prop: 'count', label: '数量', align: "left", width: "120", child: []},
                  {prop: 'chargingArea', label: '计费面积', align: "left", width: "120", child: []},
                ]
              },
              {
                prop: 'ruzhuNotInfo', label: '空关', align: "left", width: "120", child:
                [
                  {prop: 'count', label: '数量', align: "left", width: "120", child: []},
                  {prop: 'chargingArea', label: '计费面积', align: "left", width: "120", child: []},
                ]
              },
            ]
          },
          //装修信息
          {
            prop: '', label: '装修信息', align: "left", width: "",
            child: [
              {
                prop: 'decoratingInfo', label: '装修中', align: "left", width: "120", child:
                [
                  {prop: 'count', label: '数量', align: "left", width: "120", child: []},
                  {prop: 'chargingArea', label: '计费面积', align: "left", width: "120", child: []},
                ]
              },
              {
                prop: 'decoratedInfo', label: '已装修', align: "left", width: "120", child:
                [
                  {prop: 'count', label: '数量', align: "left", width: "120", child: []},
                  {prop: 'chargingArea', label: '计费面积', align: "left", width: "120", child: []},
                ]
              },
              {
                prop: 'decorateNotInfo', label: '未装修', align: "left", width: "120", child:
                [
                  {prop: 'count', label: '数量', align: "left", width: "120", child: []},
                  {prop: 'chargingArea', label: '计费面积', align: "left", width: "120", child: []},
                ]
              },
            ]
          },
          //出租
          {
            prop: 'rentInfo', label: '出租', align: "left", width: "120",
            child: [
              {prop: 'count', label: '数量', align: "left", width: "120", child: []},
              {prop: 'chargingArea', label: '计费面积', align: "left", width: "120", child: []}
            ]
          },
          //停用
          {
            prop: 'stopInfo', label: '停用', align: "left", width: "120",
            child: [
              {prop: 'count', label: '数量', align: "left", width: "120", child: []},
              {prop: 'chargingArea', label: '计费面积', align: "left", width: "120", child: []}
            ]
          },
        ],

        house: '',
        headerClass: '',
      }
    },
    props: {
      tableData: {
        type: Array, default: function () {
          return [];
        }
      },
      treeCondition: {
        type: null
      }
    },
    created() {

    },
    methods: {
      tableJumpTo(fstName, secName, tirName) {
        const ja = [
          {fstName: '出租', secName: '数量', tirName: '', path: '/owner/leaseManagement'},//出租管理
          {fstName: '停用', secName: '数量', tirName: '', path: '/owner/housemanagement'},//房产管理
          {fstName: '房产数量', secName: '', tirName: '', path: '/owner/houseManagement'},//房产管理

          {fstName: '出售信息', secName: '已售', tirName: '数量', path: '/owner/salesHouseRegister'},//售楼管理
          {fstName: '出售信息', secName: '空置', tirName: '数量', path: '/owner/salesHouseRegister'},//售楼管理

          {fstName: '收房信息', secName: '已收房', tirName: '数量', path: '/owner/receiveHouseManagement'},//收房管理
          {fstName: '收房信息', secName: '待收房', tirName: '数量', path: '/owner/receiveHouseManagement'},//收房管理

          {fstName: '入住信息', secName: '入住', tirName: '数量', path: '/owner/liveManagement'},//入住管理
          {fstName: '入住信息', secName: '空关', tirName: '数量', path: '/owner/liveManagement'},//入住管理

          {fstName: '装修信息', secName: '已装修', tirName: '数量', path: '/owner/decorationManagement'},//装修管理
          {fstName: '装修信息', secName: '未装修', tirName: '数量', path: '/owner/decorationManagement'},//装修管理
          {fstName: '装修信息', secName: '装修中', tirName: '数量', path: '/owner/decorationManagement'},//装修管理
        ];

        if (ns.base.isXType('string', name)) {
          ja.forEach((item, index) => {
            if (fstName === item.fstName && secName === item.secName && tirName === item.tirName) {
              this.tableJump(item.path);
            }
          });
        }
        else {
          return false;
        }
      },

      tableJump(path) {
        //path: this.treeCondition.path,
        this.$router.push({
          path: path,
          params: {
//            organizationId: row.organizationId,
//            houseType: row.houseType,
          }
        });
      },


      tableRowClassName({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 4 || columnIndex === 9 || columnIndex === 13 || columnIndex === 15) {
          return 'warning-row';
        }
        else if (columnIndex === 17) {
          return 'success-row';
        }
        else if (columnIndex === 19) {
          return 'success-row';
        }
        else if (columnIndex === 21) {
          return 'success-row';
        }
        else if (columnIndex === 23) {
          return 'success-row';
        }
        else if (columnIndex === 25) {
          return 'success-row';
        }
        else if (columnIndex === 27) {
          return 'success-row';
        }
        else if (columnIndex === 29) {
          return 'success-row';
        }
        return '';
      },
      /**
       * judge has Object
       * @param m
       * @param cKey1
       * @param cKey2
       * @returns {*}
       */
      judgehasObj(m, cKey1, cKey2) {
        if (m.hasOwnProperty(cKey1)) {
          if (ns.base.isXType('object', m[cKey1])) {
            if (m[cKey1].hasOwnProperty(cKey2)) {
              return m[cKey1][cKey2];
            }
          }
        }
        return '';
      }
    }
  }

</script>

<style rel="stylesheet/less" lang="scss">
  #houseReport {

    .el-table thead.is-group th {
      background: #f4f8fe;
    }
    .el-table th,
    .el-table td {
      padding: 0;
      border-left: none;
    }
    #jump {
      color: #0A7AF8;
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



