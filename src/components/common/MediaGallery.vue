<template>
  <!--div v-scroll="loadMore"-->
  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="status.value" infinite-scroll-distance="100">
    <div v-if="type=='image'">
      <waterfall class="waterfall" :line="'h'" :line-gap="200" :min-line-gap="150" :max-line-gap="250" :single-max-width="250"
        :watch="mediaItem" ref="waterfall" @reflowed="reflowed">
        <waterfall-slot v-for="(item, index) in mediaItem" :width="item.width" :height="item.height" :order="index" :key="item.index"
          move-class="item-move">
          <div class="item" :index="item.index">
            <img :src="mediaContent+item.url.replace('image/','image/thumb_')" />
            <div class="content-wrap">
              <div class="entry-title">
                <div class="mask">
                  <span @click="add2Attach(item)">
                    <i class="el-icon-document"></i>
                  </span>
                  <span @click="previewImg(item)">
                      <i class="el-icon-view"></i>
                  </span>
                  <span @click="editName(item)">
                    <i class="el-icon-edit"></i>
                  </span>
                  <span @click="deleteMedia(item)">
                    <i class="el-icon-delete2"></i>
                  </span>
                  <p class="pic-name">{{item.name}}</p>
                </div>
              </div>
            </div>
          </div>
        </waterfall-slot>
      </waterfall>
    </div>

    <ul v-else class="el-upload-list el-upload-list--picture-card">
      <li v-for="item in mediaItem" class="el-upload-list__item" :class="classList" :key="item.id">
        <img v-if="type=='audio'" :src="'static/music.webp'" class="el-upload-list__item-thumbnail">
        <video v-else-if="type=='video'" :ref="'video'+item.id" preload="meta" :src="mediaContent+item.url" controls class="el-upload-list__item-thumbnail"></video>
        <img v-else :src="'static/document.webp'" class="el-upload-list__item-thumbnail">
        <el-tooltip class="item" effect="dark" placement="top">
          <span slot="content">{{item.name}}</span>
          <span class="el-upload-list__item-actions" :class="videoMaskClass">
            <span @click="add2Attach(item)">
              <i class="el-icon-document"></i>
            </span>
          <span v-show="type!='video'" @click="previewImg(item)">
              <a v-if="type=='other'" target="_blank" :href="mediaContent+item.url"><i class="el-icon-view"></i></a>
              <i v-else class="el-icon-view"></i>
            </span>
          <span @click="editName(item)">
              <i class="el-icon-edit"></i>
            </span>
          <span @click="deleteMedia(item)">
              <i class="el-icon-delete2"></i>
            </span>
          </span>
        </el-tooltip>
      </li>
    </ul>

    <el-dialog :title="dialog.name" v-model="dialog.visible" :size="dialogSize">
      <div v-if="type=='image'">
        <img width="100%" :src="dialog.url" alt="">
        <div class="margin-top-10">
          <el-radio-group v-model="dialogSize">
            <el-radio :label="'tiny'">小图</el-radio>
            <el-radio :label="'small'">中图</el-radio>
            <el-radio :label="'large'">大图</el-radio>
            <el-radio :label="'full'">全屏</el-radio>
          </el-radio-group>
        </div>
      </div>
      <audio ref="audio" v-else-if="type=='audio'" :src="dialog.url" controls></audio>
    </el-dialog>

    <p class="loading-status" v-html="status.text"></p>
  </div>
</template>
<script>
  import options from '../../config/options';
  import settings from '../../config/settings';
  import util from '../../config/util';
  const HOST = settings.host;

  import Waterfall from 'vue-waterfall/lib/waterfall';
  import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot';

  // let _ = require('lodash');

  export default {
    name: 'media-gallery',
    props: ['type'],
    components: {
      Waterfall,
      WaterfallSlot
    },
    data() {
      return {
        dialog: {
          url: '',
          visible: false,
          name: ''
        },
        dialogSize: 'small',
        mediaContent: HOST + '/upload',
        isVideoPlayed: false,
        status: {
          value: false,
          text: '初始化...'
        },
        maxId: '',
        mediaItem: []
      }
    },
    // directives: {
    //   //自定义滚动刷新事件
    //   scroll: {
    //     bind: function (el, binding) {
    //       window.addEventListener('scroll', () => {
    //         if (el.clientHeight && document.documentElement.scrollTop + window.innerHeight > el.clientHeight +
    //           200) {
    //           let next = binding.value;
    //           next();
    //         }
    //       });
    //     }
    //   }
    // },

    computed: {
      user() {
        return this.$store.state.user;
      },
      latestFile() {
        return this.$store.state.latestFile;
      },
      classList() {
        return {
          audio: this.type == 'audio',
          video: this.type == 'video'
        }
      },
      videoMaskClass() {
        return {
          audio: this.type == 'audio',
          'video-mask': this.type == 'video'
        }
      },
      activeName() {
        return this.$store.state.activeName;
      },
      isActive() {
        return this.type == this.activeName;
      }
    },
    watch: {
      latestFile(val) {
        //attach控件中增加数据时刷新列表
        val.type = this.getFileTypeByAttr(val);
        if (this.type == val.type) {
          val = this.getSizeByItem(val);
          this.mediaItem = [val, ...this.mediaItem];
        }
      },
      "dialog.visible": function (enterPreview) {
        if (this.type == 'audio') {
          let audio = this.$refs.audio;
          if (!enterPreview) {
            audio.pause();
          }
        }
      },
      user(val, oldVal) {
        if (oldVal.id != '') {
          this.mediaItem = [];
        }
        this.status.value = false;
      },
      activeName() {
        if (this.isActive) {}
        this.loadMore();
      }
    },
    methods: {
      add2Attach(item) {
        this.$store.commit('addFileItem', item);
      },
      getFileTypeByAttr(attr) {
        let type;
        if (attr.type.includes('image')) {
          type = 'image';
        } else if (attr.type.includes('audio')) {
          type = 'audio';
        } else if (attr.type.includes('video')) {
          type = 'video';
        } else {
          type = 'other';
        }
        return type;
      },
      fetchData(api, maxid = 0) {

        if (this.status.value) {
          console.info('data is loading...');
          return;
        }

        if (this.user.id == '') {
          this.status.value = false;
          this.status.text = '用户信息尚未读取';
          return;
        }

        this.status.value = true;
        this.status.text = '<i class="el-icon-loading"></i> 正在加载...';

        this.$http.jsonp(api, {
            params: {
              uid: this.user.id,
              type: this.type,
              maxid
            }
          })
          .then(res => {

            let obj = res.data;
            if (obj.rows < options.mediaLoadingNums) {
              this.status.value = true;
              this.status.text = '';
              if (obj.rows == 0) {
                return;
              }
            }

            obj.data = obj.data.map(item => this.getSizeByItem(item));
            if (this.maxId == '') {
              //页面加载时重置数据
              this.mediaItem = obj.data;
            } else {
              this.mediaItem = [...this.mediaItem, ...obj.data];
            }

            this.maxId = obj.data[obj.rows - 1].id;
            console.info('当前资源id:', this.type, '=', this.maxId);
            
            //image采用 reflowed触发回调，其它类型手动重置状态
            if (this.type != 'image') {
              this.status.value = false;
            }
          })
          .catch(e => {
            //this.status.value = false;
            this.status.text = '数据载入出错';
            console.log(e);
          })
      },
      reflowed: function () {
        if (this.isActive && this.status.value) {
          this.status.value = false;
        }
      },
      loadMore() {
        if (!this.isActive) {
          return;
        }
        console.info('触发下拉刷新');

        if (this.maxId == '') {
          this.fetchData(settings.api.mediaList);
        } else {
          this.fetchData(settings.api.mediaLoadMore, this.maxId);
        }
      },
      getSizeByItem(item) {
        if (item.width) {
          let ratio = (item.height / item.width);
          item.width = 400;
          item.height = (400 * ratio).toFixed(0);
        } else {
          item.width = 120;
          item.height = 120;
        }
        return item;
      },
      previewImg(item) {
        if (this.type == 'other') {
          return;
        }
        this.dialog.url = this.mediaContent + item.url;
        this.dialog.name = item.name;
        this.dialog.visible = true;
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
        this.$prompt('请输入文件描述', '提示', {
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
      removeFile(file) {
        let params = {
          tblname: 'tbl_article_attach',
          id: file.id
        };

        let url = settings.api.delete;
        this.$http.post(url, params, {
            emulateJSON: true
          }).then(res => {

            this.mediaItem.forEach((item, i) => {
              if (item.id == file.id) {
                this.mediaItem.splice(i, 1);
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

            this.mediaItem.forEach((media, i) => {
              if (item.id == media.id) {
                this.mediaItem[i].name = item.name;
              }
            });

            this.$message({
              type: 'success',
              message: '文件描述已修改为: ' + item.name
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
  @video-height: 180px;
  @video-width: @video-height * 16 / 9;
  @video-mask-height: @video-height - 32;
  .margin-top-10 {
    margin-top: 10px;
  }

  .el-dialog__body {
    padding: 10px 20px;
  }

  .el-upload-list--picture-card {
    .el-upload-list__item {
      border-radius: 4px;
      border: none;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
      margin: 0 16px 12px 0;
    }
    .audio-on {
      -webkit-animation: change 2s linear infinite;
    }
    @-webkit-keyframes change {
      0% {
        -webkit-transform: rotate(0deg);
      }
      50% {
        -webkit-transform: rotate(180deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
      }
    }
    .audio {
      border-radius: 50%;
    }
    .video {
      width: @video-width;
      height: @video-height;
    }
    .video-mask {
      height: @video-mask-height;
    }
  }

  .el-dialog audio {
    width: 100%;
  }

  .waterfall {
    .item {
      position: absolute;
      top: 5px;
      left: 5px;
      right: 5px;
      bottom: 5px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .item:after {
      content: attr(index);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
    }
    .content-wrap {
      padding: 0;
      position: absolute;
      text-align: center;
      width: 100%;
      top: 0;
      bottom: 0;
      display: table-cell;
      vertical-align: middle;
      overflow: hidden;
    }
    .entry-title {
      display: table;
      height: 100%;
      width: 100%;
      margin: 0;
      text-align: center;
      font-size: 12pt;
      color: #fff;
      font-size: 20px;
      word-spacing: .7em;
    }
    .mask {
      display: table-cell;
      position: relative;
      transition: opacity .25s ease-in-out, background .25s ease-in-out;
      -moz-transition: opacity .25s ease-in-out, background .25s ease-in-out;
      -webkit-transition: opacity .25s ease-in-out, background .25s ease-in-out;
      vertical-align: middle;
      z-index: 1;
      color: #fff;
      text-decoration: none;
      opacity: 0;
      padding: 10%;
      span:hover {
        color: #20A0FF;
      }
      .pic-name {
        font-size: 10px;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        margin-bottom: 8px;
      }
    }
    .mask:hover {
      cursor: pointer;
      opacity: 0.9;
      color: #fff;
      background: rgba(0, 0, 0, 0.8);
    }
    .wf-enter-active,
    wp-leave {
      transition: opacity 1.3s ease;
      -webkit-transition: opacity 1.3s ease;
    }
    .wf-enter,
    .wp-leave-active {
      opacity: 0;
    }
  }

  .loading-status {
    text-align: center;
    margin-bottom: 0;
  }

</style>
