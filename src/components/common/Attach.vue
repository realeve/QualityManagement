<template>
  <div>
    <div v-if="listType=='picture-card'" class="margin-top-20">
      <el-upload multiple :action="uploadUrl" :on-remove="handleRemove" :file-list="fileList" :list-type="listType"
        :on-success="handleSuccess" :before-upload="validFile" :on-preview="handlePreview">
        <i class="el-icon-plus"></i>
        <div class="el-upload__tip" slot="tip">文件大小请勿超过100MB，图片文件点击列表预览</div>
      </el-upload>
    </div>

    <div v-else>
      <el-upload multiple drag :action="uploadUrl" :on-remove="handleRemove" :file-list="fileList"
        :on-success="handleSuccess" :before-upload="validFile" :on-preview="handlePreview">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">文件大小请勿超过100MB</div>
      </el-upload>
    </div>

    <el-dialog :title="dialogName" v-model="dialogVisible" size="small">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import options from '../../config/options';
  import settings from '../../config/settings';
  import util from '../../config/util';
  const HOST = settings.host;
  export default {
    name: 'attach',
    props: ['listType'],
    data() {
      return {
        uploadUrl: settings.api.fileUpload,
        dialogImageUrl: '',
        dialogVisible: false,
        dialogName: ''
      }
    },
    computed: {
      fileList() {
        return this.$store.state.fileList;
      },
      latestFile: {
        get() {
          return this.$store.state.latestFile;
        },
        set(value) {
          this.$store.commit('updateLatestFile', value);
        }
      }
    },
    methods: {
      validFile(file) {
        //const isJPG = file.type === 'image/jpeg';
        const isLt20M = file.size / 1024 / 1024 < 100;
        if (!isLt20M) {
          this.$message.error('上传头像图片大小不能超过 20MB!');
        }
        return isLt20M;
      },
      handleSuccess(response, file) {
        delete response.status;
        delete response.msg;

        //添加数据后将附件信息存储至数据库
        let params = {
          tblname: 'tbl_article_attach',
          utf2gbk: ['name'],
          rec_time: util.getNow(1),
          uid: this.$store.state.user.id
        };
        params = Object.assign(params, response);

        let url = settings.api.insert;

        this.$http.post(url, params, {
            emulateJSON: true
          })
          .then(res => {
            res = res.data;
            if (res.type == 1) {
              response.attach_id = res.id;
              response.url = HOST + '/upload' + response.url;
              //this.fileList.push(response);
              this.$store.commit('addFileItem', response);
              this.latestFile = {
                id: res.id,
                url: response.url.split('/upload')[1],
                type: response.type,
                name: response.name,
                width:response.width,
                height:response.height
              }
            }
          })
          .catch(e => {
            console.log(e);
          })

      },
      handleRemove(file) {
        this.$store.state.fileList.forEach((item, i) => {
          if (item.uid == file.uid) {
            //删除数据后，从数据库中删除信息
            let params = {
              tblname: 'tbl_article_attach',
              id: item.attach_id
            };

            let url = settings.api.delete;
            this.$http.post(url, params, {
                emulateJSON: true
              })
              .then(res => {
                res = res.data;
                if (res.type == 1) {
                  //this.fileList.splice(i, 1);
                  this.$store.commit('removeFileItem', i);
                }
              })
              .catch(e => {
                console.log(e);
              })

            this.$http.jsonp(settings.api.fileDelete, {
                params: {
                  name: item.url.split('/upload')[1]
                }
              })
              .then(res => {
                console.info(item.name + '删除成功');
              })
              .catch(e => {
                console.log(e);
              })
          }
        });
      },
      handlePreview(file) {
        this.$store.state.fileList.forEach((item, i) => {
          if (item.uid == file.uid) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
            this.dialogName = file.name;
          }
        });
      }
    }
  }

</script>
<style>
  .el-upload-dragger {
    width: 280px;
  }

</style>
