<template>
  <div class="welcome">
    <el-row :gutter="20">
      <div v-for="(item,i) in newsList">
        <el-col :span="12">
          <my-card :news="item" :listId="i"></my-card>
        </el-col>
      </div>
    </el-row>
  </div>
</template>
<script>
import MyCard from './common/NewsCard';

//测试数据-新闻列表
import newsList from "../config/newsList";

export default {
  name: 'main',
  components: {
    'my-card': MyCard
  },
  data() {
    return {
      newsList: newsList.data
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../assets/css/welcome.css";
.welcome {
  width: 100%;
}
</style>
