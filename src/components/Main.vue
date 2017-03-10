<template>
  <div class="welcome">
    <!--<el-row :gutter="20">
      <div v-for="item in newsList">
        <el-col :xs="24" :sm="12" :lg="8" class="containt">
          <my-card :news="item"></my-card>
        </el-col>
      </div>
    </el-row>-->
    <div v-for="item in newsList"  class=".welcome-center">
      <my-card :news="item"></my-card>
    </div>
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

        this.$http.jsonp(settings.api.articleHome, {
          params: {
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
    created() {
      this.loadingData();
    }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "../assets/css/welcome.css";
  /*瀑布流布局*/
  
  .welcome {
    column-width: 400px;
    -webkit-column-width: 400px;
    -moz-column-width: 400px;
    -o-column-gap: 20px;
    -webkit-column-gap: 20px;
    -moz-column-gap: 20px;
    margin-top:20px;
  }
  
  .box {
    column-count: 2;
    -webkit-column-count: 2;
    -moz-column-count: 2;
    -o-column-gap: 20px;
    -webkit-column-gap: 20px;
    -moz-column-gap: 20px;
  }

</style>
