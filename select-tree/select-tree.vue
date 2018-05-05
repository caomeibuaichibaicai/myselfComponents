<template>
	<div>
		<el-tree :data="regions"  show-checkbox @check-change="handleCheckChange">
		</el-tree>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				regions: [{
					'label': 'region1',
					'value':'abc',
					children:[{'label': 'region1-1',children:[{
					'label': 'region2'
				},{
					'label': 'region2'
				}]}]
				}, {
					'label': 'region2'
				}],
			};
		},
		methods: {
			handleCheckChange(data, checked, indeterminate) {
				console.log(data, checked, indeterminate);
				console.log(data.label)
				console.log(1)
			},
			handleNodeClick(data) {
				console.log(data);
			},
		}
	};
</script>
<style>
	.red {
		color: red !important;
	}
</style>