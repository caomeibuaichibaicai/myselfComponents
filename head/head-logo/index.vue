<template>
  <router-link :to="link" class="logo fl" :class="{logo2:sidebar.isCollapse}"
               @click.native="logoclick"
  >
    <div class="logo-img"></div>
  </router-link>
</template>
<script>
  import ns from '@/utils/nsQuery/nsQuery'
  import * as store from '@/utils/nsQuery/nsStore';

  export default {
    props: {
      link: {
        type: String,
        default: ''
      },
      imgSrc: {
        type: String,
        default: ''
      }
    },
    computed: {
      sidebar() {
        return this.$store.state.Layout.sidebar;
      }
    },
    methods: {
      //close sidebar of second - nav
      logoclick() {
        store.sideBar.close();
      }
    }
  }
</script>
<style rel="stylesheet/less" lang="scss" scoped>
  @import "../../../../assets/css/mixin/mixin";
  //logo，width值
  $navL: 120px;
  //logo，padding - top/bottom值
  $logo_pt: 3px;
  //logo，padding - left/right值
  $logo_pl: 7px;

  /* logo */
  .logo {
    width: $navL;
    height: 100%;
    padding: $logo_pt $logo_pl;
    background-color: #1a7ef4;
    @include transition(all, .2s, linear);
    @include box-sizing;
    .logo-img {
      width: 100%;
      height: 100%;
      background: url("../../../../assets/img/logo/newsee-logo.png") center no-repeat;
      background-size: cover;
    }
    &.logo2 {
      width: 50px;
      .logo-img {
        background: url("../../../../assets/img/logo/newsee-logo2.png") center no-repeat;
        background-size: cover;
      }
    }
  }
</style>
