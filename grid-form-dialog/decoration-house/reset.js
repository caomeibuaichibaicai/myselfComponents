//自动表单配置
const resetData = {
	//v-model 绑定字段对象
	"modelData": {
		houseFullName: "",
		ownerName: "",
		certificate: "",
		mobile: "",
		renOwnerName: "",
		renMobile: "",
	},
	//表单信息
	"info": {
		"funcinfoFormlabelwidth": 150,
		"funcinfoFormcols": 2 //表单所占列数
	},
	//表单控件循环信息
	"fields": [
		//房产名称
		{
			"resourcefieldXtype": "text", //表单类型
			"resourcefieldCode": "houseFullName", //表单model字段名称
			"resourcefieldName": "房产名称", //表单字段 lable 名称
			"funcinfoFormlabelwidth": 0, //表单字段 lable 宽度
			"isfieldRequired": false, //是否必填 required
			"resourcefieldBinding": null, //必填出错 提示信息
			"resourcefieldAllowblankexp": null, //内容验证规则
			"resourcefieldVtype": null, //验证字段的内容类型
			"resourcefieldOtherconfigObject": {
				"resourcefieldSecondCode": "ownerName",
				"secondXtype": "span"
			},
			"resourcefieldEmptytext": null, //placeholder的值
			"isResourcefieldRemoved": false, //是否禁用
			"isResourcefieldReadonly": false, //是否只读
			"fieldWidth": 650, //表单元素部分宽度
			"fieldHeight": 32, //表单元素部分高度
			"resourcefieldStep": null, //step 步长
			"resourcefieldRowspan": 10, //row 值 - 所占 行数 （textarea / avatar / span ......）
			"resourcefieldFieldcls": null, //表单控件图标
			"isResourcefieldEditable": false, //是否可编辑
			"resourcefieldColspan": 2, //所占列数
			"items": null, //表单控件内容部分（checkbox，radio......）
			"resourcefieldGroupname": "before", //分组名称
			"isResourcefieldHidden": false, //是否隐藏
			"resourcefieldBindingfnList": []
		},
		//业主名称
		{
			"resourcefieldXtype": "text", //表单类型
			"resourcefieldCode": "ownerName", //表单model字段名称
			"resourcefieldName": "业主名称", //表单字段 lable 名称
			"funcinfoFormlabelwidth": 0, //表单字段 lable 宽度
			"isfieldRequired": false, //是否必填 required
			"resourcefieldBinding": null, //必填出错 提示信息
			"resourcefieldAllowblankexp": null, //内容验证规则
			"resourcefieldVtype": null, //验证字段的内容类型
			"resourcefieldOtherconfigObject": {
				"resourcefieldSecondCode": "ownerName", //如果表单model为object的情况下，可用此属性取其中的值（目前只支持文字标签）
				"secondXtype": "span", //表单控件分支小类type,如input=>input-text,input-textere
				"min": null, //min
				"max": null, //max
			},
			"resourcefieldEmptytext": null, //placeholder的值
			"isResourcefieldRemoved": false, //是否禁用
			"isResourcefieldReadonly": false, //是否只读
			"fieldWidth": 650, //表单元素部分宽度
			"fieldHeight": 32, //表单元素部分高度
			"resourcefieldStep": null, //step 步长
			"resourcefieldRowspan": 10, //row 值 - 所占 行数 （textarea / avatar / span ......）
			"resourcefieldFieldcls": null, //表单控件图标
			"isResourcefieldEditable": false, //是否可编辑
			"resourcefieldColspan": 2, //所占列数
			"items": null, //表单控件内容部分（checkbox，radio......）
			"resourcefieldGroupname": "before", //分组名称
			"isResourcefieldHidden": false, //是否隐藏
			"resourcefieldBindingfnList": []
		},
		//证件号码
		{
			"resourcefieldXtype": "input", //表单类型
			"resourcefieldCode": "certificate", //表单model字段名称
			"resourcefieldName": "证件号码", //表单字段 lable 名称
			"funcinfoFormlabelwidth": 0, //表单字段 lable 宽度
			"isfieldRequired": false, //是否必填 required
			"resourcefieldBinding": null, //必填出错 提示信息
			"resourcefieldAllowblankexp": null, //内容验证规则
			"resourcefieldVtype": null, //验证字段的内容类型
			"resourcefieldOtherconfigObject": {
				"resourcefieldSecondCode": "ownerName", //如果表单model为object的情况下，可用此属性取其中的值（目前只支持文字标签）
				"secondXtype": "link", //表单控件分支小类type,如input=>input-text,input-textere
				"min": null, //min
				"max": null, //max
			},
			"resourcefieldEmptytext": null, //placeholder的值
			"isResourcefieldRemoved": true, //是否禁用
			"isResourcefieldReadonly": true, //是否只读
			"fieldWidth": 350, //表单元素部分宽度
			"fieldHeight": 32, //表单元素部分高度
			"resourcefieldStep": null, //step 步长
			"resourcefieldRowspan": 10, //row 值 - 所占 行数 （textarea / avatar / span ......）
			"resourcefieldFieldcls": null, //表单控件图标
			"isResourcefieldEditable": false, //是否可编辑
			"resourcefieldColspan": 2, //所占列数
			"items": null, //表单控件内容部分（checkbox，radio......）
			"resourcefieldGroupname": "before", //分组名称
			"isResourcefieldHidden": false, //是否隐藏
			"resourcefieldBindingfnList": []
		},
		//移动电话
		{
			"resourcefieldXtype": "input", //表单类型
			"resourcefieldCode": "mobile", //表单model字段名称
			"resourcefieldName": "移动电话", //表单字段 lable 名称
			"funcinfoFormlabelwidth": 0, //表单字段 lable 宽度
			"isfieldRequired": false, //是否必填 required
			"resourcefieldBinding": null, //必填出错 提示信息
			"resourcefieldAllowblankexp": null, //内容验证规则
			"resourcefieldVtype": null, //验证字段的内容类型
			"resourcefieldOtherconfigObject": {
				"resourcefieldSecondCode": "ownerName", //如果表单model为object的情况下，可用此属性取其中的值（目前只支持文字标签）
				"secondXtype": "link", //表单控件分支小类type,如input=>input-text,input-textere
				"min": null, //min
				"max": null, //max
			},
			"resourcefieldEmptytext": null, //placeholder的值
			"isResourcefieldRemoved": true, //是否禁用
			"isResourcefieldReadonly": true, //是否只读
			"fieldWidth": 350, //表单元素部分宽度
			"fieldHeight": 32, //表单元素部分高度
			"resourcefieldStep": null, //step 步长
			"resourcefieldRowspan": 10, //row 值 - 所占 行数 （textarea / avatar / span ......）
			"resourcefieldFieldcls": null, //表单控件图标
			"isResourcefieldEditable": false, //是否可编辑
			"resourcefieldColspan": 2, //所占列数
			"items": null, //表单控件内容部分（checkbox，radio......）
			"resourcefieldGroupname": "before", //分组名称
			"isResourcefieldHidden": false, //是否隐藏
			"resourcefieldBindingfnList": []
		},
		//租户名称
		{
			"resourcefieldXtype": "text", //表单类型
			"resourcefieldCode": "renOwnerName", //表单model字段名称
			"resourcefieldName": "租户名称", //表单字段 lable 名称
			"funcinfoFormlabelwidth": 0, //表单字段 lable 宽度
			"isfieldRequired": false, //是否必填 required
			"resourcefieldBinding": null, //必填出错 提示信息
			"resourcefieldAllowblankexp": null, //内容验证规则
			"resourcefieldVtype": null, //验证字段的内容类型
			"resourcefieldOtherconfigObject": {
				"resourcefieldSecondCode": "ownerName", //如果表单model为object的情况下，可用此属性取其中的值（目前只支持文字标签）
				"secondXtype": "span", //表单控件分支小类type,如input=>input-text,input-textere
				"min": null, //min
				"max": null, //max
			},
			"resourcefieldEmptytext": null, //placeholder的值
			"isResourcefieldRemoved": true, //是否禁用
			"isResourcefieldReadonly": true, //是否只读
			"fieldWidth": 350, //表单元素部分宽度
			"fieldHeight": 32, //表单元素部分高度
			"resourcefieldStep": null, //step 步长
			"resourcefieldRowspan": 10, //row 值 - 所占 行数 （textarea / avatar / span ......）
			"resourcefieldFieldcls": null, //表单控件图标
			"isResourcefieldEditable": false, //是否可编辑
			"resourcefieldColspan": 2, //所占列数
			"items": null, //表单控件内容部分（checkbox，radio......）
			"resourcefieldGroupname": "before", //分组名称
			"isResourcefieldHidden": false, //是否隐藏
			"resourcefieldBindingfnList": []
		},
		//移动电话
		{
			"resourcefieldXtype": "input", //表单类型
			"resourcefieldCode": "renMobile", //表单model字段名称
			"resourcefieldName": "移动电话", //表单字段 lable 名称
			"funcinfoFormlabelwidth": 0, //表单字段 lable 宽度
			"isfieldRequired": false, //是否必填 required
			"resourcefieldBinding": null, //必填出错 提示信息
			"resourcefieldAllowblankexp": null, //内容验证规则
			"resourcefieldVtype": null, //验证字段的内容类型
			"resourcefieldOtherconfigObject": {
				"resourcefieldSecondCode": "ownerName", //如果表单model为object的情况下，可用此属性取其中的值（目前只支持文字标签）
				"secondXtype": "link", //表单控件分支小类type,如input=>input-text,input-textere
				"min": null, //min
				"max": null, //max
			},
			"resourcefieldEmptytext": null, //placeholder的值
			"isResourcefieldRemoved": true, //是否禁用
			"isResourcefieldReadonly": true, //是否只读
			"fieldWidth": 350, //表单元素部分宽度
			"fieldHeight": 32, //表单元素部分高度
			"resourcefieldStep": null, //step 步长
			"resourcefieldRowspan": 10, //row 值 - 所占 行数 （textarea / avatar / span ......）
			"resourcefieldFieldcls": null, //表单控件图标
			"isResourcefieldEditable": false, //是否可编辑
			"resourcefieldColspan": 2, //所占列数
			"items": null, //表单控件内容部分（checkbox，radio......）
			"resourcefieldGroupname": "before", //分组名称
			"isResourcefieldHidden": false, //是否隐藏
			"resourcefieldBindingfnList": []
		},
	]
}

export default resetData;