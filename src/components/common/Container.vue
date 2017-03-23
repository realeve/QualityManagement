<template>
  <div class="container">
    <keep-alive>
    <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: 'my-container'
}
</script>
<style scoped>
.container {
  width: 100%;
}
</style>
