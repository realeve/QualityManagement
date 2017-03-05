<template>
  <div class="welcome">
    <el-row :gutter="20">
      <div v-for="i of 6">
        <el-col :span="12">
          <div class=".welcome-center">
            <div class="entry-box">
              <div class="box-title clearfix">
                <div class="float-left">{{title}}</div>
                <a :href="'#/view/list'+i">
                  <div class="float-right">更多</div>
                </a>
              </div>
              <div class="entries">
                <div v-for="n of 5">
                  <div class="entry clearfix" @click="jump(n)">
                    <div class="entry-screenshot float-left">
                      <img class="entry-screenshot-image" src="https://dn-mhke0kuv.qbox.me/9b435ee9cf737862c7e0.png?imageView/1/w/120/h/120/q/100/format/png">
                    </div>
                    <div class="entry-info float-left">
                      <div class="entry-title ellipsis">这是一段质量周段信息这是一段质量周段信息</div>
                      <div class="entry-meta">
                        <div class="action collection-action"><i class="el-icon-star-on"></i><span>424</span></div>
                        <div class="action entry-username">张三</div>
                        <div class="action"> ·</div>
                        <div class="action">5天前</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </div>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'add',
  data() {
    return {
      title: '质量周报'
    }
  },
  methods: {
    jump(val) {
      this.$message.success('跳转到/#/view/' + val);
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../assets/css/welcome.css";
.welcome {
  width: 100%;
}

.welcome .entry-box {
  margin-top: 20px;
  border-radius: 4px;
}

.entry-screenshot-image {
  border-radius: 50%;
}
</style>
