<template>
  <div>
    <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <div v-for="(item,i) in list">
        <el-menu-item :index="i.toString()">{{item}}</el-menu-item>
      </div>
    </el-menu>
  </div>
</template>
<script>
const routeList = ['/', '/list', '/view', '/add']
export default {
  name: 'my-menu',
  data() {
    return {
      activeIndex: '',
      list: ['首页', '查看列表', '查看详情', '新增']
    }
  },
  methods: {
    handleSelect(key) {
      this.$router.push(routeList[key]);
    }
  },
  created() {
    switch (this.$route.name) {
      case 'Main':
        this.activeIndex = '0';
        break;
      case 'List':
        this.activeIndex = '1';
        break;
      case 'View':
        this.activeIndex = '2';
        break;
      case 'Add':
        this.activeIndex = '3';
        break;
    }
  }
}
</script>
<style lang="less" scoped>
.el-menu-demo {
  border-radius: 0px;
}
</style>
