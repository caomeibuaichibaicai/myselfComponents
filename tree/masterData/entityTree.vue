<!--房产树-->
<template>
	<div>
		<!--树显示按钮-->
    	<ns-icon-svg v-if="buttonShow" @click="treeshow" icon-class="hj" class="zhankai"></ns-icon-svg>
		<!--树区域-->
		<div v-if="treeisShow" class="tree-width house-tree" id="house_tree">
			<div class="tree-line"></div>

			<!--树隐藏按钮-->
      		<ns-icon-svg v-if="buttonisShow" @click="treeisHide" icon-class="shouqi1" class="shouqi"></ns-icon-svg>

			<!--树主体-->
			<div class="tree-body">
				<el-tree :props="treeProps" :expand-on-click-node=false :data="treeData" default-expand-all node-key="id" ref="entityTree" @node-click="nodeOnClick">
				</el-tree>			
			</div>
		</div>
	</div>
</template>
<script>
 import {getAllEntityTreeData} from '@/api/masterData/entityTree';

  export default {
    data() {
      return {
      	treeData:[],
        treeProps: {
          label: 'name',
          children: 'children'
        },
		buttonShow: false,
		buttonisShow: true,
		treeisShow: true
      };
    },
    created:function(){
    	getAllEntityTreeData({'containEntity':1}).then(response=>{
    		this.treeData=response.resultData;
    	});
    },
    methods: {
      nodeOnClick(data,node){
		 this.$emit('tree-item-click', data,node);
      },
	  	//树显示隐藏
		treeisHide() { //隐藏
			this.treeisShow = false;
			this.buttonShow = true;
			this.buttonisShow = false
		},
		treeshow() { //显示
			this.treeisShow = true;
			this.buttonisShow = true;
			this.buttonShow = false;
		},
		//更新树
		updateTree(){
	    	getAllEntityTreeData({'containEntity':1}).then(response=>{
	    		this.treeData=response.resultData;
	    	});
		}
    }
  };
</script>
<style>
	@import url("../../../../assets/css/Modular/tree/tree.css");
</style>
<style lang="scss">
	/*@import "../../../../assets/css/Modular/tree/house_tree";*/

	.el-popover {
		border-radius: 3px;
		color: #333333;
		border: 1px solid #dadada;
		box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.22) !important;
		border-radius: 4px 4px 4px 0 0 0 4px;
	}
</style>
