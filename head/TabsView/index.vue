<!--tabs-view-->
<template>
  <div class='tabs-view-container' :class="visitedView.length?'tag-view-show':''">
    <router-link class="tabs-view" :class="isActive(tag.path)?'tag-active':''"
                 v-for="tag in Array.from(visitedView)" :to="tag.path" :key="tag.path" @click.native='tabsjump(tag)'>
      <el-tag :closable="true" @close='closeViewTabs(tag,$event)'>
        <span class="el-tag-text"> {{tag.name}}</span>
      </el-tag>
    </router-link>
    <div class="tabs-view-allClose fr" @click="closeAllViewTabs" v-show="visitedView.length">
      <ns-icon-svg icon-class="CombinedShapeCopy"></ns-icon-svg>
    </div>
  </div>
</template>
<script>
  import Cookies from 'js-cookie';
  import ns from '@/utils/nsQuery/nsQuery'
  import * as store from '@/utils/nsQuery/nsStore'

  export default {
    name: 'tabs-view',
    data() {
      return {
//        welcomeRouter:  '/home/dashboard',
        welcomeRouter: '/masterData/entityList',//默认初始路由地址（主页路由地址）
      };
    },
    computed: {
      visitedView() {
//        console.log('* ============================= *')
//        console.log('上方显示历史访问tab标签列表如下：')
//        console.log(this.$store.state.tabView.visitedViews.slice(-this.$store.state.tabView.limit))
//        console.log('* ============================= *')
        return this.$store.state.tabView.visitedViews.slice(-this.$store.state.tabView.limit); //select the first 6 objects in the visited-views array
      }
    },
    methods: {
      //close this tab
      closeViewTabs(view, $event) {
        this.$store.dispatch('delVisitedViews', view).then(
          () => {
            $event.preventDefault();
            const l = this.visitedView.length
            /*
            * 判断删除的标签是否为当前页面标签：
            * 是：=>
            *      判断删除后的标签列表长度是否大于0？
            *             =>大于0则跳转到最后一个标签页面，等于0则回到主页
            * 否：=>
            *      直接跳回到主页
            */
            if (store.currentPageInfo.get().path === view.path) {
              this.$router.push({path: l > 0 ? this.visitedView[l - 1].path : this.welcomeRouter});
            }
          }
        );
      },
      //close all tabs
      closeAllViewTabs() {
        this.$store.dispatch('delAllVisitedViews').then(() => {
          this.$router.push({path: this.welcomeRouter});//回到主页
        });
      },
      //judge tab is active or not
      isActive(path) {
        return path === this.$route.path;
      },
      //click tab jump
      tabsjump(tag) {
        //点击上方历史记录选项卡的时候，若是跳转地址为主页（/dashboard），则关闭二级菜单，满工作台显示，除此之外则打开二级菜单，常规显示
//        tag.path === '/home/dashboard' ? store.sideBar.close() : store.sideBar.open();
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "./tabsView";
</style>
