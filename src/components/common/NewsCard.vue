<template>
  <!--div class="entry-box" v-scroll="loadMore"-->
  <div class="entry-box" v-infinite-scroll="loadMore" infinite-scroll-disabled="news.isLoading" infinite-scroll-distance="10">
    <div class="box-title clearfix">
      <div class="float-left">{{news.title}}</div>
      <a v-if="news.more" class="pointer" @click="jump(news.more)">
        <div class="float-right">更多</div>
      </a>
    </div>
    <div class="entries">
      <div v-for="(item,i) in news.data">
        <div class="entry clearfix" @click="jump(item.url)">
          <div class="entry-screenshot float-left">
            <img class="entry-screenshot-image" :src="item.img">
          </div>
          <div class="entry-info float-left">
            <div class="entry-title ellipsis">{{i+1}}.{{item.title}}</div>
            <div class="entry-meta">
              <div class="action entry-username">{{item.user}}</div>
              <div class="action"> ·</div>
              <div class="action">{{item.datetime}}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!news.more" @click="loadMore" class="entry">
        <div class="text-center">
          {{info}}
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  export default {
    name: 'my-card',
    props: ['news'],
    // directives: {
    //   scroll: {
    //     bind: function (el, binding) {
    //       window.addEventListener('scroll', () => {
    //         if (document.body.scrollTop + window.innerHeight >= el.clientHeight + 120) {
    //           let next = binding.value;
    //           next();
    //         }
    //       });
    //     }
    //   }
    // },
    methods: {
      jump(val) {
        this.$router.push(val);
      },
      loadMore() {
        if (!this.news.empty) {
          this.$emit('loadMore');
        }
      },
    },
    computed: {
      info() {
        if (this.news.isLoading) {
          return '正在加载...';
        } else if (this.news.empty) {
          return '加载完毕'
        } else {
          return '点击载入更多'
        }
      }
    }
  }

</script>
<style lang="less" scoped>
  .welcome .entry-box {
    border-radius: 4px;
    margin-bottom: 1.5em;
  }
  
  .text-center {
    text-align: center;
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

</style>
