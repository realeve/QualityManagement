<template>
  <div class="welcome">
    <el-row>
      <el-col :span="24" class="list">
        <my-card :news="news" @loadMore="loadMore"></my-card>
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
          empty: false,
          isLoading: false,
          data: []
        }
      }
    },
    methods: {
      jump(val) {
        this.$message.success('跳转到/#/view/' + val);
      },
      loadListData(url, aid) {
        this.$http.jsonp(url, {
          params: {
            listid: this.$route.params.category,
            aid
          }
        }).then(res => {
          this.news.isLoading = false;
          let obj = res.data;
          if (!obj.rows) {
            this.news.empty = true;
            return;
          }
          this.news.empty = false;

          let avatar;
          let data = [];

          //http://localhost/DataInterface/base64?src=http://localhost/demo/avatar/MTZsaWJpbg==.jpg
          data = obj.data.map(item => {
            avatar = item.avatar == 1 ? window.btoa(item.avatarkey) : 'Avatar_none';
            return Object.assign(item, {
              img: HOST + '/demo/avatar/' + avatar + '.jpg',
              url: '/view/' + item.id
            });
          });

          this.news.data = [...this.news.data, ...data]

          //保存当前新闻列表状态，防止在查看新闻后回退时列表数据为空;
          this.$store.commit('refreshNewsList', {
            title: this.news.title,
            data
          });

          this.$store.commit('recordMaxListId', {
            title: this.news.title,
            id: obj.data[obj.data.length - 1].id
          });
        }).catch(e=>{
          this.news.isLoading = false;
          console.info(e);
        })
      },
      loadMore() {
        if(this.news.isLoading){
          return
        }
        this.news.isLoading = true;
        let curId = this.$store.state.articleId[this.$route.params.category];
        if (typeof curId != 'undefined') {
          console.info('数据载入中,当前文章id:',curId);
          this.loadListData(settings.api.articleList, curId);
        } else {
          this.loadListData(settings.api.articleHome);
        }
      }
    },
    mounted() {

      this.news.title = this.$route.params.category;
      let newsData = this.$store.state.newsList[this.news.title];
      if (typeof newsData == 'undefined') {
        this.loadMore();
      } else {
        this.news.data = newsData;
      }

    }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .list {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  
  .entry-screenshot-image {
    border-radius: 50%;
  }

</style>
