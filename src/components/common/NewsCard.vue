<template>
  <div>
      <div class=".welcome-center">
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
          </div>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name: 'my-card',
  props:['news'],
  methods: {
    jump(val) {
      this.$router.push(val);
    }
  }
}
</script>
<style lang="less" scoped>

.welcome .entry-box {
  margin-top: 20px;
  border-radius: 4px;
}

.entry-screenshot-image {
  border-radius: 50%;
}

.pointer{
  cursor:pointer;
}
.entries{
  min-height:400px;
}
</style>
