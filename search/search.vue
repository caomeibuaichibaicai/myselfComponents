<template>
  <div class="search">
    <!--搜索部分-->
    <div class="searchBody">
      <div>
        <el-input size="medium" v-model="searchInput.value" @keyup.enter.native="filedQuery"
                  :placeholder="searchInput.placeholder" class="width200">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="filedQuery"></i>
        </el-input>
        <el-button size="medium" class="btn-senior" @click="dialogFilterShow('high')">高级</el-button>
      </div>
      <div>
        <label>筛选器</label>
        <el-input size="medium" suffix-icon="el-icon-arrow-down" placeholder="请选择" class="width200"
                  :clearable="true"
                  v-on:change="noSelect"
                  v-model="filterSelectValue" readonly @click.native="isShowfilterSelect=!isShowfilterSelect">
        </el-input>
      </div>
    </div>
    <ul class="filter-select" v-show="isShowfilterSelect" @mouseleave="isShowfilterSelect=false">
      <li v-for="(item,index) in filterSelectList.filterSelectListDefault"
          :class="{'filter-selected':index==filterSeletedNum}" v-if="item.isShow"
          @click="filterSelected(item.filterList,item.filterName,index)">{{item.filterName}}
      </li>
      <li @click="dialogFilterShow('add')" class="filter-option"
          :class="{topborder:filterSelectList.filterSelectListDefault.length>0}">
        <ns-icon-svg icon-class="add"></ns-icon-svg>
        新增
      </li>
      <li @click="manageFilterOption" class="filter-option">
        <ns-icon-svg icon-class="shezhi-"></ns-icon-svg>
        管理
      </li>
    </ul>
    <!--显示错误信息-->
    <ul class="filter-result-c">
      <li :key="index" v-if="item.isShow" v-for="(item,index) in conditions.conditionsMessage">
        {{item.label}} {{item.comparison}} '{{item.value}}'
        <ns-icon-svg @click="deleteConditions(index,item.index,item.count)" icon-class="guanbi"
                     class="chacha"></ns-icon-svg>
      </li>
    </ul>
    <!--搜索筛选-->
    <div class="filtering">
      <el-dialog :title="strFilterTitle" :visible.sync="isDialogVisible" :modal-append-to-body="false"
                 :close-on-click-modal="false">
        <div class="condition">
          <!--筛选器下拉列表，新增-->
          <div class="pb16" v-if="!isHighFilter">
            <label class="pr4"><span class="red">*</span>名称</label>
            <el-input auto-complete="off" v-model="strFilterName"></el-input>
          </div>
          <div class="add-condition">
            <label><span class="red">*</span>筛选条件</label>
            <div class="pb16" v-for="(highFilter,index) in highFilters">
              <el-select v-model="highFilter.fieldName">
                <el-option v-for="(item,childIndex) in thlist.thlistDefault" :key="childIndex"
                           :label="item.resourcecolumnName"
                           @click.native="fieldNameChange(index,childIndex,item.resourcecolumnName)"
                           :value="item.resourcecolumnCode">
                </el-option>
              </el-select>
              <el-select v-model="highFilter.comparison">
                <el-option v-for="(item,kindex) in filterList[highFilter.type]" :key="kindex" :label="item.label"
                           :value="item.value" @click.native="comparisonChange(index,item.label)">
                </el-option>
              </el-select>

              <template v-if="highFilter.isShow">
                <el-input @change="fieldValueChange(index,highFilter.fieldValue)" v-if="highFilter.type=='text'"
                          auto-complete="off" v-model="highFilter.fieldValue"></el-input>
                <el-select v-else-if="highFilter.type=='select'" v-model="highFilter.fieldValue">
                  <el-option @click.native="fieldValueChange(index,items.label)"
                             v-for="(items,pindex) in highFilter.selectList" :key="items.value" :label="items.label"
                             :value="items.value">
                  </el-option>
                </el-select>
                <el-input @change="fieldValueChange(index,highFilter.fieldValue)" v-else-if="highFilter.type=='number'"
                          auto-complete="off" v-model="highFilter.fieldValue"></el-input>
                <el-date-picker :editable=false @change="fieldValueChange(index,highFilter.fieldValue)"
                                v-if="highFilter.type=='date'" v-model="highFilter.fieldValue" type="date"
                                placeholder="选择日期"></el-date-picker>
              </template>

              <ns-icon-svg class="delete-condition" icon-class="CombinedShapeCopy" @click="delCondition(index)"
                           v-if="highFilters.length>1"></ns-icon-svg>
            </div>
          </div>
          <p @click="addCondition">＋添加筛选条件</p>
          <div class="save-filter" v-if="isHighFilter">
            <el-checkbox v-model="isSaveFilter">保存到筛选器</el-checkbox>
            <el-input auto-complete="off" v-model="strFilterName" v-if="isSaveFilter" placeholder="请输入名称"></el-input>
          </div>
          <div class="default-filter" v-else>
            <el-checkbox v-model="isDefaultFilter">设为默认</el-checkbox>
          </div>
        </div>
        <span slot="footer" class=" dialog-footer">
					  <el-button type="primary" @click="commitCondition()" size="medium">确 定</el-button>
				    <el-button @click="isDialogVisible = false" size="medium">取 消</el-button>
				</span>
      </el-dialog>
      <!--筛选器管理-->
      <el-dialog title="筛选器管理" :visible.sync="isManagedialogVisible" :modal-append-to-body="false"
                 :close-on-click-modal="false">
        <div class="manageBody">
          <span class="filter-prompt">您可以设置筛选条件的显示/隐藏标签或通过拖动来改变顺序</span>
          <ul class="filtersManage">
            <draggable v-model="filterSelectList.filterSelectListEdit" @start="drag=true" @end="drag=false"
                       @update="datadragEnd">
              <li v-for="(item,index) in filterSelectList.filterSelectListEdit" :key="index"
                  @mouseleave="moreFilterOption(-1)">
                <ns-icon-svg v-if="index===defaultNum" icon-class="dian-copy"></ns-icon-svg>
                <ns-icon-svg v-else icon-class="drag"></ns-icon-svg>
                <span :class="{fontColor9:!item.isShow}">{{item.filterName}}</span>
                <span class="right hide" v-show="defaultNum === index" @click="defaultEditoff(index)">取消默认</span>
                <span class="right hide" v-show="defaultNum != index" @click="defaultEdit(index)">设为默认</span>
                <span class="right hide" @click="filterOptionHide(index)" v-if="!defaultNum <= index  " v-show="item.isShow">隐藏</span>
                <span class="right hide" @click="filterOptionShow(index)" v-show="!item.isShow">显示</span>
                <span class="right hide" @click="delFilterOption(index)">删除&nbsp</span>
                <span class="right hide" @click="editFilterOption(index)">编辑&nbsp</span>
              </li>
            </draggable>
          </ul>
          <p @click="dialogFilterShow('add')">＋新增筛选</p>
        </div>
        <span slot="footer" class="dialog-footer">
				  <el-button type="primary" @click="manageFilterEnsure" size="medium">确 定</el-button>
			    <el-button @click="manageFilterCancel" size="medium">取 消</el-button>
				</span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {filterFetch, filterFns, tableHeaderFetch} from '../../../api/ns-search'
  import draggable from 'vuedraggable'

  export default {
    components: {
      draggable,
    },
    data() {
      return {
        filter3rdShow: "true",
        //默认的筛选器
        defaultNum: -1,
        oldDefaultNum: -1,
        filterSeletedNum: 0,
        //filterTitle
        strFilterTitle: '高级筛选',
        //筛选器dialog显示
        isDialogVisible: false,
        //判断筛选器下拉框新增
        isNewFilter: false,
        //是否点击高级按钮打开
        isHighFilter: false,
        //是否显示筛选器
        isShowfilterSelect: false,
        //保存筛选时的名称
        strFilterName: '',
        //高级筛选条件
        highFilters: [],
        highFiltersCopy: [],
        highFiltersMessage: [],
        //是否保存到筛选器
        isSaveFilter: false,
        //是否设为默认
        isDefaultFilter: false,
        //管理的dialog
        isManagedialogVisible: false,
        //显示筛选器更多的操作
        showmoreFilterNum: -1,
        //是否编辑
        isFilterEdit: false,
        //编辑的index
        isFilterEditIndex: -1,
        //筛选器值
        selectedFilterValue: [],
        filterSelectValue: '',
        filterSelectList: {
          filterSelectListDefault: [],
          filterSelectListEdit: []
        },
        //过滤状态
        filterList: {
          text: [{
            value: 'LIKE',
            label: '包含'
          },
            {
              value: 'NOT_LIKE',
              label: '不包含'
            },
            {
              value: 'NULL',
              label: '空'
            },
            {
              value: 'NOT_NULL',
              label: '不为空'
            }
          ],
          number: [{
            value: 'EQUAL',
            label: '等于'
          },
            {
              value: 'GREATER_THAN',
              label: '大于'
            }, {
              value: 'LESS_THAN',
              label: '小于'
            },
            {
              value: 'GREATER_EQUAL_THAN',
              label: '大于等于'
            },
            {
              value: 'LESS_EQUAL_THAN',
              label: '小于等于'
            }
          ],
          select: [{
            value: 'EQUAL',
            label: '等于'
          }],
          date: [{
            value: 'EQUAL',
            label: '等于'
          },
            {
              value: 'GREATER_THAN',
              label: '大于'
            }, {
              value: 'LESS_THAN',
              label: '小于'
            },
            {
              value: 'GREATER_EQUAL_THAN',
              label: '大于等于'
            },
            {
              value: 'LESS_EQUAL_THAN',
              label: '小于等于'
            }
          ],
        }
      }
    },
    props: {
      searchInput: {
        type: Object,
        default() {
          return {
            value: ''
          }
        }
      },
      isUseFilter: {
        type: Boolean,
        default: true
      },
      funcId: {
        type: [Number, String]
      },
      //搜索条件 searchConditions
      searchConditions: {
        type: Object,
        function () {
          return {
            'companyId': '', //公司id
            'departmentId': '', //部门id
            'filterList': [], //条件
            'pageNum': 1, //当前页数
            'pageSize': 10, //每页显示条目个数
            'orderBy': '', //排序：升序还是降序
            'orderFieldName': '', //排序：字段名
            'mainSearch': '', //输入框值
            'filterConditions': [], //筛选器记录的条件
            //add by xiaosisi on 20170320 用来存储其他检索条件
            'otherConditions': {},
            'organizationId': '',
            'totalType': 1
          }
        }
      },
      searchData: {
        type: Object
      },
      //搜索条件 conditionsData conditionsMessage
      conditions: {
        type: Object,
        default() {
          return {
            conditionsData: [],
            conditionsMessage: []
          }
        }
      },
      //表头数据 thlistDefault
      thlist: {
        type: Object,
        default() {
          return {
            thlistDefault: [],
          }
        }
      },
    },
    methods: {
      //输入框查询
      filedQuery() {
        this.conditions.conditionsData = [];
        this.conditions.conditionsMessage = [];
        this.searchConditions.filterList = this.selectedFilterValue;
        this.searchConditions.pageNum = 1;//搜索后显示的页数
        this.$emit('query')
      },
      //高级筛选搜索
      query(highFilters, isFilter) {
        if (isFilter) {
          this.searchConditions.filterConditions = highFilters.concat(this.selectedFilterValue);
        } else {
          this.searchConditions.filterConditions = [];
        }
        this.searchConditions.filterList = highFilters.concat(this.selectedFilterValue);
        this.$emit('query')
      },
      //打开高级筛选
      dialogFilterShow(field) {
        this.isDefaultFilter = false;
        this.isShowfilterSelect = false;
        if (field === 'add') {
          this.strFilterTitle = "新增筛选"
          this.isNewFilter = true;
          this.isFilterEdit = false;
          this.isHighFilter = false;
        } else if (field === 'high') {
          this.strFilterTitle = "高级筛选"
          this.isNewFilter = false;
          this.isFilterEdit = false;
          this.isHighFilter = true;
        }
        this.strFilterName = '';
        this.isSaveFilter = false;
        this.isDialogVisible = true;
        $('.condition .el-input__inner').removeClass('errorborder');
        this.highFilters = [{
          comparison: this.filterList[this.thlist.thlistDefault[0].resourcecolumnXtype][0].value,
          fieldName: this.thlist.thlistDefault[0].resourcecolumnCode,
          fieldValue: '',
          type: this.thlist.thlistDefault[0].resourcecolumnXtype,
          selectList: this.thlist.thlistDefault[0].selectList,
          isShow: true,
        }]
        this.highFiltersMessage = [{
          isShow: true,
          value: '',
          label: this.thlist.thlistDefault[0].resourcecolumnName,
          comparison: this.filterList[this.thlist.thlistDefault[0].resourcecolumnXtype][0].label,
          count: this.highFilters.length - 1
        }]
      },
      //添加筛选条件
      addCondition() {
        this.highFilters.push({
          comparison: this.filterList[this.thlist.thlistDefault[0].resourcecolumnXtype][0].value,
          fieldName: this.thlist.thlistDefault[0].resourcecolumnCode,
          fieldValue: '',
          type: this.thlist.thlistDefault[0].resourcecolumnXtype,
          selectList: this.thlist.thlistDefault[0].selectList,
          isShow: true,
        })
        if (!this.isNewFilter) {
          this.highFiltersMessage.push({
            isShow: true,
            value: '',
            label: this.thlist.thlistDefault[0].resourcecolumnName,
            comparison: this.filterList[this.thlist.thlistDefault[0].resourcecolumnXtype][0].label,
            count: this.highFilters.length - 1
          })
        } else {
          this.highFiltersMessage.push({
            isShow: false,
            value: '',
            label: this.thlist.thlistDefault[0].resourcecolumnName,
            comparison: this.filterList[this.thlist.thlistDefault[0].resourcecolumnXtype][0].label,
            count: this.highFilters.length - 1
          })
        }
      },
      //删除筛选条件
      delCondition(index) {
        this.highFilters.splice(index, 1);
        if (!this.isNewFilter) {
          this.highFiltersMessage.splice(index, 1);
        }
      },
      //删除显示的搜索条件
      deleteConditions(index, num, count) {
        this.conditions.conditionsMessage.splice(index, 1);
        if (num > -1) {
          this.searchData[this.conditions.conditionsData[num].fieldName] = '';
          this.conditions.conditionsData[num].fieldName = '';
          var arry = [];
          for (var i = 0; i < this.conditions.conditionsData.length; i++) {
            if (this.conditions.conditionsData[i] && this.conditions.conditionsData[i].fieldName !== '') {
              arry.push(this.conditions.conditionsData[i])
            }
          }
          this.query(arry)
        } else {
          this.highFiltersCopy.splice(count, 1);
          this.query(this.conditions.conditionsData.concat(this.highFiltersCopy), false);
        }
      },
      //提交筛选
      commitCondition() {
        let bool = false;
        let inputList = document.querySelector('.condition').querySelectorAll('.el-input__inner');
        for (let i = 0; i < inputList.length; i++) {
          if (inputList[i].value == '') {
            inputList[i].className += ' errorborder';
            bool = true;
          } else {
            inputList[i].className = 'el-input__inner'
          }
        }
        if (bool) {
          return false;
        }
        this.isDialogVisible = false;
        let selectIndex = -1;
        //高级，保存为筛选器
        if (this.isSaveFilter) {
          this.filterSelectList.filterSelectListEdit.push({
            filterName: this.strFilterName,
            filterList: this.highFilters,
            isShow: true,
            isDefault: false,
          })
          this.filterEdit(this.filterSelectList.filterSelectListEdit);
          selectIndex = this.filterSelectList.filterSelectListEdit.length - 1;
          this.isSaveFilter = false;
        } else {
          this.conditions.conditionsMessage.length = 0;
          this.conditions.conditionsMessage = this.conditions.conditionsMessage.concat(this.highFiltersMessage);
          this.highFiltersCopy = JSON.parse(JSON.stringify(this.highFilters));
          this.query(this.highFiltersCopy, true);
        }

        //筛选器管理，编辑
        if (this.isFilterEdit) {
          //把当前筛选器设置为默认
          if (this.isDefaultFilter) {
            this.filterSelectList.filterSelectListEdit[this.isFilterEditIndex].isDefault = true;
            if (this.defaultNum != -1) {
              this.filterSelectList.filterSelectListEdit[this.defaultNum].isDefault = false;
            }
            this.defaultNum = this.isFilterEditIndex;
            //把当前筛选器设置为非默认
          } else {
            //筛选器列表中已经有默认的情况下
            if (this.defaultNum > -1) {
              this.filterSelectList.filterSelectListEdit[this.defaultNum].isDefault = true;
            }
            this.filterSelectList.filterSelectListEdit[this.isFilterEditIndex].isDefault = false;
            this.defaultNum = -1;
          }
          this.filterSelectList.filterSelectListEdit[this.isFilterEditIndex].filterName = this.strFilterName;
          this.filterSelectList.filterSelectListEdit[this.isFilterEditIndex].filterList = this.highFilters;
          selectIndex = this.isFilterEditIndex;
          this.isFilterEditIndex = -1;
          this.isFilterEdit = false;
        }
        //筛选器管理，新增
        if (this.isNewFilter) {//新增
          this.filterSelectList.filterSelectListEdit.push({
            filterName: this.strFilterName,
            filterList: this.highFilters,
            isShow: true,
            isDefault: this.isDefaultFilter
          });
          //新增默认筛选器时
          if (this.isDefaultFilter) {
            if (this.defaultNum > -1) {
              this.filterSelectList.filterSelectListEdit[this.defaultNum].isDefault = false;
            }
            this.defaultNum = this.filterSelectList.filterSelectListEdit.length - 1;
            this.setDefaultTop();
          }
          this.filterEdit(this.filterSelectList.filterSelectListEdit);
          selectIndex = this.filterSelectList.filterSelectListEdit.length - 1;
          this.isNewFilter = false;
        }
        //选中新增或者编辑的筛选器
        if (selectIndex > -1) {
          this.filterSeletedNum = selectIndex;
          this.filterSelectValue = this.filterSelectList.filterSelectListEdit[selectIndex].filterName;
          this.selectedFilterValue = this.filterSelectList.filterSelectListEdit[selectIndex].filterList;
        }
        this.setDefaultTop();
        this.filterSelectList.filterSelectListDefault = JSON.parse(JSON.stringify(this.filterSelectList.filterSelectListEdit));
        this.filterEdit(this.filterSelectList.filterSelectListDefault);
      },
      //将默认置顶
      setDefaultTop() {
        //筛选器列表不为空，并且有默认筛选器时置顶默认筛选器
        let filterList = [];
        if (this.filterSelectList.filterSelectListEdit && this.defaultNum > -1) {
          filterList.push(this.filterSelectList.filterSelectListEdit[this.defaultNum]);
          for (var i = 0; i < this.filterSelectList.filterSelectListEdit.length; i++) {
            if (i != this.defaultNum) {
              filterList.push(this.filterSelectList.filterSelectListEdit[i]);
            }
          }
          this.filterSelectList.filterSelectListEdit = [];
          this.filterSelectList.filterSelectListEdit = filterList;
          this.filterSelectList.filterSelectListDefault = JSON.parse(JSON.stringify(this.filterSelectList.filterSelectListEdit));
          this.defaultNum = 0;
        }
      },
      //高级筛选中条件变化时
      comparisonChange(index, comparison) {
        if (!this.isNewFilter) {
          this.highFiltersMessage[index].comparison = comparison;
        }
        //第三个的筛选器为空或不为空时隐藏
        if (comparison === "空" || comparison === "不为空") {
          this.highFilters[index].isShow = false;
        } else {
          this.highFilters[index].isShow = true;
        }
      },
      //高级筛选中字段名变化时
      fieldNameChange(index, childIndex, label) {
        if (!this.isNewFilter) {
          this.highFiltersMessage[index].label = label;
        }
        if (this.thlist.thlistDefault[childIndex].resourcecolumnXtype === 'select') {
          this.highFilters[index].type = 'select';
          this.highFilters[index].selectList = this.thlist.thlistDefault[childIndex].selectList;
          this.highFilters[index].fieldValue = '';
          this.highFilters[index].comparison = this.filterList.select[0].value;
          this.highFilters.splice()
          this.highFiltersMessage[index].comparison = this.filterList.select[0].label;
        } else if (this.thlist.thlistDefault[childIndex].resourcecolumnXtype === 'date') {
          this.highFilters[index].type = 'date';
          this.highFilters[index].fieldValue = '';
          this.highFilters[index].comparison = this.filterList.date[0].value;
          this.highFiltersMessage[index].comparison = this.filterList.select[0].label;
        } else if (this.thlist.thlistDefault[childIndex].resourcecolumnXtype === 'number') {
          this.highFilters[index].type = 'number';
          this.highFilters[index].fieldValue = '';
          this.highFilters[index].comparison = this.filterList.number[0].value;
          this.highFiltersMessage[index].comparison = this.filterList.select[0].label;
        } else {
          this.highFilters[index].type = 'text';
          this.highFilters[index].fieldValue = '';
          this.highFilters[index].comparison = this.filterList.text[0].value;
          this.highFiltersMessage[index].comparison = this.filterList.select[0].label;
        }
        this.highFilters[index].isShow = true;
      },
      //高级筛选中值变化时
      fieldValueChange(index, value) {
        if (typeof value == 'object') {
          value = value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate()
        }
        if (!this.isNewFilter) {
          this.highFiltersMessage[index].value = value;
        }
      },
      //筛选器选择
      filterSelected(value, label, index) {
        this.selectedFilterValue = value;
        this.query([])
        this.isShowfilterSelect = false;
        this.filterSelectValue = label;
        this.filterSeletedNum = index;
      },
      //筛选器管理打开
      manageFilterOption() {
        this.filterSelectList.filterSelectListEdit = JSON.parse(JSON.stringify(this.filterSelectList.filterSelectListDefault));
        this.isManagedialogVisible = true;
        this.isShowfilterSelect = false;
      },
      //筛选器管理确定
      manageFilterEnsure() {
        this.isManagedialogVisible = false;
        this.filterSelectList.filterSelectListDefault = JSON.parse(JSON.stringify(this.filterSelectList.filterSelectListEdit));
        this.filterEdit(this.filterSelectList.filterSelectListDefault)
      },
      //筛选器管理取消
      manageFilterCancel() {
        this.isManagedialogVisible = false;
        this.defaultNum = this.oldDefaultNum
      },
      //筛选器删除
      delFilterOption(index) {
        if (this.filterSelectList.filterSelectListEdit[index].isDefault) {
          this.defaultNum = -1;
        }
        this.filterSelectList.filterSelectListEdit.splice(index, 1);
        this.setDefaultTop();
        if (this.filterSelectList.filterSelectListEdit && this.filterSelectList.filterSelectListEdit > 0) {
          this.filterSeletedNum = 0;
          this.filterSelectValue = this.filterSelectList.filterSelectListEdit[0].filterName;
          this.selectedFilterValue = this.filterSelectList.filterSelectListEdit[0].filterList;
        } else {
          this.filterSeletedNum = -1;
          this.filterSelectValue = "";
          this.selectedFilterValue = [];
        }
      },
      //筛选器编辑
      editFilterOption(index) {
        this.strFilterTitle = "编辑筛选"
        this.isFilterEditIndex = index;
        this.isFilterEdit = true;
        this.isNewFilter = false;
        this.isSaveFilter = false;
        this.isHighFilter = false;
        this.isDialogVisible = true;
        if (index === this.defaultNum) {
          this.isDefaultFilter = true;
        } else {
          this.isDefaultFilter = false;
          this.filterSelectList.filterSelectListEdit[index].isShow = true;//显示隐藏
        }
        this.strFilterName = this.filterSelectList.filterSelectListEdit[index].filterName;
        this.highFilters = this.filterSelectList.filterSelectListEdit[index].filterList;
      },
      //显示筛选器更多操作
      moreFilterOption(index) {
        if (this.showmoreFilterNum == index) {
          this.showmoreFilterNum = -1;
        } else {
          this.showmoreFilterNum = index;
        }
      },
      //筛选器隐藏
      filterOptionHide(index) {
        if (this.defaultNum == index) {
          this.$message({message: '默认项不允许隐藏', type: 'warning'});
          return false;
        }
        this.showmoreFilterNum = -1;
        this.filterSelectList.filterSelectListEdit[index].isShow = false;
      },
      //筛选器显示
      filterOptionShow(index) {
        this.showmoreFilterNum = -1;
        this.filterSelectList.filterSelectListEdit[index].isShow = true;
      },
      //设置默认
      defaultEdit(index) {
        this.filterSelectList.filterSelectListEdit[index].isShow = true;
        if(this.defaultNum > -1){
          this.filterSelectList.filterSelectListEdit[this.defaultNum].isDefault = false;
        }
        this.defaultNum = index;
        this.filterSelectList.filterSelectListEdit[index].isDefault = true;

        this.isDefaultFilter = true;
        this.setDefaultTop();
      },
      //取消默认
      defaultEditoff(index) {
        this.defaultNum = -1;
        this.filterSelectList.filterSelectListEdit[index].isDefault = false;
      },
      //清空搜索框
      noSelect() {
        if (this.filterSelectValue === "") {
          this.$emit('query', this.$set(this.searchConditions, 'filterList', []), true)
        };
      },
      aa(){
        this.filterSelectValue = [];
        this.noSelect()
        if (this.defaultNum === -1) {
          this.$emit('query', this.$set(this.searchConditions, 'filterList', []), true);
        };
      },
      //筛选器
      getFilters() { //筛选器数据获取
        filterFetch({
          'funcId': this.funcId
        }).then((r) => {
          this.filterSelectList.filterSelectListDefault = r.resultData;
          this.filterSelectList.filterSelectListEdit = JSON.parse(JSON.stringify(r.resultData));
          this.defaultNum = -1;
          for (let i = 0; i < this.filterSelectList.filterSelectListEdit.length; i++) {
            if (this.filterSelectList.filterSelectListEdit[i].isDefault) {
              this.defaultNum = i;
              this.oldDefaultNum = i;
              this.filterSeletedNum = i;
              break;
            }
          }
        })
      },
      filterEdit(conditions) { //筛选器操作确定
        let datas = {
          conditions: conditions,
          funcId: this.funcId
        }
        filterFns(datas).then((r) => {
          this.getFilters();
        })
      },
      datadragEnd(val) {//拖动
        if (this.defaultNum === -1) {
          this.drag = false;
          console.log(this.drag)
        }
        for (let i = 0; i < this.filterSelectList.filterSelectListEdit.length; i++) {
          if (this.filterSelectList.filterSelectListEdit[i].isDefault) {
            this.defaultNum = i;
            break;
          }
        }
        this.setDefaultTop();
      }
    },
    created() {
      this.aa();
      this.searchConditions.filterList = [];
      filterFetch({
        'funcId': this.funcId
      }).then((r) => {
        if (r.resultData && r.resultData.length > 0) {
          this.filterSelectList.filterSelectListDefault = r.resultData;
          this.filterSelectList.filterSelectListEdit = JSON.parse(JSON.stringify(r.resultData));
          //获取默认筛选器的index
          this.defaultNum = -1;
          for (let i = 0; i < this.filterSelectList.filterSelectListEdit.length; i++) {
            if (this.filterSelectList.filterSelectListEdit[i].isDefault) {
              this.defaultNum = i;
              this.oldDefaultNum = i;
              this.filterSeletedNum = i;
              break;
            }
          }
          if (this.isUseFilter && this.defaultNum > -1) {//判断跳转
            this.filterSelectValue = this.filterSelectList.filterSelectListEdit[this.defaultNum].filterName;
            this.selectedFilterValue = this.filterSelectList.filterSelectListEdit[this.defaultNum].filterList;
            this.$emit('query', this.filterSelectList.filterSelectListEdit[this.defaultNum].filterList, true)
          } else {
            this.filterSelectValue = this.filterSelectList.filterSelectListEdit[0].filterName;
            this.selectedFilterValue = this.filterSelectList.filterSelectListEdit[0].filterList;
            this.$emit('query', this.filterSelectList.filterSelectListEdit[0].filterList, true)
          }
        } else {
          this.$emit('query', null, true)
        }
      })
    }
  }
</script>
<style scoped="scoped">
  @import url("../../../assets/css/Modular/search/search.css");
</style>
<style rel="stylesheet/less" lang="scss">
  .search {
    .right {
      padding-right: 13px;
      color: #666666;
      font-size: 13px;
      &:hover {
        color: #0a7af8;
      }
    }
  }

</style>
