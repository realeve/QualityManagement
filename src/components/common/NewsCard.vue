<template>
  <!--div class="entry-box" v-scroll="loadMore"-->
  <div class="entry-box" v-infinite-scroll="loadMore" infinite-scroll-disabled="news.isLoading" infinite-scroll-distance="10">
    <div class="box-title clearfix">
      <div class="float-left">{{news.title}}</div>
      <router-link v-if="news.more" class="pointer" :to="news.more">
        <div class="float-right more">更多</div>
      </router-link>
    </div>
    <div class="entries">
      <!--enter-class="animated tada" enter-active-class="animated tada" leave-class="animated zoomOut" leave-active-class="animated zoomOut"-->
      <div v-for="(item,i) in news.data" :key="item.id">
        <transition name="fade" tag="div">
          <div class="entry clearfix" @click="jump(item.url)">
            <div class="entry-screenshot float-left">
              <img class="entry-screenshot-image" :src="item.img">
            </div>
            <div class="entry-info float-left">
              <template v-if="item.datetime > now">
                <el-badge value="新" class="item">
                  <div class="entry-title">
                    <span>{{i+1}}.<span v-if="showCategory">『{{item.category}}』 </span>{{item.title}}</span>
                  </div>
                </el-badge>
              </template>
              <template v-else>
                <div class="entry-title">
                  <span>{{i+1}}.<span v-if="showCategory">『{{item.category}}』 </span>{{item.title}}</span>
                </div>
              </template>

              <div class="entry-meta">
                <div class="action entry-username">{{item.user}}</div>
                <div class="action"> ·</div>
                <div class="action">{{item.datetime}}</div>
                <div class="action">
                  <el-tag type="danger" v-if="0 == item.status">未完成</el-tag>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div v-if="!news.more" @click="loadMore" class="entry">
        <div class="loading-info" v-html="info"></div>
      </div>

    </div>
  </div>
</template>
<script>
  import util from '../../config/util';
  export default {
    name: 'my-card',
    props: ['news'],
    computed: {
      showCategory() {
        return typeof this.news.showCategory == 'undefined' ? false : this.news.showCategory;
      },
      now() {
        return util.getNow(6);
      },
      info() {
        if (this.news.isLoading) {
          return '<i class="el-icon-loading"></i> 正在加载...';
        } else if (this.news.empty) {
          return '加载完毕'
        } else {
          return '点击载入更多'
        }
      }
    },
    methods: {
      jump(url) {
        this.$router.push(url);
      },
      loadMore() {
        if (!this.news.empty) {
          this.$emit('loadMore');
        }
      },
    }
  }

</script>
<style lang="less" scoped>
  .welcome .entry-box {
    border-radius: 4px;
    margin-bottom: 1.5em;
    .box-title {
      font-size: 1.4em;
    }
    .more {
      font-size: 12pt;
    }
  }

  .loading-info {
    padding: 15px 0;
    text-align: center;
  }

  .entry-screenshot-image {
    border-radius: 50%;
  }

  .list .entry-box {
    padding: 30px 100px;
  }

  .pointer {
    cursor: pointer;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 1s;
  }

  .fade-move {
    transition: transform 1s;
  }

  .fade-enter,
  .fade-leave {
    opacity: 0; //transform:translateY(50px);
  }

</style>
