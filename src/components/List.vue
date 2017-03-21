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
    computed: {
      category() {
        return this.$route.params.category;
      }
    },
    watch: {
      category() {
        this.initData();
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
          if (0 == obj.rows) {
            this.news.empty = true;
            if (typeof aid == 'undefined') {
              this.news.data = [];
            }
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
            title: this.category,
            data
          });

          this.$store.commit('recordMaxListId', {
            title: this.category,
            id: obj.data[obj.data.length - 1].id
          });
        }).catch(e => {
          this.news.isLoading = false;
          console.info(e);
        })
      },
      loadMore() {
        if (this.news.isLoading) {
          return
        }
        this.news.isLoading = true;
        let curId = this.$store.state.articleId[this.category];
        if (typeof curId == 'undefined') {
          this.loadListData(settings.api.articleHome);
        } else {
          console.info('数据载入中,当前文章id:', curId);
          this.loadListData(settings.api.articleList, curId);
        }
      },
      initData() {
        this.news.title = this.category;
        let newsData = this.$store.state.newsList[this.category];
        this.loadMore();

        if (typeof newsData == 'undefined') {} else {
          this.news.data = newsData;
        }
      }
    },
    mounted() {
      this.initData();
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
