<!--实体类型树-->
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
				<div class="tree-width data-dictionary-tree">
					<div class="tree-body">
						<p class="treeTitle" ref="title">{{title}}</p>
						<sortable-tree v-loading="treeloading" element-loading-text="拼命加载中" :draggable="false" :data="treeValue.treeData" childrenAttr="children" mixinParentKey="$parent" closeStateKey="$foldClose">
							<template slot-scope="{item}">
								<!--item内容-->
                                <div @click="handleClick(item)">
                                    <div class="custom-tree-content" :class="{'exitChild': item.children && item.children.length != 0,treeActive:item === objActive || item.id == selectEntityTypeId}">
                                        <ns-icon-svg v-if="item['$foldClose'] && item.children && item.children.length>0" @click="changeState(item)" icon-class="CombinedShapeCopy1" class="tree_node_icon"></ns-icon-svg>
                                        <ns-icon-svg v-else-if="item.children ==null || item.children.length==0" @click="changeState(item)" icon-class="bushenbuzhan" class="tree_node_icon"></ns-icon-svg>
                                        <ns-icon-svg v-else @click="changeState(item)" icon-class="CombinedShape1" class="tree_node_icon"></ns-icon-svg>

                                        <span class="tree-text" :id="item.id">{{item.name}}</span>
                                    </div>
                                    <el-dropdown class="fnsicon hide" trigger="click" :hide-on-click="true" v-if="showFunction">
                                        <span class="fnsicon_svg_span">
                                            <ns-icon-svg  icon-class="gengduo" class="tree_node_icon"></ns-icon-svg>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item @click.native="showAddEntityTypeDialog(item)">
                                                新增分类
                                            </el-dropdown-item>                            
                                            <template v-if="item.id != '-1'">
                                                <el-dropdown-item @click.native="showEditEntityTypeDialog(item)">
                                                    编辑
                                                </el-dropdown-item>
                                            </template>
                                            <template v-if="(item.children==null||item.children.length==0)&&item.id != '-1'">
                                                <el-dropdown-item @click.native="deleteEntityTypeNode(item)">
                                                    删除
                                                </el-dropdown-item>                                            
                                            </template>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
							</template>
						</sortable-tree>
					</div>
				</div>
			</div>
		</div>

		<ns-dialog class="grid-form-dialog"  :title="entityTypeDialogTit" width="700px" :visible.sync="entityTypeDialogVisible">
			<el-form ref="entityTypeFormForEdit" :model="entityTypeFormForEdit" :rules="entityTypeFormRules" class="demo-form-inline"  size="mini" label-width="80px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="分类编码" prop="code">
							<el-input v-model="entityTypeFormForEdit.code" maxlength=25></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排序字段" prop="orderNum">
							<el-input v-model.number="entityTypeFormForEdit.orderNum"  maxlength=3></el-input>
						</el-form-item>
					</el-col>		        		
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="分类名称" prop='name'>
							<el-input v-model="entityTypeFormForEdit.name" maxlength=25></el-input>
						</el-form-item>						 	
					</el-col>
					<el-col :span="12">
					</el-col>		        		
				</el-row>		        		 
				<el-row :gutter="20">
					<el-col :span="24">
					<el-form-item label="备注">
						<el-input type="textarea" v-model="entityTypeFormForEdit.remark"  maxlength=100></el-input>
					</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addOrUpdateEntityTypeForm" size="medium">确认</el-button>
				<el-button @click="closeEntityTypeDialog" size="medium">取消</el-button>
			</div>
		</ns-dialog>
	</div>
</template>
<script>
import { getAllEntityTreeData } from "@/api/masterData/entityTree";
import SortableTree from "../SortableTree.vue";
import {
  addEntityType,
  deleteEntityType
} from "@/api/masterData/masterData/entityList";
export default {
  components: {
    [SortableTree.name]: SortableTree
  },
  data() {
    return {
      objActive: "", //是否选中
      loading: false,
      //树显示
      treeloading: true,
      //树数据
      treeValue: {
        //渲染数据
        treeData: {}
      },
      buttonShow: false,
      buttonisShow: true,
      treeisShow: true,

      selectEntityTypeId: null,

      entityTypeDialogTit: "增加实体分类",
      entityTypeDialogVisible: { visible: false },

      entityTypeFormForEdit: {
        id: "",
        code: "",
        name: "",
        orderNum: "",
        fatherId: "",
        remark: ""
      },
      entityTypeFormRules: {
        code: [{ required: true, message: "请输入分类编码", trigger: "change" }],
        name: [{ required: true, message: "请输入分类名称", trigger: "change" }],
        orderNum: [{ type: "number", message: "请输入数字", trigger: "change" }]
      }
    };
  },
  props: {
    title: {
      type: String
    },
    searchConditions: {
      type: Object,
      default: function() {
        return {};
      }
    },
    draggable: {
      type: Boolean,
      default: false
    },
    showFunction: {
      type: Boolean,
      default: false
    },
    "show-checkBox": {
      type: Boolean
    }
  },
  methods: {
    changeState(item, isDrag) {
      //==折叠展开操作
      this.$set(item, "$foldClose", !item["$foldClose"]);
    },
    handleClick(item) {
      this.objActive = item;
      this.selectEntityTypeId = item.id;
      this.searchConditions.entityTypeId = item.id;
      this.$emit("tree-item-click");
    },
    getTreeData(isFirst) {
      //获取树数据
      this.treeloading = true;
      if (isFirst) {
        this.searchConditions.treeConditions = [
          {
            comparison: "LIKE",
            fieldName: "path",
            fieldValue: "/",
            type: "text"
          }
        ];
      }
      getAllEntityTreeData({ containEntity: 0 }).then(r => {
		this.treeValue.treeData = r.resultData[0];
		this.sortTree(this.treeValue.treeData.children);
        this.treeloading = false;
        
      });
    },
    //树显示隐藏
    treeisHide() {
      //隐藏
      this.treeisShow = false;
      this.buttonShow = true;
      this.buttonisShow = false;
    },
    treeshow() {
      //显示
      this.treeisShow = true;
      this.buttonisShow = true;
      this.buttonShow = false;
    },
    sortTree(treeData) {
      //根据树节点的编码对树节点进行排序
      var arr = treeData;
      //console.log(arr);
      var compare = function(obj1, obj2) {
        var val1 = obj1.orderNum;
        var val2 = obj2.orderNum;
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
	  };
	  arr.sort(compare);
      //console.log(arr.sort(compare));
      for (var a = 0; a < arr.length; a++) {
        //console.log(arr[a].children != null);
        if (arr[a].children != null) {this.sortTree(arr[a].children);}
      }
    },
    //#####################实体类型方法START#######################
    //显示添加实体类型窗口
    showAddEntityTypeDialog(item) {
      this.entityTypeDialogTit = "增加实体分类";
      this.clearEntityTypeInfo(this.entityTypeFormForEdit);
      this.$set(this.entityTypeDialogVisible, "visible", true);
    },
    //显示修改实体类型窗口
    showEditEntityTypeDialog(item) {
      this.entityTypeDialogTit = "修改实体分类";
      this.copyEntityTypeInfo(this.entityTypeFormForEdit, item);
      this.$set(this.entityTypeDialogVisible, "visible", true);
    },
    //关闭实体类型表单窗口
    closeEntityTypeDialog() {
      this.$refs["entityTypeFormForEdit"].resetFields();
      this.$set(this.entityTypeDialogVisible, "visible", false);
      this.clearEntityTypeInfo(this.entityTypeFormForEdit);
    },
    //清除实体类型信息
    clearEntityTypeInfo(target) {
      target.id = "";
      target.code = "";
      target.name = "";
      target.fatherId = "";
      target.orderNum = "";
      target.remark = "";
    },
    copyEntityTypeInfo(target, source) {
      target.id = source.id;
      target.code = source.code;
      target.name = source.name;
      target.fatherId = source.fatherId;
      target.orderNum = source.orderNum;
      target.remark = source.remark;
    },
    //添加实体类型
    addOrUpdateEntityTypeForm() {
      if (this.selectEntityTypeId == null) {
        this.$message({ message: "请选择实体分类节点", type: "warning" });
        return;
      }
      this.$refs["entityTypeFormForEdit"].validate(valid => {
        if (valid) {
          if (
            this.entityTypeFormForEdit.id == null ||
            this.entityTypeFormForEdit.id == "" ||
            this.entityTypeFormForEdit.id == -1
          ) {
            this.entityTypeFormForEdit.fatherId = this.selectEntityTypeId;
            if (this.entityTypeFormForEdit.fatherId == -1) {
              this.entityTypeFormForEdit.fatherId = 0;
            }
          }
          addEntityType(this.entityTypeFormForEdit).then(response => {
            if (response.resultCode == 200) {
              this.closeEntityTypeDialog();
              this.getTreeData(true);
            }
          });
        } else {
          return false;
        }
      });
    },
    //删除实体类型
    deleteEntityTypeNode(item) {
      this.$confirm("确定删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "el-message-box-oppositeBtns",
        type: "warning"
      })
        .then(() => {
          deleteEntityType({ id: this.selectEntityTypeId }).then(response => {
            if (response.resultCode == 200) {
              if (
                response.resultMsg == null ||
                response.resultMsg == "" ||
                response.resultMsg == "操作成功。"
              ) {
                this.getTreeData(true);
                this.$message({ type: "info", message: "删除成功" });
                this.selectEntityTypeId = null;
              } else {
                this.$message({ type: "info", message: response.resultMsg });
              }
            }
          });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    }
    //#####################实体类型方法END#######################
  },
  created() {
    this.getTreeData(true);
  }
};
</script>
<style rel="stylesheet/less" lang="scss">
.tree-width {
  .el-popover {
    min-width: 93px !important;
    border-radius: 3px;
    color: #333333 !important;
    border: 1px solid #dadada;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.22) !important;
    border-radius: 4px 4px 4px 0 0 0 4px;
  }
  .ns-svg-icon {
    height: 14px;
    line-height: 15px;
  }
  .tree-body {
    overflow-x: hidden;
    overflow-y: auto;
    padding-left: 10px;
    margin-right: 10px;
  }
}
</style>
<style scoped="">
@import url("../../../../assets/css/Modular/tree/tree.css");
</style>
