<template>
  <div id="app">
    <my-menu/>
    <my-container/>
    <el-footer/>
  </div>
</template>
<script>
import MyMenu from './components/common/Menu';
import MyContainer from './components/common/Container';
import ElFooter from './components/common/Footer';
export default {
  name: 'app',
  components: {
    ElFooter,
    MyMenu,
    MyContainer
  }
}
</script>
<style lang="less" scoped>
body {
  margin: 0;
  width: 100%;
}
</style>
