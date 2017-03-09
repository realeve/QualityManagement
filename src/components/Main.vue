<template>
  <div class="welcome">
    <el-row :gutter="20">
      <div v-for="item in newsList">
        <el-col :span="8">
          <my-card :news="item"></my-card>
        </el-col>
      </div>
    </el-row>
  </div>
</template>
<script>
import MyCard from './common/NewsCard';
import options from '../config/options';
import settings from '../config/settings';
const HOST = settings.host;

export default {
  name: 'main',
  components: {
    'my-card': MyCard
  },
  data() {
    return {
      newsList: []
    }
  },
  methods: {
    getNewsList(title, id) {
      var newsItem = {
        title,
        more: '/list/' + title,
        data: []
      }
      var url = HOST + '/DataInterface/Api';
      this.$http.jsonp(url, {
        params: {
          ID: 329,
          M: 0,
          listid: title
        }
      }).then(res => {
        var obj = res.data;
        if (obj.rows == 0) {
          return;
        }
        var avatar;
        newsItem.data = obj.data.map(item => {
          avatar = item.avatar == 1 ? window.btoa(item.avatarkey) : 'Avatar_none';
          return Object.assign(item, {
            img: HOST + '/demo/avatar/' + avatar + '.jpg',
            url: '/view/' + item.id
          })
        });
        this.newsList.push(newsItem);
      });
    },
    loadingData() {
      var topic = options.category.map((item, i) => {
        this.getNewsList(item.value, i);
      })
    }
  },
  mounted() {
    this.loadingData();
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
