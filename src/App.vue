<template>
  <div id="app">
    <my-menu/>
    <my-container/>
    <el-footer/>
    <el-login/>
  </div>
</template>
<script>
  import MyMenu from './components/common/Menu';
  import MyContainer from './components/common/Container';
  import ElFooter from './components/common/Footer';
  import ElLogin from './components/common/Login';
  export default {
    name: 'app',
    components: {
      ElFooter,
      MyMenu,
      MyContainer,
      ElLogin
    },
    // methods: {
      
    //   getUserInfo() {
    //     var value = {
    //       id: 16,
    //       name: 'develop',
    //       username: '李宾',
    //       avatar: 'MTZsaWJpbg=='
    //     };
    //     this.$store.commit('setUserInfo', value);
    //   }
    // },
    // mounted() {
    //   this.getUserInfo();
    // }
  }

</script>
<style lang="less" scoped>
  body {
    margin: 0;
    width: 100%;
  }

</style>
