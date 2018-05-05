<template>
	<el-tooltip class="help"  effect="dark" :content="content" placement="top">
		<ns-icon-svg class="aa"  icon-class="quesition-circle"></ns-icon-svg>
	</el-tooltip>
	
</template>

<script>
	export default {
		  props: {
	 'content': {
	 	
		        type: String,
		        default:''
		      },
		    }
		  }
</script>

<style scoped="scoped"> 
	 
  .help {
    height: 15px !important;
    border: none;
    padding-right: 0px;
    margin-left: -10px;
    margin-top: -4px;
  }
	
</style>