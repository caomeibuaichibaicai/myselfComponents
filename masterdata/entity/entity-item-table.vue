<template>
  <div id="compileTable">
      <el-table :data="tableData" style="width: 100%"  height="250"  highlight-current-row>
        <el-table-column prop="code" label="属性编码" sortable width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.code" maxlength="20" :disabled="scope.row.disabled"></el-input>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="属性名称" sortable width="115">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" maxlength="20" :disabled="scope.row.disabled"></el-input>
            </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" sortable width="95">
            <template slot-scope="scope">
                <el-select v-model="scope.row.type" slot="prepend" placeholder="请选择" :disabled="scope.row.disabled" @change="changeEntityItemType(scope.row)">
                  <el-option v-for="(item,index) in optiondata" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </template>
        </el-table-column>
        <el-table-column prop="type" label="公共档案" sortable>
            <template slot-scope="scope">
                <el-select v-if="scope.row.type!='varchar' || isPublicEntity" v-model="scope.row.publicEntityId" slot="prepend" placeholder="请选择" :disabled="true">
                  <el-option v-for="(item,index) in publicEntityList" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>                
                <el-select v-else v-model="scope.row.publicEntityId" slot="prepend" placeholder="请选择" :disabled="scope.row.disabled">
                  <el-option v-for="(item,index) in publicEntityList" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </template>
        </el-table-column>        
        <el-table-column prop="length_" label="长度" sortable width="75">
            <template slot-scope="scope">
                <el-input v-model="scope.row.length_" maxlength="5" :disabled="scope.row.disabled"></el-input>
            </template>
        </el-table-column>
        <el-table-column prop="notEmpty"  label="必输" width="50">
            <template slot-scope="scope">
                <el-checkbox v-model="scope.row.notEmpty" :disabled="scope.row.disabled"></el-checkbox>
            </template>
        </el-table-column>
        <el-table-column prop="isUnique" label="唯一" width="50">
            <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isUnique" :disabled="scope.row.disabled"></el-checkbox>
            </template>
        </el-table-column>
        <el-table-column prop="defaultValue" label="默认值" width="60">
            <template slot-scope="scope">
                <el-input v-model="scope.row.defaultValue" maxlength="20" :disabled="scope.row.disabled"></el-input>
            </template>
        </el-table-column>
        <el-table-column prop="remark"  label="备注" width="80">
            <template slot-scope="scope">
                <el-input v-model="scope.row.remark" maxlength="50" :disabled="scope.row.disabled"></el-input>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="50">
            <template slot-scope="scope">
	        	<el-button v-if="!scope.row.disabled"
						 type="text" @click="deleteEntityItem(scope.row.id,scope.$index)">删除</el-button>                
            </template>
        </el-table-column>
      </el-table>
  </div>
</template>
<script>
import {getPublicEntity} from '@/api/masterData/masterData/entityList';

export default {
  data () {
      return {
        optiondata:[{label:"字符",value:"varchar"},{label:"整型",value:"int"},{label:"浮点型",value:"double"},{label:"日期",value:"date"}],
        publicEntityList:[]
      }
  },
  props:{
      tableData: {
          type: Array
      },
      isPublicEntity:{
          type: Boolean
      }
  },
  methods: {
      deleteEntityItem(id,index){
          this.$emit('deleteEntityItem',id,index);
      },
      changeEntityItemType(data){
          data.publicEntityId=null;
      }
  },
  created(){
		getPublicEntity().then((response)=>{
			if(response.resultCode==200){
                this.publicEntityList = response.resultData;
			}
		});    
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
}
</style>
