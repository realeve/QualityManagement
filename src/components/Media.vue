<template>
  <div class="content">
    <el-row>
      <el-col :md="16" :sm="24" :xs="24">
        <el-tabs v-model="activeName">
          <el-tab-pane v-for="tab in tabList" :label="tab.label" :name="tab.value" :key="tab.value">
            <media-gallery :type="tab.value" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :md="8" :sm="24" :xs="24">
        <div class="upload">
          <h3>素材上传</h3>
          <attach :listType="'picture'" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import options from '../config/options';
  import Attach from './common/Attach';
  import MediaGallery from './common/MediaGallery';

  import settings from '../config/settings';
  import util from '../config/util';
  const HOST = settings.host;

  export default {
    name: 'media',
    components: {
      Attach,
      MediaGallery
    },
    data() {
      return {
        activeName: 'image',
        tabList: options.mediaList
      }
    },
    computed: {
      user() {
        return this.$store.state.user;
      },
      mediaList: {
        get() {
          return this.$store.state.mediaList;
        },
        set(val) {
          this.$store.commit('updateMediaList', val);
        }
      }
    },
    watch: {
      user() {
        //图像列表为异步结果，需要在下个周期载入数据
        this.$nextTick(() => {
          this.initData();
        });
      }
    },
    methods: {
      initData() {
        this.$http.jsonp(settings.api.mediaList, {
            params: {
              uid: this.user.id
            }
          })
          .then(res => {
            let obj = res.data;
            if (obj.rows == 0) {
              return;
            }
            this.mediaList = obj.data;
          })
          .catch(e => {
            console.log(e);
          })
      }
    }
  }

</script>
<style lang="less" scoped>
  .margin-top-20 {
    margin-top: 20px;
  }
  
  .content {
    .margin-top-20;
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    min-height: 600px;
  }
  
  h3 {
    font-weight: 300;
  }
  
  .el-upload-dragger {
    width: 260px;
  }
  
  .upload {
    margin-left: 20px;
  }

</style>
