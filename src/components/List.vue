<template>
  <div class="welcome">
    <el-row>
      <el-col :span="24">
        <my-card :news="news"></my-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import MyCard from './common/NewsCard';

export default {
  name: 'list',
  components: {
    'my-card': MyCard
  },
  data() {
    return {
      news: {
        title: 'test1',
        data: [{
          img: 'http://localhost/demo/avatar/Avatar_none.jpg',
          title: '这是一段质量周段信息这是一段质量周段信息',
          count: 421,
          user: '张三',
          datetime: '2017-03-06 09:23',
          id: 211,
          url: '/view/211'
        }, {
          img: 'http://localhost/demo/avatar/Avatar_none.jpg',
          title: '这是一段质量周段信息这是一段质量周段信息',
          count: 421,
          user: '张三',
          datetime: '2017-03-06 09:23',
          id: 211,
          url: '/view/211'
        }, {
          img: 'http://localhost/demo/avatar/Avatar_none.jpg',
          title: '这是一段质量周段信息这是一段质量周段信息',
          count: 421,
          user: '张三',
          datetime: '2017-03-06 09:23',
          id: 211,
          url: '/view/211'
        }, {
          img: 'http://localhost/demo/avatar/Avatar_none.jpg',
          title: '这是一段质量周段信息这是一段质量周段信息',
          count: 421,
          user: '张三',
          datetime: '2017-03-06 09:23',
          id: 211,
          url: '/view/211'
        }]
      }
    }
  },
  methods: {
    jump(val) {
      this.$message.success('跳转到/#/view/' + val);
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*@import "../assets/css/welcome.css";*/

.welcome {
  width: 100%;
}

.welcome .entry-box {
  margin-top: 20px;
  border-radius: 4px;
}

.entry-screenshot-image {
  border-radius: 50%;
}
</style>
