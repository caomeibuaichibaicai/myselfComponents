<template>
	<div class="grid-body-wrapper">
		<div class="grid-body">
			<div ref="el-table-wrap" v-loading="loading.value" element-loading-text="拼命加载中">
				<el-table :data="gridData.data" :border="border" height="500" :max-height="maxHeight" :stripe="stripe" :fit="fit" :show-header="showHeaders" :highlight-current-row="highlightCurrentRow" :current-row-key="currentRowKey" :row-class-name="rowClassName" :row-style="rowStyle" :row-key="rowKey" :empty-text="emptyText" :default-expand-all="defaultExpandAll" :expand-row-keys="expandRowKeys" :default-sort="defaultSort" :tooltip-effect="tooltipEffect" :show-summary="showSummary" :sum-text="sumText" :summary-method="summaryMethod" @select="select" @select-all="selectAll" @selection-change="selectionChange" @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave" @cell-click="cellClick" @cell-dblclick="cellDblclick" @row-click="rowClick" @row-contextmenu="rowContextmenu" @row-dblclick="rowDblclick" @header-click="headerClick" @sort-change="sortChange" @filter-change="filterChange" @header-dragend="headerDragend" @expand-change="expand">
					<!--多选框列-->
					<el-table-column :type="type" width="60" :fixed="gridData.data.length!=0"></el-table-column>
					<!--动态列-->
          <el-table-column :column-key="columnKey" sortable="custom" :sort-method="sortMethod" :resizable="resizable"
                           :formatter="formatter" :show-overflow-tooltip="showOverflowTooltip"
                           :align="align" :header-align="headerAlign" :class-name="className"
                           :label-class-name="labelClassName" :selectable="selectable"
                           :reserve-selection="reserveSelection" :filters="filters"
                           :filter-placement="filterPlacement" :filter-multiple="filterMultiple"
                           :filter-method="filterMethod" :filtered-value="filteredValue"
                           :key="index" v-for="(item,index) in header"
                           :width="item.resourcecolumnWidth || 180" :class="{noBorderR:index==ithlockedNum+1}"
                           :fixed="index<ithlockedNum" :prop="item.resourcecolumnCode"
                           :label="item.resourcecolumnName" v-if="item.resourcecolumnHidden">
						<template slot-scope="scope">
							<!--筛选列-->
							<template v-if="scope.$index==0 && isThFirstShow.isbool">
								<div class="filter-column">
									<div class="filter-ipt-wrap">
										<el-select size="small" v-if="item.resourcecolumnXtype==='select'" v-model="searchData[item.resourcecolumnCode]">
											<el-option @click.native="conditionData(index,item.resourcecolumnCode,item.resourcecolumnName,item.resourcecolumnXtype,items.label)" v-for="(items,index) in item.selectList" :key="index" :label="items.label" :value="items.value">
											</el-option>
										</el-select>
										<el-input size="small" v-model="searchData[item.resourcecolumnCode]" v-else-if="item.resourcecolumnXtype==='text'" @keyup.enter.native="conditionData(index,item.resourcecolumnCode,item.resourcecolumnName,item.resourcecolumnXtype)"></el-input>
										<el-input size="small" v-model="searchData[item.resourcecolumnCode]" v-else-if="item.resourcecolumnXtype==='number'" @keyup.enter.native="conditionData(index,item.resourcecolumnCode,item.resourcecolumnName,item.resourcecolumnXtype)"></el-input>
										<el-date-picker size="small" v-model="searchData[item.resourcecolumnCode]" v-else-if="item.resourcecolumnXtype==='date'" @change="conditionData(index,item.resourcecolumnCode,item.resourcecolumnName,item.resourcecolumnXtype)"></el-date-picker>
										<ul class="list-menu" v-show="index==ishowListMenu">
											<template v-if="item.resourcecolumnXtype==='select'">
												<li v-for="item in filterList[item.resourcecolumnXtype]" @click="filterStatus($event,index,item.value,item.label)">{{item.label}}</li>
											</template>
											<template v-else-if="item.resourcecolumnXtype==='text'">
												<li v-for="item in filterList[item.resourcecolumnXtype]" @click="filterStatus($event,index,item.value,item.label)">{{item.label}}</li>
											</template>
											<template v-else-if="item.resourcecolumnXtype==='number'">
												<li v-for="item in filterList[item.resourcecolumnXtype]" @click="filterStatus($event,index,item.value,item.label)">{{item.label}}</li>
											</template>
											<template v-else-if="item.resourcecolumnXtype==='date'">
												<li v-for="item in filterList[item.resourcecolumnXtype]" @click="filterStatus($event,index,item.value,item.label)">{{item.label}}</li>
											</template>
										</ul>
									</div>
								</div>
							</template>

							<template v-else-if="item.resourcecolumnCode==='houseShortName'">
								<div class="td-click-txt" :title="scope.row[item.resourcecolumnCode]" @click="houseView(scope)">{{scope.row[item.resourcecolumnCode]}}</div>
							</template>
							<template v-else-if="item.resourcecolumnCode==='houseName'">
								<div class="td-click-txt" :title="scope.row[item.resourcecolumnCode]" @click="houseView(scope)">{{scope.row[item.resourcecolumnCode]}}</div>
							</template>
							<template v-else-if="item.resourcecolumnCode==='ownerName'">
								<div class="td-click-txt" :title="scope.row[item.resourcecolumnCode]" @click="ownerView(scope.row.ownerId)">{{scope.row[item.resourcecolumnCode]}}</div>
							</template>
							<template v-else-if="item.resourcecolumnCode==='lesseeName'">
								<div class="td-click-txt" :title="scope.row[item.resourcecolumnCode]" @click="ownerView(scope.row.lesseeId)">{{scope.row[item.resourcecolumnCode]}}</div>
							</template>
							<template v-else>
								<div class="td-txt" :title="scope.row[item.resourcecolumnCode]">{{scope.row[item.resourcecolumnCode]}}</div>
							</template>
						</template>
					</el-table-column>
					<!--操作列-->
					<el-table-column label="操作" v-if="gridData.data.length>0" fixed="right" min-width="170px">
						<template slot-scope="scope" v-if="(!totalButtonFlag || scope.$index != gridData.data.length-1)">

							<template v-if="scope.$index ==0 && isThFirstShow.isbool">
								<ns-icon-svg icon-class="guanbi" class="chacha" @click="tableSearch()"></ns-icon-svg>
							</template>
							<template v-else-if="scope.row.fnsclick">
								<el-button @click="fnclick(scope.row.fnsclick[0],scope)" type="text">{{scope.row.fnsclick[0].label}}</el-button>
								<el-button v-if="scope.row.fnsclick.length === 2" @click="fnclick(scope.row.fnsclick[1],scope)" type="text">{{scope.row.fnsclick[1].label}}</el-button>
								<el-dropdown trigger="click" class="down" v-if="scope.row.fnsclick.length>2">
									<span class="el-button--text down_square">
								    更多<ns-icon-svg icon-class="down-square"></ns-icon-svg>
							  </span>
									<el-dropdown-menu slot="dropdown" class="grid_dropdown_menu">
										<el-dropdown-item v-for="(item,index) in scope.row.fnsclick" v-if="index>0" :key="index" @click.native="fnclick(item,scope)">
											{{item.label}}
										</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</template>
						</template>
					</el-table-column>

				</el-table>
				<!--右上角设置-->
				<div class="table-set" v-if="gridData.data.length>0 && headerEdit.length>0">
					<div class="setUp" @click.stop="showtableSetfn">
						<ns-icon-svg icon-class="shezhi-"></ns-icon-svg>
					</div>
					<div class="pf8" @click.stop="tableSearch()">
						<ns-icon-svg icon-class="unfold"></ns-icon-svg>
					</div>
					<!--下拉设置列序、隐显-->
					<div class="set-content" v-show="isShowtableSet" @click.stop>
						<ul class="set-content-ul">
							<draggable v-model="headerEdit" :options="{disabled:isLocked}" @start="drag=true" @end="drag=false">
								<li v-for="(item,index) in headerEdit" :key="index">
									<el-checkbox v-model="item.resourcecolumnHidden">{{item.resourcecolumnName}}</el-checkbox>
									<ns-icon-svg icon-class="suo" class="locked hideImportant" @click.native="lock($event,index)"></ns-icon-svg>
									<ns-icon-svg icon-class="suoopen" class="lock hide" @click.native="lock($event,index)"></ns-icon-svg>
								</li>
							</draggable>
						</ul>
						<el-button type="primary" @click="tablecheckList" class="set-sure">确定</el-button>
					</div>
				</div>
				<!--合计按钮-->
				<div class="totalButton" v-if="totalButtonSwitch.visible && totalButtonFlag && !loading.value && errorType.value == 'normal'">
					<total-button :searchConfig="searchConditions" :funcId="funcId" :totalData="gridData.data[gridData.data.length-1]" @query="totalQuery">
					</total-button>
				</div>
				<!--无数据提示部分-->
				<div class="prompt" v-if="errorType.value==='noData'">
					<img src="../../../assets/img/error/null.png">
					<p>
						<span>暂无数据，</span>
						<span class="prompt_addBtn" @click="">去新增</span>
					</p>
				</div>
				<div class="prompt" v-else-if="errorType.value==='noResult'">
					<img src="../../../assets/img/error/searchNone.png">
					<p>抱歉,没有搜索到你要的结果</p>
				</div>
				<div class="errorPrompt" v-else-if="errorType.value==='error'">
					<div class="error_content">
						<img class="error_img" src="../../../assets/img/error/error.png" />
						<div class="error_tip">
							<p>服务器出错</p>
							<span>蛋定！伸个懒腰喝杯水，过会再试试吧！</span>
							<div class="errorBtns">
								<el-button type="primary" @click="getHeader()">刷新试试</el-button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="clearfix"></div>

		</div>
		<!--分页器-->
		<div class="panel-page" v-show="errorType.value!=='error' && errorType.value!=='noResult' && errorType.value!=='noData' && gridData.data.length>0">
			<el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="searchConditions.pageNum" :page-sizes="pageSizes" :page-size="searchConditions.pageSize" :layout="layout" :total="total">
				<span class="page">共{{total}}条/{{total / searchConditions.pageSize | MathCeil}}页</span>
			</el-pagination>
			<el-button class="page-btn" size="medium">确定</el-button>
		</div>
	</div>

</template>

<script>
import draggable from "vuedraggable";
import { tableHeaderFetch } from "../../../api/ns-search";
import * as store from "@/utils/nsQuery/nsStore";
import totalButton from "./gridTotalButton";
import EventHub from "@/utils/eventHub/eventHub.js";
import roleButtonMap from "@/static-data/role/role-button-list/index.js";
import handelGridButtons from './gridPermissionButton';

export default {
  components: {
    draggable,
    totalButton
  },
  data() {
    return {
      roleGridBtnList: roleButtonMap.GRID, //表格按钮权限列表
      showHeaders: true,
      totalButtonFlag: false,
      headSelectHandle: [],
      itemOwnerId: store.ownerId.set(), //ownerId
      itemHouseId: "",
      itemHouseType: "",
      lockedNum: -1,
      //表头锁到第几个
      ithlockedNum: -1,
      //显示过滤状态位置
      ishowListMenu: -1,
      /*点击更多时，判断依据*/
      isCount: -1,
      //判断table列显示内容
      isShowtableSet: false,
      //是否锁着
      isLocked: false,
      isLockNum: -1,
      header: [],
      headerEdit: [],
      houseDetailVisible: {
        visible: false
      },
      ownerDetailVisible: {
        visible: false
      },
      //过滤状态
      filterList: {
        text: [
          {
            value: "LIKE",
            label: "包含"
          },
          {
            value: "NOT_LIKE",
            label: "不包含"
          },
          {
            value: "NULL",
            label: "空"
          },
          {
            value: "NOT_NULL",
            label: "不为空"
          }
        ],
        number: [
          {
            value: "EQUAL",
            label: "等于"
          },
          {
            value: "GREATER_THAN",
            label: "大于"
          },
          {
            value: "LESS_THAN",
            label: "小于"
          },
          {
            value: "GREATER_EQUAL_THAN",
            label: "大于等于"
          },
          {
            value: "LESS_EQUAL_THAN",
            label: "小于等于"
          }
        ],
        select: [
          {
            value: "EQUAL",
            label: "等于"
          }
        ],
        date: [
          {
            value: "EQUAL",
            label: "等于"
          },
          {
            value: "GREATER_THAN",
            label: "大于"
          },
          {
            value: "LESS_THAN",
            label: "小于"
          },
          {
            value: "GREATER_EQUAL_THAN",
            label: "大于等于"
          },
          {
            value: "LESS_EQUAL_THAN",
            label: "小于等于"
          }
        ]
      }
    };
  },
  watch: {
    "totalButtonSwitch.visible"(val) {
      if (val) {
        //  			debugger
      }
    }
  },
  props: {
    totalButtonSwitch: {
      type: Object,
      default() {
        return {
          visible: false
        };
      }
    },
    funcId: {
      type: [Number, String]
    },
    /*Table Attributes*/
    //是否显示第一行
    isThFirstShow: {
      type: Object,
      default() {
        return {
          isbool: false
        };
      }
    },
    loading: {
      type: Object,
      default() {
        return {
          value: true
        };
      }
    },
    //显示的数据
    gridData: {
      type: Object,
      default() {
        return {
          data: []
        };
      }
    },
    //Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则 Table 的高度受控于外部样式
    height: {
      type: [String, Number]
    },
    //Table 的最大高度
    "max-height": {
      type: [String, Number]
    },
    //是否为斑马纹 table
    stripe: {
      type: Boolean,
      default: false
    },
    //是否带有纵向边框
    border: {
      type: Boolean,
      default: true
    },
    //列的宽度是否自撑开
    fit: {
      type: Boolean,
      default: true
    },
    //是否显示表头
    "show-header": {
      type: Boolean,
      default: true
    },
    //是否要高亮当前行
    "highlight-current-row": {
      type: Boolean,
      default: false
    },
    //当前行的 key，只写属性
    "current-row-key": {
      type: [String, Number]
    },
    //行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
    "row-class-name": {
      type: [String, Function]
    },
    //行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。
    "row-style": {
      type: [Object, Function]
    },
    //行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能的情况下，该属性是必填的。
    //类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。
    "row-key": {
      type: [String, Function]
    },
    //空数据时显示的文本内容，也可以通过 slot="empty" 设置
    "empty-text": {
      type: String,
      default: "暂无数据"
    },
    //是否默认展开所有行，当 Table 中存在 type="expand" 的 Column 的时候有效
    "default-expand-all": {
      type: Boolean,
      default: false
    },
    //可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
    "expand-row-keys": {
      type: Array
    },
    //默认的排序列的prop和顺序。它的prop属性指定默认的排序的列，order指定默认排序的顺序
    //order: ascending, descending如果只指定了prop, 没有指定order, 则默认顺序是ascending
    "default-sort": {
      type: Object
    },
    //tooltip effect 属性dark/light
    "tooltip-effect": {
      type: String
    },
    //是否在表尾显示合计行
    "show-summary": {
      type: Boolean,
      default: false
    },
    //合计行第一列的文本
    "sum-text": {
      type: String,
      default: "合计"
    },
    //自定义的合计计算方法
    "summary-method": {
      type: Function
    },
    /*Table-column Attributes*/
    //对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮
    type: {
      type: String,
      default: "selection"
    },
    //column 的 key，如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件
    "column-key": {
      type: String
    },
    //对应列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列
    "min-width": {
      type: String
    },
    //对应列是否可以排序，如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件
    sortable: {
      type: [Boolean, String],
      default: true
    },
    //对数据进行排序的时候使用的方法，仅当 sortable 设置为 true 的时候有效，需返回一个布尔值
    "sort-method": {
      type: Function
    },
    //对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真）
    resizable: {
      type: Boolean,
      default: true
    },
    //用来格式化内容
    formatter: {
      type: Function
    },
    //当内容过长被隐藏时显示 tooltip
    "show-overflow-tooltip": {
      type: Boolean,
      default: false
    },
    //对齐方式left/center/right
    align: {
      type: String,
      default: "left"
    },
    //表头对齐方式，若不设置该项，则使用表格的对齐方式left/center/right
    "header-align": {
      type: String
    },
    //列的 className
    "class-name": {
      type: String
    },
    //当前列标题的自定义类名
    "label-class-name": {
      type: String
    },
    //仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
    selectable: {
      type: Function
    },
    //仅对 type=selection 的列有效，类型为 Boolean，为 true 则代表会保留之前数据的选项，需要配合 Table 的 clearSelection 方法使用。
    "reserve-selection": {
      type: Boolean,
      default: false
    },
    //数据过滤的选项，数组格式，数组中的元素需要有 text 和 value 属性。
    filters: {
      type: Array
    },
    //过滤弹出框的定位
    "filter-placement": {
      type: String
    },
    //数据过滤的选项是否多选
    "filter-multiple": {
      type: Boolean,
      default: true
    },
    //数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示。
    "filter-method": {
      type: Function
    },
    //选中的数据过滤项，如果需要自定义表头过滤的渲染方式，可能会需要此属性。
    "filtered-value": {
      type: Array
    },
    //errorType错误类型
    errorType: {
      type: Object,
      default() {
        return {
          value: "normal"
        };
      }
    },
    //表头数据 thlistDefault thlistEdit
    thlist: {
      type: Object,
      default() {
        return {
          thlistDefault: []
        };
      }
    },
    //表搜索条件的输入框绑定值
    searchData: {
      type: Object
    },
    //搜索条件 conditionsData conditionsMessage
    conditions: {
      type: Object
    },
    //搜索条件 searchConditions
    searchConditions: {
      type: Object,
      default() {
        return {
          companyId: "", //公司id
          departmentId: "", //部门id
          filterList: [], //条件
          pageNum: 1, //当前页数
          pageSize: 10, //每页显示条目个数
          orderBy: "", //排序：升序还是降序
          orderFieldName: "", //排序：字段名
          mainSearch: "", //输入框值
          filterConditions: [], //筛选器记录的条件
          //add by xiaosisi on 20170320 用来存储其他检索条件
          'otherConditions':{},
          'organizationId':'',
          totalType: 1
        };
      }
    },
    //分页
    //每页显示条目个数
    "page-size": {
      type: Number,
      default: 10
    },
    //总条目数
    total: {
      type: Number,
      default: 10
    },
    //总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性
    "page-count": {
      type: Number
    },
    //当前页数，支持 .sync 修饰符
    "current-page": {
      type: Number,
      default: 1
    },
    //组件布局，子组件名用逗号分隔
    layout: {
      type: String,
      default: "slot,sizes, prev, pager, next, jumper"
    },
    //每页显示个数选择器的选项设置
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 50, 100];
      }
    }
  },
  methods: {
    //合计按钮
    totalQuery(data) {
      let list = this.gridData.data;
      let lastObj = list[list.length - 1];
      this.attrAssign(lastObj, data);
    },
    attrAssign(obj1, obj2) {
      for (var prop in obj2) {
        if (obj1.hasOwnProperty(prop)) {
          obj1[prop] = obj2[prop];
        }
      }
    },
    //当用户手动勾选数据行的 Checkbox 时触发的事件
    select(selection, row) {
      this.$emit("select", selection, row);
    },
    //表数据多选选择的时候
    selectAll(selection) {
      this.$emit("select-all", selection);
    },
    //表数据多选选择的时候
    selectionChange(selection) {
      this.$emit("selection-change", selection);
    },
    //当单元格 hover 进入时会触发该事件
    cellMouseEnter(row, column, cell, event) {
      this.$emit("cell-mouse-enter", row, column, cell, event);
    },
    //当单元格 hover 退出时会触发该事件
    cellMouseLeave(row, column, cell, event) {
      this.$emit("cell-mouse-leave", row, column, cell, event);
    },
    //当某个单元格被点击时会触发该事件
    cellClick(row, column, cell, event) {
      this.$emit("cell-click", row, column, cell, event);
    },
    //当某个单元格被双击击时会触发该事件
    cellDblclick(row, column, cell, event) {
      this.$emit("cell-dblclick", row, column, cell, event);
    },
    //当某一行被点击时会触发该事件
    rowClick(row, event, column) {
      this.$emit("row-click", row, event, column);
    },
    //当某一行被鼠标右键点击时会触发该事件
    rowContextmenu(row, event) {
      this.$emit("row-contextmenu", row, event);
    },
    //当某一行被双击时会触发该事件
    rowDblclick(row, event) {
      this.$emit("row-dblclick", row, event);
    },
    //当某一列的表头被点击时会触发该事件
    headerClick(column, event) {
      this.$emit("header-click", column, event);
    },
    //	当表格的筛选条件发生变化的时候会触发该事件，参数的值是一个对象，对象的 key 是 column 的 columnKey，对应的 value 为用户选择的筛选条件的数组
    filterChange(filters) {
      this.$emit("filter-change", {
        column,
        prop,
        order
      });
    },
    //当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性
    currentChange(currentRow, oldCurrentRow) {
      this.$emit("current-change", currentRow, oldCurrentRow);
    },
    //当拖动表头改变了列的宽度的时候会触发该事件
    headerDragend(newWidth, oldWidth, column, event) {
      this.$emit("sort-change", newWidth, oldWidth, column, event);
    },
    //当用户对某一行展开或者关闭的上会触发该事件
    expand(row, expanded) {
      this.$emit("expand", row, expanded);
    },
    //搜索
    query() {
      this.searchNone += 1;
      var arry = [];
      for (var i = 0; i < this.conditions.conditionsData.length; i++) {
        if (this.conditions.conditionsData[i]) {
          arry.push(this.conditions.conditionsData[i]);
        }
      }
      this.searchConditions.filterList = arry.concat(
        this.searchConditions.filterConditions
      );
      this.$emit("query");
    },
    //操作列点击
    fnclick(params, scope) {
      this.$emit("fnclick", params, scope);
    },
    //搜索条件拼接以及搜索条件显示
    conditionData(index, value, label, type, selectValue) {
      //value 字段名，label字段中文 ，type 字段类型，selectValue下拉框字段
      if (this.searchData[value] === "") {
        return false;
      }
      let fieldValue = this.searchData[value];
      if (type === "date") {
        fieldValue = this.search.DateFormat(fieldValue, "yyyy-MM-dd");
      }
      if (this.conditions.conditionsData[index]) {
        this.conditions.conditionsData[index].fieldName = value;
        this.conditions.conditionsData[index].fieldValue = this.searchData[
          value
        ];
      } else {
        this.conditions.conditionsData[index] = {
          comparison: this.filterList[type][0].value,
          fieldName: value,
          fieldValue: this.searchData[value]
        };
      }
      var length = this.conditions.conditionsMessage.length;
      if (length > 0) {
        for (var i = 0; i < length; i++) {
          if (this.conditions.conditionsMessage[i].index == index) {
            if (selectValue) {
              this.conditions.conditionsMessage[i].value = selectValue;
            } else {
              this.conditions.conditionsMessage[i].value = fieldValue;
            }
            this.conditions.conditionsMessage[i].isShow = true;
            this.conditions.conditionsMessage[i].label = label;
            break;
          } else {
            if (i == length - 1) {
              if (selectValue) {
                this.conditions.conditionsMessage.push({
                  isShow: true,
                  index: index,
                  label: label,
                  value: selectValue,
                  comparison: this.filterList[type][0].label
                });
              } else {
                this.conditions.conditionsMessage.push({
                  isShow: true,
                  index: index,
                  label: label,
                  value: fieldValue,
                  comparison: this.filterList[type][0].label
                });
              }
            }
          }
        }
      } else {
        if (selectValue) {
          this.conditions.conditionsMessage.push({
            isShow: true,
            index: index,
            label: label,
            value: selectValue,
            comparison: this.filterList[type][0].label
          });
        } else {
          this.conditions.conditionsMessage.push({
            isShow: true,
            index: index,
            label: label,
            value: fieldValue,
            comparison: this.filterList[type][0].label
          });
        }
      }
      this.query(this.conditions.conditionsData);
    },
    //显示过滤的状态
    showDemandList(index) {
      if (index == this.ishowListMenu) {
        this.ishowListMenu = -1;
      } else {
        this.ishowListMenu = index;
      }
    },
    //过滤的状态拼接
    filterStatus(event, index, value, label) {
      $(event.target.parentNode)
        .find("li")
        .removeClass("selected");
      $(event.target).addClass("selected");
      this.ishowListMenu = -1;
      if (this.conditions.conditionsData[index]) {
        var length = this.conditions.conditionsMessage.length;
        if (length > 0) {
          for (var i = 0; i < length; i++) {
            if (this.conditions.conditionsMessage[i]) {
              if (this.conditions.conditionsMessage[i].index == index) {
                this.conditions.conditionsMessage[i].comparison = label;
                this.conditions.conditionsData[index].comparison = value;
                if (this.conditions.conditionsData[index].fieldValue) {
                  this.query(this.conditions.conditionsData);
                }
                break;
              }
            } else {
              this.conditions.conditionsMessage.push({
                isShow: false,
                index: index,
                label: "",
                value: "",
                comparison: label
              });
            }
          }
        } else {
          this.conditions.conditionsMessage.push({
            isShow: false,
            index: index,
            label: "",
            value: "",
            comparison: label
          });
        }
      } else {
        this.conditions.conditionsData[index] = {
          comparison: value,
          fieldName: "",
          fieldValue: ""
        };
        this.conditions.conditionsMessage.push({
          isShow: false,
          index: index,
          label: "",
          value: "",
          comparison: label
        });
      }
    },
    //点击显示过滤搜素行
    tableSearch() {
      this.bolCount = true;
      if (this.isThFirstShow.isbool) {
        $(".pf8").removeClass("pf8On");
        this.isThFirstShow.isbool = false;
        this.gridData.data.shift();
        $(
          ".el-table__fixed-body-wrapper tbody tr:first-child .el-table-column--selection>.cell"
        ).removeClass("hide");
        return false;
      } else {
        $(".pf8").addClass("pf8On");
        this.isThFirstShow.isbool = true;
        $(
          ".el-table__fixed-body-wrapper tbody tr:first-child .el-table-column--selection>.cell"
        ).addClass("hide");
        this.gridData.data.splice(0, 0, {});
        return false;
      }
    },
    //显示列头的操作栏
    showtableSetfn() {
      this.isShowtableSet = !this.isShowtableSet;
      if (this.isShowtableSet) {
        $(".setUp").addClass("setUpOn");
      } else {
        $(".setUp").removeClass("setUpOn");
      }
      this.headerEdit = JSON.parse(JSON.stringify(this.header));
      if (this.ithlockedNum != this.lockedNum) {
        if (this.ithlockedNum != -1) {
          $(".locked").addClass("hideImportant");
          $(".lock").removeClass("hideImportant");
          $(".locked:lt(" + this.ithlockedNum + ")").removeClass(
            "hideImportant"
          );
          $(".lock:lt(" + this.ithlockedNum + ")").addClass("hideImportant");
        } else {
          $(".locked").addClass("hideImportant");
          $(".lock").removeClass("hideImportant");
        }
      }
    },
    //是否锁
    lock(event, index) {
      if (index == this.isLockNum) {
        $(".locked").addClass("hideImportant");
        $(".lock").removeClass("hideImportant");
        this.lockedNum = -1;
        this.isLockNum = -1;
        this.isLocked = false;
      } else {
        var num =
          $(event.target.parentElement)
            .closest("li")
            .index() + 1;
        $(".locked").addClass("hideImportant");
        $(".lock").removeClass("hideImportant");
        $(".locked:lt(" + num + ")").removeClass("hideImportant");
        $(".lock:lt(" + num + ")").addClass("hideImportant");
        this.isLocked = true;
        this.lockedNum = num;
        this.isLockNum = index;
      }
    },
    //排序确定
    tablecheckList() {
      this.ithlockedNum = this.lockedNum;
      this.isShowtableSet = false;
      this.header = JSON.parse(JSON.stringify(this.headerEdit));
      this.$emit("query");
      $(".setUp").removeClass("setUpOn");
    },
    //分页
    sizeChange(val) {
      //pageSize 改变时会触发 回调每页条数size
      this.searchConditions.pageSize = val;
      this.$emit("query");
    },
    currentChange(val) {
      //pageNum 改变时会触发 回调当前页pageNum
      this.searchConditions.pageNum = val;
      this.$emit("query");
    },
    sortChange({ column, prop, order }) {
      //排序
      if (order === "ascending") {
        this.searchConditions.orderBy = "ASC";
        this.searchConditions.orderFieldName = prop;
      } else if (order === "descending") {
        this.searchConditions.orderBy = "DESC";
        this.searchConditions.orderFieldName = prop;
      } else {
        this.searchConditions.orderBy = "";
        this.searchConditions.orderFieldName = "";
      }
      this.$emit("query");
    },
    getHeader() {
      //表头数据初始化
      tableHeaderFetch({
        funcId: this.funcId
      })
        .then(r => {
          if (r.resultData && r.resultData != null) {
            if (r.resultData.columns.length === 0) {
              this.gridData.data = [];
              this.errorType.value = "error";
              this.loading.value = false;
              return false;
            } else {
              this.thlist.thlistDefault = r.resultData.columns;

              //elementui多选框只认true/false,转换
              let obj = {},
                arr = [];
              this.header = r.resultData.columns.map(val => {
                if (val.resourcecolumnHidden == 0) {
                  val.resourcecolumnHidden = true;
                } else {
                  val.resourcecolumnHidden = false;
                }
                if (val.resourcecolumnXtype === "select") {
                  obj = {
                    selectList: val.selectList,
                    name: val.resourcecolumnCode
                  };
                  arr.push(obj);
                }
                return val;
              });
              this.headSelectHandle = arr;
              this.headerEdit = JSON.parse(
                JSON.stringify(r.resultData.columns)
              );
            }
          }
        })
        .catch(r => {
          this.errorType.value = "error";
          this.loading.value = false;
          this.gridData.data = [];
          this.$message({
            message: "系统错误",
            type: "error"
          });
        });
    },
    ownerView(ownerId) {
      if (ownerId) {
        this.itemOwnerId = ownerId;
        this.ownerDetailVisible.visible = true;
      }
    },
    houseView(item) {
      this.itemHouseId = item.row.houseId;
      this.itemHouseType = item.row.houseType;
      this.houseDetailVisible.visible = true;
    },
    headSelectPick(val, list) {
      for (let i = 0, valt; (valt = list[i]); i++) {
        if (val == valt.value) {
          return valt.label;
        }
      }
    },
    //select类型value转成label
    selectSwift() {
      let gridDataList = [],
        headSelectHandle = [];
      gridDataList = this.gridData.data;
      headSelectHandle = this.headSelectHandle;
      if (gridDataList.length !== 0 && headSelectHandle.length !== 0) {
        gridDataList.forEach((val, index) => {
          for (let i = 0, valt; (valt = headSelectHandle[i]); i++) {
            if (valt.selectList.length !== 0 && val[valt.name] != null) {
              let pp = this.headSelectPick(val[valt.name], valt.selectList);
              val[valt.name] = this.headSelectPick(
                val[valt.name],
                valt.selectList
              );
            }
          }
        });
      }
    },
    //判断合计按钮是否显示
    isTotalButtonShow() {
      EventHub.$on("isShowTotalColum", () => {
        const $el = this.$refs["el-table-wrap"];
        if (this.gridData.data.length != this.searchConditions.size * 1 + 1) {
          if ($el) $el.removeAttribute("class");
          this.totalButtonFlag = false;
        } else {
          if ($el) $el.setAttribute("class", "hasTotalColumn");
          this.totalButtonFlag = true;
        }
      });
    },
    //无数据时表头不显示
    showHeadersSwitch() {
      if (this.errorType.value != "normal") {
        this.showHeaders = false;
      } else {
        this.showHeaders = true;
      }
    },
    lstenShowGridButton() {
      EventHub.$on("showGridButton", gridName => {
        handelGridButtons(gridName, this.gridData);
        this.selectSwift();
      });
    }
  },
  created() {
    this.getHeader();
    this.isTotalButtonShow();
    this.lstenShowGridButton();
  },
  updated() {
    
  },
  mounted() {
    //点击外面让set-content消失
    $(window).click(() => {
      if (this.isShowtableSet) {
        this.showtableSetfn();
      }
    });
  }
};
</script>
<style rel="stylesheet/less" lang="scss">
.grid-body {
  .el-checkbox__inner {
    margin-left: 13px;
  }
  .cell .el-button {
    padding-bottom: 2px !important;
  }
  .el-table__fixed {
    border-left: none !important;
  }
  .el-table--border {
    border-left: none !important;
  }
  .el-button--default {
    margin-top: -1px !important;
    line-height: 1px;
  }
  .el-table__row .cell .el-button--text {
    background: none !important;
    border: none !important;
    color: #0a7af8 !important;
    &:hover {
      background: none !important;
      border: none !important;
    }
  }
}
</style>
<style scoped="scoped">
@import url("../../../assets/css/Modular/grid/grid.css");
</style>
