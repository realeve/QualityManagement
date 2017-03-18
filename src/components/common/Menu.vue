<template>
  <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <template v-for="(item,i) in list">
        <el-menu-item v-if="i!=1" :index="i.toString()" :key="i"><router-link :to="item.value">{{item.label}}</router-link></el-menu-item>    
        <el-submenu v-else :index="i.toString()">
          <template slot="title">{{item.label}}</template>
          <el-menu-item v-for="(submenu,j) in category" :index="i+'-'+j" :key="i*10+j"><router-link :to="'/list/'+submenu.value">{{submenu.value}}</router-link></el-menu-item>
        </el-submenu>
      </template>  
  </el-menu>
</template>
<script>
  import options from '../../config/options';
  export default {
    name: 'my-menu',
    data() {
      return {
        list: options.menu,
        category: options.category,
        activeIndex:'0'
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-menu-demo {
    border-radius: 0px;
  }
</style>
