<template>
  <div class="welcome">
    <el-row>
      <el-col :span="24" class="list">
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
        },
        curId: this.$store.state.articleId[this.$route.params.category]
      }
    },
    methods: {
      jump(val) {
        this.$message.success('跳转到/#/view/' + val);
      },
      loadListData(url,id) {
        this.news.title = this.$route.params.category;
        this.$http.jsonp(url, {
          params: {
            listid: this.$route.params.category,
            aid: id
          }
        }).then(res => {
          var obj = res.data;
          if (!obj.rows) {
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
    },
    mounted(){
      if(typeof this.curId!='undefined'){
        this.loadListData(settings.api.articleList,this.curId);
      }else{
        this.loadListData(settings.api.articleHome);
      }      
    }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .list{
    width:100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  
  .entry-screenshot-image {
    border-radius: 50%;
  }

</style>
