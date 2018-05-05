<!--主数据类型树-->
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
                                    <div class="custom-tree-content" :class="{'exitChild': item.children && item.children.length != 0,treeActive:item === objActive || item.id == selectMainDataTypeId}">
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
                                            <el-dropdown-item @click.native="showAddMainDataTypeDialog(item)">
                                                新增分类
                                            </el-dropdown-item>                            
                                            <template v-if="item.id != '-1'">
                                                <el-dropdown-item @click.native="showEditMainDataTypeDialog(item)">
                                                    编辑
                                                </el-dropdown-item>
                                            </template>
                                            <template v-if="(item.children==null||item.children.length==0)&&item.id != '-1'">
                                                <el-dropdown-item @click.native="deleteMainDataTypeNode(item)">
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

		<ns-dialog class="grid-form-dialog"  :title="mainDataTypeDialogTit" width="700px" :visible.sync="mainDataTypeDialogVisible">
			<el-form ref="mainDataTypeFormForEdit" :model="mainDataTypeFormForEdit" :rules="mainDataTypeFormRules" class="demo-form-inline"  size="mini" label-width="80px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="分类编码" prop="code">
							<el-input v-model="mainDataTypeFormForEdit.code" maxlength=25></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排序字段" prop="order">
							<el-input v-model.number="mainDataTypeFormForEdit.order"  maxlength=3></el-input>
						</el-form-item>
					</el-col>		        		
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="分类名称" prop='name'>
							<el-input v-model="mainDataTypeFormForEdit.name" maxlength=25></el-input>
						</el-form-item>						 	
					</el-col>
					<el-col :span="12">
					</el-col>		        		
				</el-row>		        		 
				<el-row :gutter="20">
					<el-col :span="24">
					<el-form-item label="备注">
						<el-input type="textarea" v-model="mainDataTypeFormForEdit.remark"  maxlength=100></el-input>
					</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addOrUpdateMainDataTypeForm" size="medium">确认</el-button>
				<el-button @click="closeMainDataTypeDialog" size="medium">取消</el-button>
			</div>
		</ns-dialog>
	</div>
</template>
<script>
import {
  getMainDataTypeTreeData,
  insertOrUpdateMainDataType,
  deleteMainDataType
} from "@/api/masterData/mainDataTree";
import SortableTree from "../SortableTree.vue";
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

      selectMainDataTypeId: null,

      mainDataTypeDialogTit: "增加主数据分类",
      mainDataTypeDialogVisible: { visible: false },

      mainDataTypeFormForEdit: {
        id: "",
        code: "",
        name: "",
        order: "",
        fatherId: "",
        remark: ""
      },
      mainDataTypeFormRules: {
        code: [{ required: true, message: "请输入分类编码", trigger: "change" }],
        name: [{ required: true, message: "请输入分类名称", trigger: "change" }],
        order: [{ type: "number", message: "请输入数字", trigger: "change" }]
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
      this.selectMainDataTypeId = item.id;
      this.searchConditions.mainDataTypeId = item.id;
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
      getMainDataTypeTreeData().then(r => {
        console.log(r.resultData[0]);
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
      console.log(arr);
      var compare = function(obj1, obj2) {
        var val1 = obj1.order;
        var val2 = obj2.order;
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
    //#####################主数据类型方法START#######################
    //显示添加主数据类型窗口
    showAddMainDataTypeDialog(item) {
      this.mainDataTypeDialogTit = "增加主数据分类";
      this.clearMainDataTypeInfo(this.mainDataTypeFormForEdit);
      this.$set(this.mainDataTypeDialogVisible, "visible", true);
    },
    //显示修改主数据类型窗口
    showEditMainDataTypeDialog(item) {
      this.mainDataTypeDialogTit = "修改主数据分类";
      this.copyMainDataTypeInfo(this.mainDataTypeFormForEdit, item);
      this.$set(this.mainDataTypeDialogVisible, "visible", true);
    },
    //关闭主数据类型表单窗口
    closeMainDataTypeDialog() {
      this.$refs["mainDataTypeFormForEdit"].resetFields();
      this.$set(this.mainDataTypeDialogVisible, "visible", false);
      this.clearMainDataTypeInfo(this.mainDataTypeFormForEdit);
    },
    //清除主数据类型信息
    clearMainDataTypeInfo(target) {
      target.id = "";
      target.code = "";
      target.name = "";
      target.fatherId = "";
      target.order = "";
      target.remark = "";
    },
    copyMainDataTypeInfo(target, source) {
      target.id = source.id;
      target.code = source.code;
      target.name = source.name;
      target.fatherId = source.fatherId;
      target.order = source.order;
      target.remark = source.remark;
    },
    //添加主数据类型
    addOrUpdateMainDataTypeForm() {
      if (this.selectMainDataTypeId == null) {
        this.$message({ message: "请选择主数据分类节点", type: "warning" });
        return;
      }
      this.$refs["mainDataTypeFormForEdit"].validate(valid => {
        if (valid) {
          if (
            this.mainDataTypeFormForEdit.id == null ||
            this.mainDataTypeFormForEdit.id == "" ||
            this.mainDataTypeFormForEdit.id == -1
          ) {
            this.mainDataTypeFormForEdit.fatherId = this.selectMainDataTypeId;
            if (this.mainDataTypeFormForEdit.fatherId == -1) {
              this.mainDataTypeFormForEdit.fatherId = 0;
            }
          }
          insertOrUpdateMainDataType(
            this.mainDataTypeFormForEdit
          ).then(response => {
            if (response.resultCode == 200) {
              this.closeMainDataTypeDialog();
              this.getTreeData(true);
            }
          });
        } else {
          return false;
        }
      });
    },
    //删除主数据类型
    deleteMainDataTypeNode(item) {
      this.$confirm("确定删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "el-message-box-oppositeBtns",
        type: "warning"
      })
        .then(() => {
          deleteMainDataType({
            id: this.selectMainDataTypeId
          }).then(response => {
            if (response.resultCode == 200) {
              if (
                response.resultMsg == null ||
                response.resultMsg == "" ||
                response.resultMsg == "操作成功。"
              ) {
                this.getTreeData(true);
                this.$message({ type: "info", message: "删除成功" });
                this.selectMainDataTypeId = null;
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
    //#####################主数据类型方法END#######################
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
