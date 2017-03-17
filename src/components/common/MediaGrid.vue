<template>
  <div class="content">
    <ul class="el-upload-list el-upload-list--picture-card">
      <li v-for="item in mediaItem" class="el-upload-list__item" :class="classList" key="item.id">
        <img v-if="type=='image'" :src="mediaContent+item.url" class="el-upload-list__item-thumbnail">
        <img v-else-if="type=='audio'" :src="'static/music.jpg'" class="el-upload-list__item-thumbnail">
        <img v-else-if="type=='video'" :src="'static/music.jpg'" class="el-upload-list__item-thumbnail">
        <el-tooltip class="item" effect="dark" placement="top">
          <span slot="content">{{item.name}}</span>
          <span class="el-upload-list__item-actions" :class="classList">
              <span class="el-icon-view" @click="previewImg(item)"></span>
          <span class="el-icon-edit" @click="editName(item)"></span>
          <span class="el-icon-delete2" @click="deleteMedia(item)"></span>
          </span>
        </el-tooltip>
      </li>
    </ul>
    <el-dialog :title="dialog.name" v-model="dialog.visible" :size="dialogSize">
      <img v-if="type=='image'" width="100%" :src="dialog.url" alt="">
      <audio ref="audio" autoplay="autoplay" v-else-if="type=='audio'" :src="dialog.url" controls="controls"></audio>
      <video ref="video" v-else-if="type=='video'" :src="dialog.url" controls="controls"></video>
    </el-dialog>
  </div>
</template>
<script>
  import options from '../../config/options';
  import settings from '../../config/settings';
  import util from '../../config/util';
  const HOST = settings.host;

  export default {
    name: 'media-grid',
    props: ['type'],
    data() {
      return {
        dialog: {
          url: '',
          visible: false,
          name: ''
        },
        dialogSize:'small',
        mediaContent: HOST + '/upload'
      }
    },
    computed: {
      mediaList: {
        get() {
          return this.$store.state.mediaList;
        },
        set(val) {
          this.$store.commit('updateMediaList', val);
        }
      },
      mediaItem() {
        return this.mediaList.filter(item => item.type.includes(this.type))
      },
      user() {
        return this.$store.state.user;
      },
      latestFile() {
        return this.$store.state.latestFile;
      },
      classList() {
        return {
          image: this.type == 'image',
          audio: this.type == 'audio' || this.type == 'video'
        }
      },
      dialogSize(){
        return this.type == 'video'?'large':'small';
      }
    },
    watch: {
      user() {
        //图像列表为异步结果，需要在下个周期载入数据
        this.$nextTick(() => {
          this.initData();
        });
      },
      latestFile(val) {
        //attach控件中增加数据时刷新列表
        this.mediaList = [val, ...this.mediaList];
      },
      "dialog.visible": function (val) {
        if (!val && this.type == 'audio') {
          let audio = this.$refs.audio;
          audio.pause();
        }

      }
    },
    methods: {
      previewImg(item) {
        this.dialog.url = this.mediaContent + item.url;
        this.dialog.visible = true;
        this.dialog.name = item.name;
      },
      deleteMedia(item) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeFile(item);
        }).catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
          console.log(e);
        });
      },
      editName(item) {
        this.$prompt('请输入文件名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: item.name
        }).then(({
          value
        }) => {
          this.updateFileName({
            id: item.id,
            name: value
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      initData() {
        //this.mediaList;
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
      },
      removeFile(file) {
        let params = {
          tblname: 'tbl_article_attach',
          id: file.id
        };

        let url = settings.api.delete;
        this.$http.post(url, params, {
            emulateJSON: true
          }).then(res => {
            this.mediaList.forEach((item, i) => {
              if (item.id == file.id) {
                this.mediaList.splice(i, 1);
              }
            });
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
          .catch(e => {
            console.log(e);
          })

        this.$http.jsonp(settings.api.fileDelete, {
            params: {
              name: file.url
            }
          }).then(res => {
            console.info(file.name + '删除成功');
          })
          .catch(e => {
            console.log(e);
          })
      },
      updateFileName(item) {
        var params = {
          tblname: 'tbl_article_attach',
          id: item.id,
          name: item.name,
          utf2gbk: ['name']
        }

        this.$http.jsonp(settings.api.update, {
            params
          }).then(res => {

            this.mediaList.forEach((media, i) => {
              if (item.id == media.id) {
                this.mediaList[i].name = item.name;
              }
            });

            this.$message({
              type: 'success',
              message: '文件名已修改为: ' + item.name
            });
          })
          .catch(e => {
            console.log(e);
          })
      }
    }
  }

</script>
<style lang="less" scoped>
  @item-width: 200px;
  .content {
    margin-top: 20px;
  }
  
  .el-upload-list--picture-card {
    .el-upload-list__item {
      border-radius: 4px;
      border: none;
      boder-top: 1px solid #f12;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
      margin: 0 16px 12px 0;
    }
    .image {
      width: @item-width;
    }    
    .audio {
      border-radius: 50%;
    }
  }
  
  .el-dialog audio,
  .el-dialog video {
    width: 100%;
  }

</style>
