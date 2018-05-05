//自动表单配置
const resetData = {
	//v-model 绑定字段对象
	"modelData": {
		"account": "",
		"accountName": "",
		"bankAddress": "",
		"bankName": "",
		"collectionNumber": "",
		"handlerId": "",
		"isEnable": true,
		"ownerBankAccountId": "",
		"ownerId": "",
		"protocolNumber": "",
		"remark": ""
	},
	//表单信息
	"info": {
		"funcinfoFormlabelwidth": 150,
		"funcinfoFormcols": 2 //表单所占列数
	},
	//表单控件循环信息
	"fields": [
		//开户银行
		{
			"resourcefieldXtype": "input", //表单类型
			"resourcefieldCode": "bankName", //表单model字段名称
			"resourcefieldName": "开户银行", //表单字段 lable 名称
			"isfieldRequired": true, //是否必填 required
			"resourcefieldBinding": "请输入开户银行", //必填出错 提示信息
			"resourcefieldAllowblankexp": null, //内容验证规则
			"resourcefieldVtype": 'string', //验证字段的 内容类型
			"resourcefieldOtherconfigObject": null,
			"resourcefieldEmptytext": "请输入开户银行", //placeholder的值
			"isResourcefieldRemoved": false, //是否禁用
			"isResourcefieldReadonly": false, //是否只读
			"fieldWidth": 350, //表单元素部分宽度
			"fieldHeight": 32, //表单元素部分高度
			"min": null, //min
			"max": 50, //max
			"resourcefieldStep": null, //step 步长
			"resourcefieldRowspan": null, //row 值 - 所占 行数 （textarea / avatar / span ......）
			"resourcefieldFieldcls": null, //表单控件图标
			"isResourcefieldEditable": false, //是否可编辑
			"resourcefieldColspan": 1, //所占列数
			"items": null, //表单控件内容部分（checkbox，radio......）
			"resourcefieldGroupname": null, //分组名称
			"isResourcefieldHidden": false, //是否隐藏
			"resourcefieldBindingfnList": [], //事件名称集合
		},
		//是否启用
		{
			"resourcefieldXtype": "switch", //表单类型
			"resourcefieldCode": "isEnable", //表单model字段名称
			"resourcefieldName": "是否启用", //表单字段 lable 名称
			"isfieldRequired": false, //是否必填 required
			"resourcefieldBinding": "", //必填出错 提示信息
			"resourcefieldAllowblankexp": null, //内容验证规则
			"resourcefieldVtype": "boolean", //验证字段的内容类型
			"resourcefieldOtherconfigObject": {
				"label-width": 100,
				"secondXtype": null, //表单控件分支小类type,如input=>input-text,input-textere
				"freedom": true, //el-form-item / ns-muster-item 自由宽度开关 （ 其宽度有实际子内容宽度决定，不再由基础最大宽度控制 ），浮动依次排列
				"min": null, //min
				"max": null, //max
			},
			"resourcefieldEmptytext": null, //placeholder的值
			"isResourcefieldRemoved": false, //是否禁用
			"isResourcefieldReadonly": false, //是否只读
			"fieldWidth": 300, //表单元素部分宽度
			"fieldHeight": 32, //表单元素部分高度
			"resourcefieldStep": null, //step 步长
			"resourcefieldRowspan": null, //row 值 - 所占 行数 （textarea / avatar / span ......）
			"resourcefieldFieldcls": null, //表单控件图标
			"isResourcefieldEditable": false, //是否可编辑
			"resourcefieldColspan": 1, //所占列数
			"items": null, //表单控件内容部分（checkbox，radio......）
			"resourcefieldGroupname": "group-newOwner", //分组名称
			"isResourcefieldHidden": false, //是否隐藏
			"resourcefieldBindingfnList": [], //事件名称集合
		},
		//银行地址
		{
			"resourcefieldXtype": "input", //表单类型
			"resourcefieldCode": "bankAddress", //表单model字段名称
			"resourcefieldName": "银行地址", //表单字段 lable 名称
			"isfieldRequired": false, //是否必填 required
			"resourcefieldBinding": "请输入银行地址", //必填出错 提示信息
			"resourcefieldAllowblankexp": null, //内容验证规则
			"resourcefieldVtype": 'string', //验证字段的 内容类型
			"resourcefieldOtherconfigObject": null,
			"resourcefieldEmptytext": "请输入银行地址", //placeholder的值
			"isResourcefieldRemoved": false, //是否禁用
			"isResourcefieldReadonly": false, //是否只读
			"fieldWidth": 650, //表单元素部分宽度
			"fieldHeight": 32, //表单元素部分高度
			"min": null, //min
			"max": 50, //max
			"resourcefieldStep": null, //step 步长
			"resourcefieldRowspan": null, //row 值 - 所占 行数 （textarea / avatar / span ......）
			"resourcefieldFieldcls": null, //表单控件图标
			"isResourcefieldEditable": false, //是否可编辑
			"resourcefieldColspan": 2, //所占列数
			"items": null, //表单控件内容部分（checkbox，radio......）
			"resourcefieldGroupname": null, //分组名称
			"isResourcefieldHidden": false, //是否隐藏
			"resourcefieldBindingfnList": [], //事件名称集合
		},
		//开户名称
		{
			"resourcefieldXtype": "input", //表单类型
			"resourcefieldCode": "accountName", //表单model字段名称
			"resourcefieldName": "开户名称", //表单字段 lable 名称
			"isfieldRequired": true, //是否必填 required
			"resourcefieldBinding": "请输入开户名称", //必填出错 提示信息
			"resourcefieldAllowblankexp": null, //内容验证规则
			"resourcefieldVtype": 'string', //验证字段的 内容类型
			"resourcefieldOtherconfigObject": null,
			"resourcefieldEmptytext": "请输入开户名称", //placeholder的值
			"isResourcefieldRemoved": false, //是否禁用
			"isResourcefieldReadonly": false, //是否只读
			"fieldWidth": 350, //表单元素部分宽度
			"fieldHeight": 32, //表单元素部分高度
			"min": null, //min
			"max": 50, //max
			"resourcefieldStep": null, //step 步长
			"resourcefieldRowspan": null, //row 值 - 所占 行数 （textarea / avatar / span ......）
			"resourcefieldFieldcls": null, //表单控件图标
			"isResourcefieldEditable": false, //是否可编辑
			"resourcefieldColspan": 1, //所占列数
			"items": null, //表单控件内容部分（checkbox，radio......）
			"resourcefieldGroupname": null, //分组名称
			"isResourcefieldHidden": false, //是否隐藏
			"resourcefieldBindingfnList": [], //事件名称集合
		},
		//银行账号
		{
			"resourcefieldXtype": "input", //表单类型
			"resourcefieldCode": "account", //表单model字段名称
			"resourcefieldName": "银行账号", //表单字段 lable 名称
			"isfieldRequired": true, //是否必填 required
			"resourcefieldBinding": "请输入银行账号", //必填出错 提示信息
			"resourcefieldAllowblankexp": null, //内容验证规则
			"resourcefieldVtype": 'string', //验证字段的 内容类型
			"resourcefieldOtherconfigObject": {
				"label-width": 100,
				"secondXtype": null, //表单控件分支小类type,如input=>input-text,input-textere
				"freedom": true, //el-form-item / ns-muster-item 自由宽度开关 （ 其宽度有实际子内容宽度决定，不再由基础最大宽度控制 ），浮动依次排列
				"min": null, //min
				"max": 50, //max
			},
			"resourcefieldEmptytext": "请输入银行账号", //placeholder的值
			"isResourcefieldRemoved": false, //是否禁用
			"isResourcefieldReadonly": false, //是否只读
			"fieldWidth": 300, //表单元素部分宽度
			"fieldHeight": 32, //表单元素部分高度
			"min": null, //min
			"max": 50, //max
			"resourcefieldStep": null, //step 步长
			"resourcefieldRowspan": null, //row 值 - 所占 行数 （textarea / avatar / span ......）
			"resourcefieldFieldcls": null, //表单控件图标
			"isResourcefieldEditable": false, //是否可编辑
			"resourcefieldColspan": 1, //所占列数
			"items": null, //表单控件内容部分（checkbox，radio......）
			"resourcefieldGroupname": null, //分组名称
			"isResourcefieldHidden": false, //是否隐藏
			"resourcefieldBindingfnList": [], //事件名称集合
		},
		//银行协议号
		{
			"resourcefieldXtype": "input", //表单类型
			"resourcefieldCode": "protocolNumber ", //表单model字段名称
			"resourcefieldName": "银行协议号", //表单字段 lable 名称
			"isfieldRequired": false, //是否必填 required
			"resourcefieldBinding": "请输入银行协议号", //必填出错 提示信息
			"resourcefieldAllowblankexp": null, //内容验证规则
			"resourcefieldVtype": 'string', //验证字段的 内容类型
			"resourcefieldOtherconfigObject": null, //max
			"resourcefieldEmptytext": "请输入银行协议号", //placeholder的值
			"isResourcefieldRemoved": false, //是否禁用
			"isResourcefieldReadonly": false, //是否只读
			"fieldWidth": 350, //表单元素部分宽度
			"fieldHeight": 32, //表单元素部分高度
			"min": null, //min
			"max": 50, //max
			"resourcefieldStep": null, //step 步长
			"resourcefieldRowspan": null, //row 值 - 所占 行数 （textarea / avatar / span ......）
			"resourcefieldFieldcls": null, //表单控件图标
			"isResourcefieldEditable": false, //是否可编辑
			"resourcefieldColspan": 1, //所占列数
			"items": null, //表单控件内容部分（checkbox，radio......）
			"resourcefieldGroupname": null, //分组名称
			"isResourcefieldHidden": false, //是否隐藏
			"resourcefieldBindingfnList": [], //事件名称集合
		},
		//托收编号
		{
			"resourcefieldXtype": "input", //表单类型
			"resourcefieldCode": "collectionNumber", //表单model字段名称
			"resourcefieldName": "托收编号", //表单字段 lable 名称
			"isfieldRequired": false, //是否必填 required
			"resourcefieldBinding": "请输入托收编号", //必填出错 提示信息
			"resourcefieldAllowblankexp": null, //内容验证规则
			"resourcefieldVtype": 'string', //验证字段的 内容类型
			"resourcefieldOtherconfigObject": {
				"label-width": 100,
				"secondXtype": null, //表单控件分支小类type,如input=>input-text,input-textere
				"freedom": true, //el-form-item / ns-muster-item 自由宽度开关 （ 其宽度有实际子内容宽度决定，不再由基础最大宽度控制 ），浮动依次排列
				"min": null, //min
				"max": 50, //max
			},
			"resourcefieldEmptytext": "请输入托收编号", //placeholder的值
			"isResourcefieldRemoved": false, //是否禁用
			"isResourcefieldReadonly": false, //是否只读
			"fieldWidth": 300, //表单元素部分宽度
			"fieldHeight": 32, //表单元素部分高度
			"min": null, //min
			"max": 50, //max
			"resourcefieldStep": null, //step 步长
			"resourcefieldRowspan": null, //row 值 - 所占 行数 （textarea / avatar / span ......）
			"resourcefieldFieldcls": null, //表单控件图标
			"isResourcefieldEditable": false, //是否可编辑
			"resourcefieldColspan": 1, //所占列数
			"items": null, //表单控件内容部分（checkbox，radio......）
			"resourcefieldGroupname": null, //分组名称
			"isResourcefieldHidden": false, //是否隐藏
			"resourcefieldBindingfnList": [], //事件名称集合
		},
		//备注
		{
			"resourcefieldXtype": "input", //表单类型
			"resourcefieldCode": "remark", //表单model字段名称
			"resourcefieldName": "备注", //表单字段 lable 名称
			"isfieldRequired": false, //是否必填 required
			"resourcefieldBinding": "请输入备注", //必填出错 提示信息
			"resourcefieldAllowblankexp": null, //内容验证规则
			"resourcefieldVtype": 'string', //验证字段的 内容类型
			"resourcefieldOtherconfigObject": {
				"secondXtype": "textarea", //表单控件分支小类type,如input=>input-text,input-textere
				"freedom": true, //el-form-item / ns-muster-item 自由宽度开关 （ 其宽度有实际子内容宽度决定，不再由基础最大宽度控制 ），浮动依次排列
			},
			"resourcefieldEmptytext": "请输入备注", //placeholder的值
			"isResourcefieldRemoved": false, //是否禁用
			"isResourcefieldReadonly": false, //是否只读
			"fieldWidth": 650, //表单元素部分宽度
			"fieldHeight": 'auto', //表单元素部分高度
			"min": null, //min
			"max": 250, //max
			"resourcefieldStep": null, //step 步长
			"resourcefieldRowspan": null, //row 值 - 所占 行数 （textarea / avatar / span ......）
			"resourcefieldFieldcls": null, //表单控件图标
			"isResourcefieldEditable": false, //是否可编辑
			"resourcefieldColspan": 2, //所占列数
			"items": null, //表单控件内容部分（checkbox，radio......）
			"resourcefieldGroupname": null, //分组名称
			"isResourcefieldHidden": false, //是否隐藏
			"resourcefieldBindingfnList": [], //事件名称集合
		},
	]
}

export default resetData;