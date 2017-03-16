<template>
  <div class="content">
    <ul class="el-upload-list el-upload-list--picture-card">
      <li v-for="item in imageList" class="el-upload-list__item">
        <img :src="mediaContent+item.url" class="el-upload-list__item-thumbnail">
        <el-tooltip class="item" effect="dark" placement="top">
          <span slot="content">{{item.name}}</span>
          <span class="el-upload-list__item-actions">
              <span class="el-icon-view" @click="previewImg(item)"></span>
          <span class="el-icon-edit" @click="editName(item)"></span>
          <span class="el-icon-delete2" @click="deleteMedia(item.id)"></span>
          </span>
        </el-tooltip>
      </li>
    </ul>
    <el-dialog :title="dialog.name" v-model="dialog.visible" size="small">
      <img width="100%" :src="dialog.url" alt="">
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
    data() {
      return {
        dialog: {
          url: '',
          visible: false,
          name: ''
        },
        mediaList: [],
        mediaContent: HOST + '/upload'
      }
    },
    computed: {
      imageList() {
        return this.mediaList.filter(item => item.type.includes('image'))
      }
    },
    methods: {
      previewImg(item) {
        this.dialog.url = this.mediaContent + item.url;
        this.dialog.visible = true;
        this.dialog.name = item.name;
      },
      deleteMedia(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
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
          this.$message({
            type: 'success',
            message: '文件名已修改为: ' + item.value
          });
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
              uid: this.$store.state.user.id
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
    },
    created() {
      this.initData();
    }
  }

</script>
<style lang="less" scoped>
  @item-height: 148px;
  @title-height: 40px;
  @card-height: @item-height+@title-height;
  .content {
    margin-top: 20px;
  }
  
  .el-upload-list--picture-card {
    .el-upload-list__item {
      border-radius: 4px;
      border: none;
      boder-top: 1px solid #f12;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      margin: 0 16px 12px 0;
    }
    .el-upload-list__item-actions {
      height: @item-height;
    }
  }

</style>
