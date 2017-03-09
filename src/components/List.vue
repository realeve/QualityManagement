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
import settings from '../config/settings';
const HOST = settings.host;
export default {
  name: 'list',
  components: {
    'my-card': MyCard
  },
  data() {
    return {
      news: {
        title: '',
        data: []
      }
    }
  },
  methods: {
    jump(val) {
      this.$message.success('跳转到/#/view/' + val);
    }
  },
  mounted() {
    this.title = this.$route.params.category;
    var url = HOST + '/DataInterface/Api';
    this.$http.jsonp(url, {
      params: {
        ID: 329,
        M: 0,
        listid: this.$route.params.category
      }
    }).then(res => {
      var obj = res.data;
      if(!obj.rows){
        return;
      }
      var avatar;
      //http://localhost/DataInterface/base64?src=http://localhost/demo/avatar/MTZsaWJpbg==.jpg
      this.news.data = obj.data.map(item => {
        avatar = item.avatar == 1 ? window.btoa(item.avatarkey) : 'Avatar_none';
        return Object.assign(item, {
          img: HOST + '/demo/avatar/' + avatar + '.jpg',
          url: '/view/' + item.id
        })
      });
    });
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
