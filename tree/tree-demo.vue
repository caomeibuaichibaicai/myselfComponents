<template>
  <div>
      <sortable-tree
         v-loading="treeLoading" 
         element-loading-text="拼命加载中" 
         :data="sourceData" 
         childrenAttr="childOwnerHouseBaseInfoTreeNodeList" 
         :draggable="draggable" 
         @changePosition="changePosition" 
         :dragEnable="true" 
         closeStateKey="$foldClose"
      >

      </sortable-tree>
  </div>
</template>
<script>
    import SortableTree from './SortableTree.vue';
    export default {
        name:"ns-tree",
        components:{
            SortableTree,
        },
        props:{

        },
        data() {
            return {
                treeLoading:false,
                sourceData:{},
            }
        },
        methods:{

        },
        created(){

        }
    }
</script>
<style lang="scss">

</style>

