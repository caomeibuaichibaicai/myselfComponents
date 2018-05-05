<!--顶部栏目 右侧 头像操作模块-->
<template>
  <el-dropdown class="avatar-container fr" id="avatar-container" :trigger="handleStyle">
    <div class="avatar-wrapper">
      <img class="user-avatar" :src="avator" v-if="avator">
      <p class="hello fr"><span>{{userName}}</span></p>
      <i class="el-icon-caret-bottom"></i>
    </div>
    <el-dropdown-menu class="user-dropdown" slot="dropdown">
      <!--<el-dropdown-item divided>-->
        <!--<router-go class="nav-link" url="/home/dashboard">主页</router-go>-->
      <!--</el-dropdown-item>-->
      <el-dropdown-item >
        <span @click="logout">退出登录</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
  export default {
    name: 'avatar-container',
    props: {
      userName: {type: [String, Number], default: '用户'},
      avator: {type: String, default: '\'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif\''},
      handleStyle: String
    },
    data() {
      return {};
    },
    methods: {
      logout() {
        //login out,empty store and cookie by fun of 'loginout'
        this.user.loginout(
          () => {
            this.$store.dispatch('delAllVisitedViews');
            this.$router.push({path: '/front/login'});
          }
        )
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .avatar-container {
    display: inline-block;
    height: 100%;
    cursor: pointer;
    .avatar-wrapper {
      // 欢迎 名字
      p.hello {
        height: 100%;
        font-size: 14px;
        font-weight: bold;
        margin: 0 5px 0 10px;
        span {
          padding-left: 5px;
          font-size: 14px;
        }
      }
      i {
        position: absolute;
        font-size: 12px;
      }
    }
    .el-dropdown-menu {
      margin: 0 !important;
    }
  }
</style>
