<template>
    <div id="easyGrid">
      <div class="easyTotalTable">
        <el-table
          ref="singleTable"
          :data="tableData"
          highlight-current-row
          border
          @selection-change="handleSelectionChange"
          style="width: 100%;" :max-height="height" :height="easyGridHeight"  @row-click="rowClick" @select="selectHead">
          <el-table-column v-if="checkbox"
            type="selection"
            :width="selectionWidth">
          </el-table-column>
          <el-table-column v-for="(n,index) in line" :key="index"
          :min-width="minWidth"
          :type="n.type"
          :property="n.property"
          :label="n.label"
          :width="n.width" :formatter="function(row, column, cellValue){
              if(column.property == n.filterTank){
                if(cellValue == 1){
                  return '是' ;
                }else {
                  return '否'
                }
              }else if(column.property == n.filterTitle){
                if(cellValue == 1){
                  return '主表' ;
                }else {
                  return '子表'
                }
              }else {
                return cellValue
              }
          }">
          </el-table-column>
          <el-table-column v-if="operation.Tboolean"
            fixed="right"
            label="操作"
            :width="operation.width">
            <template slot-scope="scope">
              <el-button @click="compile(scope.row)" type="text" size="small">编辑</el-button>
              <el-button type="text" size="small" @click="deleteRow(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </div>
        <div class="partant" v-if="total<=5"><div class="paging"></div></div>
        <div class="partant" v-else>
          <div class="paging">
            <el-pagination  @current-change="currentChange" :page-size="pageSize" layout="slot, prev, pager, next, jumper" :current-page="presentPage" :total="total">
            <span class="page">共{{total}}条/{{total/pageSize | MathCeil}}页</span>
            </el-pagination>
          </div> 	
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      presentPage:{
        type:Number,
        default:1
      },
      pageSize:{//每页显示的的条数
        type:Number,
        default:5
      },
      total:{//分页的总页数
        type:Number,
        default:1
      },
      operation:{//控制操作按钮的显隐
        type:Object,
        default () {
          return {width:"",Tboolean:false}
        }
      },
      tableData:{//表格的数据
        type:Array,
        default () {
          return [];
        }
      },
      line:{//表格的列配置
        type:Array,
        default () {
          return [];
         }
        },
        checkbox:{//勾选框
          type:Boolean,
          default:false
        },
        minWidth:{//设置列的最小宽度
          type:Number,
          default:120
        },
        height:{
          type:Number,
          default:null
        },
        selectionWidth:{//设置勾选框的宽度
          type:String,
          default:"45"
        },
        easyGridHeight:{
          type:Number,
          default:null
        }
    },
    methods: {
      currentChange(val){//当前页数发生变化触发函数
        this.$emit('currentChange', val)
      },
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
      },
      compile(row){//编辑触发的函数
        this.$emit('compile',row)
      },
      deleteRow(row){//删除触发的函数
        this.$emit('deleteRow',row)
      },
      rowClick (row, event, column) {//单击该行触发单击函数
          this.$emit('row-click',row, event, column)
      },
      handleSelectionChange(val){
        this.$emit("handleSelectionChange",val)
      },
      selectHead (selection, row) {//勾选checkbox触发的事件
      this.$emit('select-head',selection,row)
      }
    }
  }
</script>
<style rel="stylesheet/less" lang="scss">
  #easyGrid{
      .el-table--border{
        border: none;
      }
      .paging{
        margin:0 8px;
      }
      .partant{
        margin: 8px 0px;
        display:flex;
        align-items: center;
      }
      .el-table--border th:last-child{
        border: none;
      }
      div.el-table__empty-block{
        min-height:auto!important;
        width: auto!important;
      }
  }
</style>




