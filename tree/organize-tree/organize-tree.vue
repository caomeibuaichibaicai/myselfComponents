<template>
  <div>
    <!--树显示按钮-->
    <ns-icon-svg v-if="buttonShow" @click="treeshow" icon-class="hj" class="zhankai"></ns-icon-svg>
    <div v-if="treeisShow" class="tree-width">
      <!--树搜索框-->
      <ns-icon-svg @mouseup.native.stop="" icon-class="sousuo" class="tree-search-icon tree_node_icon"></ns-icon-svg>
      <el-select v-model="treeInput"
                 :clearable="true"
                 :reserve-keyword="true"
                 @change="changeData"
                 filterable
                 remote
                 placeholder="请输入关键词"
                 class="tree-search"
                 size="small"
                 :remote-method="remoteMethod"
                 :loading="loading"
                 :loading-text="searchTip">
        <el-option v-for="(item,index) in options" :key="index" :label="item.organizationName"
                   :value="item.organizationId"></el-option>
      </el-select>
      <div class="tree-line"></div>
      <!--树隐藏按钮-->
      <ns-icon-svg v-if="buttonisShow" @click="treeisHide" icon-class="shouqi1" class="shouqi"></ns-icon-svg>

      <!--树主体-->
      <div class="tree-body">
        <p class="treeTitle" ref="title">{{title}}</p>
        <sortable-tree v-loading="treeloading" element-loading-text="拼命加载中" :data="treeValue.treeData"
                       childrenAttr="childOrganizations" :draggable="draggable" mixinParentKey="$parent"
                       @changePosition="changePosition" :dragEnable="true" closeStateKey="$foldClose">
          <template slot-scope="{item}">
            <!--item内容-->
            <div class="custom-tree-content"
                 :class="{'exitChild': item.childOrganizations && item.childOrganizations.length,treeActive:item===objActive || item.organizationId===initIndex}">
              <ns-icon-svg v-if="item['$foldClose'] &&  item['isHasChild'] && item.childOrganizations"
                           @click="changeState(item)" icon-class="CombinedShapeCopy1"
                           class="tree_node_icon"></ns-icon-svg>
              <ns-icon-svg v-else-if="!item['$foldClose'] && item['isHasChild'] && item.childOrganizations.length"
                           @click="changeState(item)" icon-class="CombinedShape1" class="tree_node_icon"></ns-icon-svg>
              <ns-icon-svg v-else-if="!item['$foldClose'] && item['isHasChild'] " @click="changeState(item)"
                           icon-class="CombinedShapeCopy1" class="tree_node_icon"></ns-icon-svg>
              <ns-icon-svg v-else @click="changeState(item)" icon-class="bushenbuzhan"
                           class="tree_node_icon"></ns-icon-svg>
              <span class="tree-text" :id="item.organizationId"
                    @click="handleClick(item)">{{item.organizationName}}</span>
            </div>
            <el-dropdown class="fnsicon hide" trigger="click" :hide-on-click="true" v-if="showFunction">
							<span class="fnsicon_svg_span">
								<ns-icon-svg icon-class="gengduo" class="tree_node_icon"></ns-icon-svg>
							</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="treeEdit(item)">
                  编辑
                </el-dropdown-item>
                <el-dropdown-item v-if="item.isHasChild==false" @click.native="treeDelete(item)">
                  <el-popover placement="bottom" width="142" trigger="click">
                    <p>这是一段内容这是一段内容确定删除吗？</p>
                    <div style="text-align: center; margin: 0;padding-top: 8px;">
                      <el-button class="delete-sure" type="primary" size="mini" @click.native="treeDelete(item)">确定
                      </el-button>
                      <el-button class="delete-cancel" size="mini" type="text" @click="cancel">取消</el-button>
                    </div>
                    <span slot="reference">删除</span>
                  </el-popover>
                </el-dropdown-item>
                <template>
                  <el-dropdown-item divided>
                    <p class="addChildre">新增子节点</p>
                  </el-dropdown-item>
                  <template v-if="item.organizationType==0||item.organizationType==1">
                    <el-dropdown-item @click.native="fnclick(item,'company')">
                      <ns-icon-svg icon-class="dian-copy"></ns-icon-svg>
                      新建子公司
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="fnclick(item,'department')">
                      <ns-icon-svg icon-class="dian-copy"></ns-icon-svg>
                      新建部门
                    </el-dropdown-item>
                  </template>
                  <template v-else-if="item.organizationType!==0&&item.organizationType!==1">
                    <el-dropdown-item @click.native="fnclick(item,'department')">
                      <ns-icon-svg icon-class="dian-copy"></ns-icon-svg>
                      新建子部门
                    </el-dropdown-item>
                  </template>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </sortable-tree>
      </div>
      <!--新建编辑子公司-->
      <add-or-edit-company
        :type="companyDialogObj.type"
        :visible="companyDialogObj.visible"
        :nodeInfo="companyDialogObj.nodeInfo"
        :parentNodeInfo="companyDialogObj.parentNodeInfo"
        @query="getTreeData"
        v-if="companyDialogObj.visible.visible"
      ></add-or-edit-company>
      <!--部门编辑弹出框-->
      <add-or-edit-department
        :type="departmentDialogObj.type"
        :visible="departmentDialogObj.visible"
        :nodeInfo="departmentDialogObj.nodeInfo"
        :parentNodeInfo="departmentDialogObj.parentNodeInfo"
        @query="getTreeData"
        v-if="departmentDialogObj.visible.visible"
      ></add-or-edit-department>
      <!-- 集团弹窗 -->
      <group-Dialog 
        v-if="groupDialogObj.visible.visible"
        :visible="groupDialogObj.visible"
        :nodeInfo="groupDialogObj.nodeInfo"
      />
    </div>
  </div>
</template>
<script>
import {
  treeCompanyOpen,
  treeDepartmentOpen,
  changeData,
  getInputData,
  treeOpen,
  treeDrag,
  treeDataFetch,
  companyEdit,
  departmentAdd,
  departmentEdit,
  companyDetail,
  departmentDetail,
  companyDelete,
  departmentDelete
} from "@/api/organize-tree";
import SortableTree from "../SortableTree.vue";
import addOrEditCompany from "./organize-dialogs/company.vue";
import addOrEditDepartment from "./organize-dialogs/department.vue";
import groupDialog from "./organize-dialogs/group.vue";

export default {
  components: {
    SortableTree,
    addOrEditCompany,
    addOrEditDepartment,
    groupDialog
  },
  data() {
    return {
      buttonShow: false,
      buttonisShow: true,
      treeisShow: true,
      initIndex: 0,
      objActive: "", //是否选中
      //部门节点信息
      departmentOptions: [
        {
          //部门类型
          label: "服务中心",
          value: 0
        },
        {
          label: "职能中心",
          value: 1
        }
      ],
      groupDialogObj: {
        visible: {
          visible: false
        },
        nodeInfo: {}
      },
      //公司dialog信息
      companyDialogObj: {
        type: "",
        visible: {
          visible: false
        },
        parentNodeInfo: {
          organizationName: "",
          organizationId: ""
        },
        nodeInfo: {}
      },
      //部门dialog信息
      departmentDialogObj: {
        type: "",
        visible: {
          visible: false
        },
        parentNodeInfo: {
          organizationName: "",
          organizationId: ""
        },
        nodeInfo: {}
      },
      searchTip: "搜索数据中...",
      loading: false,
      options: [],
      //树显示
      treeNum: "",
      treeContent: "",
      oldtreeNum: "-1",
      showNum: -1,
      index: 1,
      treeInput: "",
      treeloading: true,

      //树数据
      treeValue: {
        //渲染数据
        treeData: {},
        //备份数据-用于返回上一状态
        saveValue: {}
      }
    };
  },
  props: {
    title: {
      type: String
    },
    searchConditions: {
      type: Object,
      default() {
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
    },
    orgTypeFilter: null
  },
  methods: {
    checked(scope) {
      if (
        $("#" + scope.idTree)
          .closest(".custom-tree-content")
          .find(".bool-checked")
          .hasClass("is-checked")
      ) {
        $("#" + scope.idTree)
          .closest(".sortable-tree")
          .find(".bool-checked")
          .removeClass("is-checked");
      } else {
        $("#" + scope.idTree)
          .closest(".sortable-tree")
          .find(".bool-checked")
          .addClass("is-checked");
      }
      if (scope.$parent) {
        $(".blank-li .el-checkbox__input").removeClass("is-checked");
        $(".blank-li .el-checkbox__input").removeClass("bool-checked");
        var objScope = scope.$parent;
        while (objScope) {
          if (
            $("#" + objScope.idTree)
              .closest(".sortable-tree")
              .find("ul .is-checked").length ==
            $("#" + objScope.idTree)
              .closest(".sortable-tree")
              .find("ul .bool-checked").length
          ) {
            $("#" + objScope.idTree)
              .closest(".custom-tree-content")
              .find(".bool-checked")
              .addClass("is-checked");
          } else {
            $("#" + objScope.idTree)
              .closest(".custom-tree-content")
              .find(".bool-checked")
              .removeClass("is-checked");
          }
          objScope = objScope.$parent;
        }
      }
    },

    //树显示隐藏
    treeisHide() {
      //隐藏
      this.treeisShow = false;
      this.buttonShow = true;
      this.buttonisShow = false;
    },
    //树显示
    treeshow() {
      this.treeisShow = true;
      this.buttonisShow = true;
      this.buttonShow = false;
    },
    //樹搜索
    changeData(val) {
      if (val) {
        changeData({
          organizationId: val
        }).then(r => {
          this.treeValue.treeData = r.resultData;
          this.treeValue.saveValue = JSON.parse(JSON.stringify(r.resultData));
        });
      } else {
        this.treeDataHandle();
      }
    },
    //树搜索输入触发查询
    remoteMethod(query) {
      this.searchTip = "搜索数据中...";
      if (query !== "") {
        this.loading = true;
        getInputData({
          organizationName: query
        })
          .then(r => {
            this.loading = false;
            this.options = r.resultData;
          })
          .catch(err => {
            this.searchTip = "服务器出错";
          });
      } else {
        this.options = [];
      }
    },

    //拖动树结构触发
    changePosition(opts) {
      let datas = {
        organizationId: opts.data.organizationId,
        organizationParentId: opts.afterParent.organizationId,
        sort: 0,
        sortOrganizationIds: []
      };
      //得道插入后上一个元素的organizationId sort
      for (let i = 0; i < opts.afterParent.childOrganizations.length; i++) {
        datas.sortOrganizationIds.push(
          opts.afterParent.childOrganizations[i].organizationId
        );
        if (
          opts.afterParent.childOrganizations[i].organizationId ===
            opts.data.organizationId &&
          i > 0
        ) {
          datas.sort =
            opts.afterParent.childOrganizations[i - 1].organizationId;
        }
      }
      treeDrag(datas).then(r => {
        if (r.resultData.result) {
          //允许添加的情况
          //需要展开图标和切换icon
          if (
            opts.afterParent.childOrganizations.length === 1 &&
            opts.afterParent.isHasChild
          ) {
            this.changeState(opts.afterParent, true);
          } else {
            opts.afterParent.isHasChild = true;
          }
          if (opts.beforeParent.childOrganizations.length === 0) {
            opts.beforeParent.isHasChild = false;
          }
          this.treeValue.saveValue = JSON.parse(
            JSON.stringify(this.treeValue.treeData)
          );
        } else {
          //不允许添加的情况，返回上一步树结构
          this.treeValue.treeData = this.treeValue.saveValue;
          this.$message({
            message: r.resultData.message,
            type: "warning"
          });
        }
      });
    },
    treeDataHandle(isFirst) {
      //==树数据处理
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
      const query = {};
      if (this.orgTypeFilter) {
        Object.assign(query, { orgType: this.orgTypeFilter });
      }
      //树数据--请求
      treeDataFetch(query).then(r => {
        //树数据--更新数据
        this.treeValue.treeData = r.resultData;
        this.treeValue.saveValue = JSON.parse(JSON.stringify(r.resultData));
        this.treeloading = false;
      });
    },
    //折叠展开操作
    changeState(item, isDrag) {
      if (isDrag) {
        //拖动树节点时需要展开，触发
        treeOpen({
          organizationId: item.organizationId
        }).then(r => {
          this.$set(item, "childOrganizations", r.resultData);
          this.treeValue.saveValue = JSON.parse(
            JSON.stringify(this.treeValue.treeData)
          );
        });
      } else {
        if (item.isHasChild && item.childOrganizations.length == 0) {
          //请求条件
          const query = { organizationId: item.organizationId };
          if (this.orgTypeFilter) {
            Object.assign(query, { orgType: this.orgTypeFilter });
          }

          if (item.organizationType !== 0 && item.organizationType !== 1) {
            treeDepartmentOpen(query).then(r => {
              this.$set(item, "childOrganizations", r.resultData);
              this.treeValue.saveValue = JSON.parse(
                JSON.stringify(this.treeValue.treeData)
              );
            });
          } else {
            treeCompanyOpen(query).then(r => {
              this.$set(item, "childOrganizations", r.resultData);
              this.treeValue.saveValue = JSON.parse(
                JSON.stringify(this.treeValue.treeData)
              );
            });
          }
        } else if (item.isHasChild && item.childOrganizations.length > 0) {
          this.$set(item, "$foldClose", !item["$foldClose"]);
        }
      }
    },
    //树删除操作
    treeDelete(item) {
      this.$refs.title.click();
      if (item.organizationType !== 0 && item.organizationType !== 1) {
        //删除部门节点
        departmentDelete({
          organizationId: item.organizationId
        }).then(r => {
          this.$message({
            message: r.resultMsg,
            type: "success"
          });
          this.getTreeData();
        });
      } else {
        //删除公司节点
        companyDelete({
          organizationId: item.organizationId
        }).then(r => {
          this.$message({
            message: r.resultMsg,
            type: "success"
          });
          this.getTreeData();
        });
      }
    },
    fnclick(item, orgType) {
      //新增功能
      // debugger;
      this.$refs.title.click();
      if (orgType == "department") {
        this.departmentDialogObj.type = "add";
        this.departmentDialogObj.parentNodeInfo = item;
        this.departmentDialogObj.visible.visible = true;
      } else if (orgType == "company") {
        this.companyDialogObj.type = "add";
        this.companyDialogObj.parentNodeInfo = item;
        this.companyDialogObj.visible.visible = true;
      }
    },
    cancel() {
      this.$refs.title.click();
    },
    //树编辑
    treeEdit(item) {
      this.companyDialogObj.parentNodeInfo = item.$parent;
      this.companyDialogObj.nodeInfo = item;
      this.groupDialogObj.nodeInfo = item;
      this.departmentDialogObj.parentNodeInfo = item.$parent;
      this.departmentDialogObj.nodeInfo = item;
      this.$refs.title.click();
      if (item.organizationType == 2) {
        //部门
        this.departmentDialogObj.type = "edit";
        this.departmentDialogObj.visible.visible = true;
      } else if (item.organizationType == 1) {
        //公司
        this.companyDialogObj.type = "edit";
        this.companyDialogObj.visible.visible = true;
      } else if (item.organizationType == 0) {
        //集团
        this.groupDialogObj.visible.visible = true;
      }
    },
    handleClick(item) {
      this.objActive = item;
      this.initIndex = item.organizationId;
      this.index = item;
      if (item.organizationId) {
        this.searchConditions.organizationId = item.organizationId;
        this.searchConditions.companyId = item.companyId;
        this.searchConditions.departmentId = item.departmentId;
      }
      this.searchConditions.mainSearch = "";
      this.$emit("handle-click");
      this.$emit("tree-item-click", item);
    },
    //获取树数据
    getTreeData(isFirst) {
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
      const query = {};
      if (this.orgTypeFilter) {
        Object.assign(query, { orgType: this.orgTypeFilter });
      }
      treeDataFetch(query).then(r => {
        this.treeValue.treeData = r.resultData;
        this.treeValue.saveValue = JSON.parse(JSON.stringify(r.resultData));
        //默认选中第一项
        this.initIndex = r.resultData.organizationId;
        this.$emit("handle-click", null, true);
        this.$emit("tree-item-click", r.resultData);
        this.searchConditions.organizationId = r.resultData.organizationId;
        this.searchConditions.companyId = r.resultData.companyId;
        this.searchConditions.departmentId = r.resultData.departmentId;
        this.treeloading = false;
      });
    }
  },
  created() {
    //树数据初始化
    this.getTreeData(true);
  }
};
</script>
<style>

</style>
<style scoped="">
@import url("../../../../assets/css/Modular/tree/tree.css");
</style>
