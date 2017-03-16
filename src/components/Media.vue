<template>
  <div class="content">
    <el-row>
      <el-col :md="16" :sm="24" :xs="24">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="图片" name="image">
            <media-grid/>
          </el-tab-pane>
          <el-tab-pane label="音频" name="audio">音频</el-tab-pane>
          <el-tab-pane label="视频" name="video">视频</el-tab-pane>
          <el-tab-pane label="其它" name="other">其它</el-tab-pane>
        </el-tabs>      
      </el-col>
      <el-col :md="8" :sm="24" :xs="24">
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
  import MediaGrid from './common/MediaGrid';

  import settings from '../config/settings';
  import util from '../config/util';
  const HOST = settings.host;

  export default {
    name: 'media',
    components: {
      Attach,
      MediaGrid
    },
    data() {
      return {
          activeName:'image'
        }
    },
    methods: {
       handleClick(tab, event) {
        console.log(tab, event);
      },
      updateAttachArticleId(article_id) {
        //更新附件中对应的文章id
        let url = settings.api.update;
        let params = {
          tbl: 99,
          tblname: 'tbl_article_attach',
          article_id
        };

        this.attachList.split(',').map(id => {
          params.id = id;
          this.$http.jsonp(url, {
              params
            })
            .then(res => {
              console.info('附件信息更新成功');
            })
            .catch(e => {
              console.log(e);
            })
        });
      },
    },
    mounted() {

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
    min-height:600px;
  }

  h3{
    font-weight:300;
  }

  .el-upload-dragger{
    width:260px;
  }

  .upload{
    margin-left:20px;
  }
</style>
