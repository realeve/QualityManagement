<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'my-container'
}
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  padding: 0 20px;
}
</style>
