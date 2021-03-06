<template>
  <div>
    <div v-if="listType=='picture-card'" class="margin-top-20">
      <el-upload :action="uploadUrl" :on-remove="handleRemove" :file-list="fileList" :list-type="listType" :on-success="handleSuccess" :before-upload="validFile" :on-preview="handlePreview">
        <i class="el-icon-plus"></i>
        <div class="el-upload__tip" slot="tip">文件大小请勿超过100MB，图片文件点击列表预览</div>
      </el-upload>
    </div>

    <div v-else>
      <el-upload multiple drag :action="uploadUrl" :on-remove="handleRemove" :file-list="fileList" :on-success="handleSuccess" :before-upload="validFile" :on-preview="handlePreview">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处<br>或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">文件大小请勿超过100MB</div>
        <div class="el-upload__tip" slot="tip">
          <a href="javascript:;" @click="clearList">点击此处清空列表</a>
        </div>
      </el-upload>
    </div>

    <el-dialog :title="dialogName" v-model="dialogVisible" size="small">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import options from "../../config/options";
import settings from "../../config/settings";
import util from "../../config/util";
const HOST = settings.host;
export default {
  name: "attach",
  props: ["listType"],
  data() {
    return {
      uploadUrl: settings.api.fileUpload,
      dialogImageUrl: "",
      dialogVisible: false,
      dialogName: ""
    };
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
        this.$store.commit("updateLatestFile", value);
      }
    },
    needAdd2Editor() {
      return this.routename == "Add" || this.routename == "View";
    },
    editorContent: {
      get() {
        if (this.routename == "Add") {
          return this.$store.state.add.content;
        } else {
          return this.$store.state.commentContent;
        }
      },
      set(content) {
        if (this.routename == "Add") {
          this.$store.commit("setAddInfo", {
            content
          });
        } else {
          this.$store.commit("setCommentContent", content);
        }
      }
    },
    routename() {
      return this.$route.name;
    }
  },
  methods: {
    clearList() {
      this.$store.commit("clearFileList");
    },
    validFile(file) {
      //const isJPG = file.type === 'image/jpeg';
      const isLt20M = file.size / 1024 / 1024 < 100;
      if (!isLt20M) {
        this.$message.error("上传头像图片大小不能超过 100MB!");
      }
      return isLt20M;
    },
    handleSuccess(response, file) {
      if (typeof response.name == "undefined") {
        this.$message({
          type: "warning",
          message: "文件上传出错"
        });
        console.info(response);
        return;
      }

      delete response.status;
      delete response.msg;

      //添加数据后将附件信息存储至数据库
      let params = {
        tblname: "tbl_article_attach",
        utf2gbk: ["name"],
        rec_time: util.getNow(1),
        uid: this.$store.state.user.id
      };
      params = Object.assign(params, response);

      let url = settings.api.insert;

      this.$http
        .post(url, params, {
          emulateJSON: true
        })
        .then(res => {
          res = res.data;
          if (res.type == 1) {
            response.attach_id = res.id;
            response.url = HOST + "/upload" + response.url;
            //this.fileList.push(response);

            this.latestFile = {
              id: res.id,
              url: response.url.split("/upload")[1],
              type: response.type,
              name: response.name,
              width: response.width,
              height: response.height
            };

            if (
              !["images/webp", "image/webp", "image"].includes(response.type)
            ) {
              this.$store.commit("addFileItem", response);
            } else {
              this.addImg2Editor({ file: this.latestFile });
              // 删除最后一项文件
              this.$store.commit(
                "removeFileItem",
                this.$store.state.fileList.length - 1
              );
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    handleRemove(file) {
      this.fileList.forEach((item, i) => {
        if (item.uid == file.uid) {
          //仅移除列表中信息，文件删除逻辑放到媒体库中管理
          this.$store.commit("removeFileItem", i);

          //删除数据后，从数据库中删除信息
          /*let params = {
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
              })*/
        }
      });
    },
    handlePreview(file) {
      this.fileList.forEach((item, i) => {
        if (item.uid == file.uid) {
          if (this.needAdd2Editor) {
            this.addImg2Editor({
              file,
              idx: i
            });
          } else {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
            this.dialogName = file.name;
          }
        }
      });
    },
    addImg2Editor({ file, idx }) {
      // 不是图片则退出
      if (!["images/webp", "image/webp", "image"].includes(file.type)) {
        return;
      }
      let img;
      if (file.url.includes(HOST)) {
        img = `<img src="${file.url}"/>`;
      } else {
        img = `<img src="${settings.uploadContent + file.url}"/>`;
      }
      if (file.type == "image/webp") {
        img = img.replace("/file/", "/image/");
      }
      this.editorContent = (this.editorContent || "") + img;
      if (idx) {
        this.$store.commit("removeFileItem", idx);
      }
    }
  }
};
</script>
<style lang="less">
.el-upload .el-upload-dragger {
  width: 180px;
}

@attach-box: 60px;
.attach-list {
  li {
    margin: 10px;
  }

  .attach-item {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    background-color: #f1f3f5;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 550px;
    line-height: @attach-box;
    height: @attach-box;
    cursor: pointer; // line-height: 146px;
    // vertical-align: top;
    // display:flex;
    // align-items:center;
  }
}
</style>
