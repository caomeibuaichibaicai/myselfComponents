<template>
	<div class="button_wrap" id="button_wrap">
		<el-dropdown trigger="click" @command="commandBack">
		  	<span class="el-dropdown-link">
				合计
				<i class="el-icon-caret-bottom el-icon--right"></i>
  			</span>
			<el-dropdown-menu slot="dropdown" class="grid_button_ul">
				<el-dropdown-item command="part" :class="iClass1">分页合计</el-dropdown-item>
				<el-dropdown-item command="total" :class="iClass2">全部合计</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	</div>
</template>

<script>
	import { houseTotalFetch } from '@/api/gridTotalButton'
	export default {
		name: "total-button",
		data() {
			return {
				iClass1:"active",
				iClass2:"",
				saveData:{},
			}
		},
		props: {
			searchConfig: {
				type: Object
			},
			funcId:{
				type: null
			},
			totalData:{
				type: Object
			},
		},
		methods: {
			//分页模式切换回调
			commandBack(param) {
				if(param === 'part') {
					this.itemBgcolorSwitch('part');
					this.$emit('query',this.saveData)
				} else {
					this.itemBgcolorSwitch('total')
					houseTotalFetch(this.searchConfig,{funcId:this.funcId}).then((r) => {
						this.$emit('query',r.resultData)
					});
				}
			},
			//item背景切换
			itemBgcolorSwitch(type){
				if(type==="part"){
					this.iClass1 = "active"
					this.iClass2 = ""
				}else if(type==="total"){
					this.iClass1 = "";
					this.iClass2 = "active"
				}
			},
			//保存分页统计
			copyTdata(){
				this.saveData = JSON.parse(this.JSONstringify(this.totalData));
			},
			handleCircular() {  
			    let cache = [];
			    let keyCache = []
			    return function(key, value) {
			        if (typeof value === 'object' && value !== null) {
			            let index = cache.indexOf(value);
			            if (index !== -1) {
			                return '[Circular ' + keyCache[index] + ']';
			            }
			            cache.push(value);
			            keyCache.push(key || 'root');
			        }
			        return value;
			    }
			},
			JSONstringify(value, replacer, space) {  
			    replacer = replacer || this.handleCircular();
			    return JSON.stringify(value, replacer, space);
			},
			//初始化
			init(){
				this.copyTdata();
			},
		},
		watch:{
			
		},
		created(){
			this.init();
		}
	}
</script>

<style rel="stylesheet/less" lang="scss">
	#button_wrap {
		width: 100%;
		height: 100%;
		.el-dropdown {
			width: 100%;
			margin-top:13px;
			.el-dropdown-selfdefine{
				padding: 0px 2px;
				margin-right: 0;
				margin-left: 8px;
			}
		}
	}
	
	.grid_button_ul {
		min-width: 78px;
		.el-dropdown-menu__item.active{
			background: #e4e8f1;
		}
	}
</style>