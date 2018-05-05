<template>
	<div>
		<div v-loading="loading" element-loading-text="拼命加载中">
			<el-table :data="tableData" :border="border" :height="height" :max-height="maxHeight" :stripe="stripe" :fit="fit" :show-header="showHeader" :highlight-current-row="highlightCurrentRow" :current-row-key="currentRowKey" :row-class-name="rowClassName" :row-style="rowStyle" :row-key="rowKey" :empty-text="emptyText" :default-expand-all="defaultExpandAll" :expand-row-keys="expandRowKeys" :default-sort="defaultSort" :tooltip-effect="tooltipEffect" :show-summary="showSummary" :sum-text="sumText" :summary-method="summaryMethod" @select="select" @select-all="selectAll" @selection-change="selectionChange" @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave" @cell-click="cellClick" @cell-dblclick="cellDblclick" @row-click="rowClick" @row-contextmenu="rowContextmenu" @row-dblclick="rowDblclick" @header-click="headerClick" @sort-change="sortChange" @filter-change="filterChange" @header-dragend="headerDragend" @expand-change="expand">
				<el-table-column v-if="type" :type="type" width="60" fixed="left" :column-key="columnKey" sortable="custom" :sort-method="sortMethod" :resizable="resizable" :formatter="formatter" :show-overflow-tooltip="showOverflowTooltip" :align="align" :header-align="headerAlign" :class-name="className" :label-class-name="labelClassName" :selectable="selectable" :reserve-selection="reserveSelection" :filters="filters" :filter-placement="filterPlacement" :filter-multiple="filterMultiple" :filter-method="filterMethod" :filtered-value="filteredValue">
				</el-table-column>
				<el-table-column v-for="(itme,index) in thlist" :label="itme.label" :min-width="minWidth" :prop="itme.prop" :width="itme.width" :fixed="itme.fixed" :column-key="columnKey" sortable="custom" :sort-method="sortMethod" :resizable="resizable" :formatter="formatter" :show-overflow-tooltip="showOverflowTooltip" :align="align" :header-align="headerAlign" :class-name="className" :label-class-name="labelClassName" :selectable="selectable" :reserve-selection="reserveSelection" :filters="filters" :filter-placement="filterPlacement" :filter-multiple="filterMultiple" :filter-method="filterMethod" :filtered-value="filteredValue" :key="index">

				</el-table-column>
				<el-table-column label="操作" width="170px" v-if="tableData.length>0 && tableData[0].fnsclick">
					<template slot-scope="scope">
						<el-button @click="fnclick(scope.row.fnsclick[0],scope)" type="text">{{scope.row.fnsclick[0].label}}</el-button>
						<el-dropdown trigger="click">
							<span class="el-button--text" v-if="scope.row.fnsclick.length>0">
								    更多<i class="iconfont pf8">&#xe661;</i>
							  </span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-for="(item,index) in scope.row.fnsclick" v-if="index>0" :key="index" @click.native="fnclick(item,scope)">{{item.label}}</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="panel-page" v-if="showPage" v-show="errorType!=='error' && errorType!=='noResult' && errorType!=='noData' && tableData.length>0">
			<el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" :layout="layout" :total="total">
				<span class="page">共{{pageSize>total?total:pageSize}}条/{{total/pageSize | MathCeil}}页</span>
			</el-pagination>
			<el-button class="page-btn">确定</el-button>
		</div>
		<div class="clearfix"></div>
	</div>
</template>

<script>
	export default {
		props: {
			/*Table Attributes*/
			//显示的数据
			tableData: {
				type: Array,
				default: function() {
					return []
				}
			},
			//Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则 Table 的高度受控于外部样式
			height: {
				type: [String, Number],
				default: 100
			},
			//Table 的最大高度
			'max-height': {
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
			'show-header': {
				type: Boolean,
				default: true
			},
			//是否要高亮当前行
			'highlight-current-row': {
				type: Boolean,
				default: false
			},
			//当前行的 key，只写属性
			'current-row-key': {
				type: [String, Number]
			},
			//行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
			'row-class-name': {
				type: [String, Function]
			},
			//行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。
			'row-style': {
				type: [Object, Function]
			},
			//行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能的情况下，该属性是必填的。
			//类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。
			'row-key': {
				type: [String, Function]
			},
			//空数据时显示的文本内容，也可以通过 slot="empty" 设置
			'empty-text': {
				type: String,
				default: '暂无数据'
			},
			//是否默认展开所有行，当 Table 中存在 type="expand" 的 Column 的时候有效
			'default-expand-all': {
				type: Boolean,
				default: false
			},
			//可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
			'expand-row-keys': {
				type: Array
			},
			//默认的排序列的prop和顺序。它的prop属性指定默认的排序的列，order指定默认排序的顺序
			//order: ascending, descending如果只指定了prop, 没有指定order, 则默认顺序是ascending
			'default-sort': {
				type: Object
			},
			//tooltip effect 属性dark/light
			'tooltip-effect': {
				type: String
			},
			//是否在表尾显示合计行
			'show-summary': {
				type: Boolean,
				default: false
			},
			//合计行第一列的文本
			'sum-text': {
				type: String,
				default: '合计'
			},
			//自定义的合计计算方法
			'summary-method': {
				type: Function
			},
			/*Table-column Attributes*/
			//显示的标题
			label: {
				type: String
			},
			//对应列内容的字段名，也可以使用 property 属性
			prop: {
				type: String,
				default: 'selection'
			},
			//对应列的宽度
			width: {
				type: String,
				default: 'selection'
			},
			//对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮 selection/index/expand
			type: {
				type: String,
				default: ''
			},
			//column 的 key，如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件
			'column-key': {
				type: String
			},
			//对应列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列
			minWidth: {
				type: String
			},
			//对应列是否可以排序，如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件
			sortable: {
				type: [Boolean, String],
				default: true
			},
			//对数据进行排序的时候使用的方法，仅当 sortable 设置为 true 的时候有效，需返回一个布尔值
			'sort-method': {
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
			'show-overflow-tooltip': {
				type: Boolean,
				default: false
			},
			//对齐方式left/center/right
			align: {
				type: String,
				default: 'left'
			},
			//表头对齐方式，若不设置该项，则使用表格的对齐方式left/center/right
			'header-align': {
				type: String
			},
			//列的 className
			'class-name': {
				type: String
			},
			//当前列标题的自定义类名
			'label-class-name': {
				type: String
			},
			//仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
			selectable: {
				type: Function
			},
			//仅对 type=selection 的列有效，类型为 Boolean，为 true 则代表会保留之前数据的选项，需要配合 Table 的 clearSelection 方法使用。
			'reserve-selection': {
				type: Boolean,
				default: false
			},
			//数据过滤的选项，数组格式，数组中的元素需要有 text 和 value 属性。
			filters: {
				type: Array
			},
			//过滤弹出框的定位
			'filter-placement': {
				type: String
			},
			//数据过滤的选项是否多选
			'filter-multiple': {
				type: Boolean,
				default: true
			},
			//数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示。
			'filter-method': {
				type: Function
			},
			//选中的数据过滤项，如果需要自定义表头过滤的渲染方式，可能会需要此属性。
			'filtered-value': {
				type: Array
			},
			//errorType错误类型
			errorType: {
				type: String,
				default: ''
			},
			//表头数据 thlistDefault thlistEdit
			thlist: {
				type: Array,
				default: function() {
					return []
				}
			},
			//errorType错误类型
			errorType: {
				type: String,
				default: ''
			},
			//分页
			//每页显示条目个数
			pageSize: {
				type: Number,
				default: 10
			},
			//总条目数
			total: {
				type: Number,
				default: 10
			},
			//总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性
			'page-count': {
				type: Number,
			},
			//当前页数，支持 .sync 修饰符
			currentPage: {
				type: Number,
				default: 1
			},
			//组件布局，子组件名用逗号分隔
			layout: {
				type: String,
				default: 'slot,sizes, prev, pager, next, jumper'
			},
			//每页显示个数选择器的选项设置
			pageSizes: {
				type: Array,
				default: function() {
					return [10, 20, 50, 100]
				}
			},
			loading: {
				type: Boolean,
				default: false
			},
			showPage: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			//当用户手动勾选数据行的 Checkbox 时触发的事件
			select(selection, row) {
				this.$emit('select', selection, row)
			},
			//表数据多选选择的时候
			selectAll(selection) {
				this.$emit('select-all', selection)
			},
			//表数据多选选择的时候
			selectionChange(selection) {
				this.$emit('selection-change', selection)
			},
			//当单元格 hover 进入时会触发该事件
			cellMouseEnter(row, column, cell, event) {
				this.$emit('cell-mouse-enter', row, column, cell, event)
			},
			//当单元格 hover 退出时会触发该事件
			cellMouseLeave(row, column, cell, event) {
				this.$emit('selection-change', row, column, cell, event)
			},
			//当某个单元格被点击时会触发该事件
			cellClick(row, column, cell, event) {
				this.$emit('cell-click', row, column, cell, event)
			},
			//当某个单元格被双击击时会触发该事件
			cellDblclick(row, column, cell, event) {
				this.$emit('cell-dblclick', row, column, cell, event)
			},
			//当某一行被点击时会触发该事件
			rowClick(row, event, column) {
				this.$emit('row-click', row, event, column)
			},
			//当某一行被鼠标右键点击时会触发该事件
			rowContextmenu(row, event) {
				this.$emit('row-contextmenu', row, event)
			},
			//当某一行被双击时会触发该事件
			rowDblclick(row, event) {
				this.$emit('row-dblclick', row, event)
			},
			//当某一列的表头被点击时会触发该事件
			headerClick(column, event) {
				this.$emit('header-click', column, event)
			},
			//	当表格的筛选条件发生变化的时候会触发该事件，参数的值是一个对象，对象的 key 是 column 的 columnKey，对应的 value 为用户选择的筛选条件的数组
			filterChange(filters) {
				this.$emit('filter-change', {
					column,
					prop,
					order
				})
			},
			//当拖动表头改变了列的宽度的时候会触发该事件
			headerDragend(newWidth, oldWidth, column, event) {
				this.$emit('sort-change', newWidth, oldWidth, column, event)
			},
			//当用户对某一行展开或者关闭的上会触发该事件
			expand(row, expanded) {
				this.$emit('expand', row, expanded)
			},

			sortChange({
				column,
				prop,
				order
			}) {
				this.$emit('sort-change', {
					column,
					prop,
					order
				})
			},
			//搜索
			query() {
				this.$emit('query')
			},
			//更多功能
			fnclick(params, scope) {
				console.log(scope)
				this.$emit('fnclick', params, scope)
			},
			//分页
			sizeChange(val) { //pageSize 改变时会触发 回调每页条数size
				this.$emit('size-change', val)
			},
			currentChange(val) { //pageNum 改变时会触发 回调当前页pageNum
				this.$emit('current-change', val)
			}
		}
	}
</script>

<style>
	.cell .el-button--text {
		color: #0a7af8 !important;
	}

	.cell .el-button {
		padding-bottom: 2px !important;
	}
	
</style>
<style scoped="scoped">
	@import url("../../../assets/css/Modular/grid/grid.css");
</style>
