<template>
  <div>
    <div class="entry-box">
      <div class="box-title clearfix">
        <div class="float-left">{{news.title}}</div>
        <a v-if="news.more" class="pointer" @click="jump(news.more)">
          <div class="float-right">更多</div>
        </a>
      </div>
      <div class="entries">
        <div v-for="item in news.data">
          <div class="entry clearfix" @click="jump(item.url)">
            <div class="entry-screenshot float-left">
              <img class="entry-screenshot-image" :src="item.img">
            </div>
            <div class="entry-info float-left">
              <div class="entry-title ellipsis">{{item.title}}</div>
              <div class="entry-meta">
                <div class="action entry-username">{{item.user}}</div>
                <div class="action"> ·</div>
                <div class="action">{{item.datetime}}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="empty" class="text-center">
          已加载到最后
        </div>
      </div>
    </div>
    <div v-if="!news.more" class="center">
      <el-button type="primary" @click="openFullScreen" v-loading.fullscreen.lock="fullscreenLoading">
        显示整页加载，1 秒后消失(此处添加加载更多功能)
      </el-button>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'my-card',
    props: ['news'],
    methods: {
      jump(val) {
        this.$router.push(val);
      },
      openFullScreen() {
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 1000);
      },
    },
    computed: {
      empty() {
        return this.news.data.length < 1;
      }
    },
    data() {
      return {
        fullscreenLoading: false
      }
    },
    mounted() {
      if (this.empty) {
        //无数据时不执行后续
        return;
      }
      this.$store.state.articleId[this.news.title] = this.news.data[0].id;
    }
  }

</script>
<style lang="less" scoped>
  .welcome .entry-box {
    border-radius: 4px;
    margin-bottom: 1.5em;
  }
  .text-center{
    text-align:center;
  }
  .entry-screenshot-image {
    border-radius: 50%;
  }
  
  .list .entry-box {
    width: 800px;
  }
  
  .pointer {
    cursor: pointer;
  }
  
  // .entries {
  //   min-height: 420px;
  // }

</style>
