<template>
  <div id="compileTable">
      <el-table :data="tableData" style="width: 100%"  height="250" @selection-change="handleSelectionChange"  highlight-current-row @row-click="rowClick">
          <el-table-column v-if="checkbox"
            type="selection"
            width="45">
          </el-table-column>
        <el-table-column v-for="(n,index) in line" :key="index" :prop="n.prop" :label="n.label" :width="n.width" sortable>
            <template slot-scope="scope">
              <el-input @change="changeRules(scope.row[n.prop],n.rulesMessage)" v-if="n.type=='input'" v-model="scope.row[n.prop]" maxlength="20" :disabled="scope.row.disabled || n.disabled"></el-input>
              <el-input v-else-if="n.type=='textarea'" type="textarea" v-model="scope.row[n.prop]" maxlength="20" :disabled="scope.row.disabled || n.disabled"></el-input>
              <el-select @change="change" v-else-if="n.type=='option'" v-model="scope.row[n.prop]" slot="prepend" placeholder="请选择" :disabled="scope.row.disabled || n.disabled">
                  <el-option v-for="(item,index) in n.option" :key="index" :label="item.label" :value="item.value || n.disabled"></el-option>
             </el-select>
             <el-checkbox v-else-if="n.type=='checkbox'" v-model="scope.row[n.prop]" :disabled="scope.row.disabled" checked></el-checkbox>
             <el-input v-else-if="n.type=='inputAdd'" v-model="scope.row[n.prop]" maxlength="20" :disabled="scope.row.disabled || n.disabled">
                 <el-button slot="append" icon="el-icon-plus" @click="choose(scope.$index,scope.row)"></el-button>
             </el-input>
             <el-input @input="inputChange" v-else-if="n.type=='readinput' && !scope.row.readonly" v-model="scope.row[n.prop]" maxlength="20"></el-input>
             <span v-else-if="n.type=='readinput' && scope.row.readonly" style="margin-left:15px;">{{scope.row[n.prop]}}</span>
             <span v-else class="lastData">{{scope.row[n.prop] | dataType}}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" v-if="showHandleCol">
            <template slot-scope="scope">
	        	<el-button v-if="!scope.row.disabled"
						 type="text" @click="deleteItem(scope.$index)">删除</el-button>                
            </template>
        </el-table-column>
      </el-table>
  </div>
</template>
<script>
export default {
  props:{
    // 表头字段配置
      line:{
          type: Array,
          default:[{prop:"",label:"",rulesMessage:null}]
      },
    //   rulesMessage：{rules:/^\w+$/,message:"提示文字"} rules验证规则，message 提示文字
      showHandleCol:{
          type:Boolean,
          default:true
      },
    //   表格数据
      tableData: {
          type:Array,
        default () {
          return [];
        }
      },
      checkbox:{//勾选框
          type:Boolean,
          default:false
        },
  },
  methods: {
      inputChange(){
          this.$emit('inputChange');
      },
      deleteItem(index){ 
          this.$emit('deleteItem',index);  
      },
      choose(index,row){
          this.$emit('choose',index,row);
      },
      change(){
          this.$emit('change');
      },
      rowClick (row, event, column) {
          this.$emit('row-click',row, event, column)
      },
      changeRules(val,rulesMessage){
          if(rulesMessage && !rulesMessage.rules.test(val)){
              this.$message({
                message: rulesMessage.message,
                type: 'warning'
                });
          }
      },
       handleSelectionChange(val){
        this.$emit("handleSelectionChange",val)
      }
  }
}
</script>
<style rel="stylesheet/less" lang="scss">
  #compileTable{
    .el-checkbox__label{
        color:#666!important;
        font-weight: bold;
    }
    .el-input__inner{
        height: 25px;
        border: none;
    }
    .lastData{
        margin-left:3px;
    }
    .el-table td div{
            border: none;
        }
    // .el-table .cell, .el-table .el-table__row .cell .td-txt{
    //     height: auto;
    //     line-height: normal;
    //   }
    //   .el-table th, .el-table td{
    //     height: 32px;
    //   }
}
</style>
