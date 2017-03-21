<template>
  <div class="content">
    <el-row>
      <el-col :md="20" :sm="24" :xs="24">
        <el-tabs v-model="activeName">
          <el-tab-pane v-for="tab in tabList" :label="tab.label" :name="tab.value" :key="tab.value">
            <media-gallery :type="tab.value"/>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :md="4" :sm="24" :xs="24">
        <div class="upload">
          <h3>素材上传</h3>
          <attach :listType="'picture'"/>
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
        tabList: options.mediaList        
      }
    },
    computed:{
      activeName:{
        get(){
          return this.$store.state.activeName;
        },
        set(val){
          this.$store.commit('setMediaActiveName',val);
        }
      }
    },
    created(){
      this.activeName = 'image';
    }
  }

</script>
<style lang="less" scoped>
  .margin-top-20 {
    margin-top: 20px;
  }
  
  .content {
    //.margin-top-20;
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    min-height: 600px;
  }
  
  h3 {
    font-weight: 300;
  }
  
  .upload {
    margin-left: 20px;
  } 
</style>
