<template>
  <div id="app">
    <my-menu/>
    <my-container/>
    <el-footer/>
  </div>
</template>
<script>
import MyMenu from './components/Menu';
import MyContainer from './components/Container';
import ElFooter from './components/Footer';
export default {
  name: 'app',
  components: {
    ElFooter,
    MyMenu,
    MyContainer
  }
}
</script>
<style lang="less">
body {
  margin: 0;
  width: 100%;
}
</style>
