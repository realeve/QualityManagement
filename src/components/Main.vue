<template>
  <div class="welcome">
    <div v-for="item in newsList" class=".welcome-center">
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
    computed: {
      newsList() {
        return this.$store.state.mainList;
      },
      user(){
        return this.$store.state.user.username;
      }
    },
    methods: {
      handleTop5NewsItem(title, id, data) {
        let newsItem = {
          title,
          more: '/list/' + title,
          data: [],
          cateId: id
        }

        newsItem.data = data.map(item => {
          let avatar = item.avatar == 1 ? window.btoa(item.avatarkey) : 'Avatar_none';
          return Object.assign(item, {
            img: HOST + '/demo/avatar/' + avatar + '.jpg',
            url: '/view/' + item.id
          })
        });
        this.$store.commit('refreshHomeNewsList', newsItem);
      },
      getTop5News() {

        if (!this.$store.state.needRefreshMainList && this.newsList.length) {
          return;
        }
        
        this.getMyWorkList();

        this.$http.jsonp(settings.api.articleTop5)
          .then(res => {
            let obj = res.data;
            if (obj.rows == 0) {
              return;
            }
            options.category.forEach((item, i) => {
              let news = obj.data.filter(newItem => newItem.category == item.value);
              if (news.length) {
                this.handleTop5NewsItem(item.value, i, news);
              }
            });
            this.$store.commit('refreshMainList', false);
          })
      },
      getMyWorkList() {
        let title = '我的工作列表';
        let id = -1;
        let newsItem = {
          title,
          more: '/list/' + title,
          data: [],
          cateId: id
        }

        this.$http.jsonp(settings.api.myWorkList, {
          params: {
            user: '%'+this.user+'%'
          }
        }).then(res => {
          let obj = res.data;
          if (obj.rows == 0) {
            return;
          }
          let avatar;

          newsItem.data = obj.data.map(item => {
            avatar = item.avatar == 1 ? window.btoa(item.avatarkey) : 'Avatar_none';
            return Object.assign(item, {
              img: HOST + '/demo/avatar/' + avatar + '.jpg',
              url: '/view/' + item.id
            })
          });

          this.$store.commit('refreshHomeNewsList', newsItem);
        });
      }
    },
    activated() {
      // 以下语句一次查询所有结果
      this.getTop5News();
    }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "../assets/css/welcome.css";
  /*瀑布流布局*/

  .welcome {
    column-width: 400px;
    column-gap: 20px;
  }

  .box {
    column-count: 2;
    column-gap: 20px;
  }

</style>
