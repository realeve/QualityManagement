<template>
  <el-dialog title="登录" v-model="user.unLogin" size="tiny" :close-on-click-modal="false" :show-close="false">
    <div class='avatar'>
      <img :src="avatarContent+user.avatar+'.jpg'">
    </div>
    <el-form :model="user">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="user.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="user.password" type="password" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="login">确 定</el-button>
    </div>
  </el-dialog>

</template>
<script>
  export default {
    name: 'el-login',
    data() {
      return {
        formLabelWidth: '80px',
        avatarContent: 'http://localhost/demo/avatar/'
      }
    },
    computed: {
      user: {
        get() {
          return this.$store.state.user;
        },
        set(val) {
          this.$store.commit('setUserInfo', val);
        }
      },
      hisData: {
        get() {
          let offlineData = window.localStorage.getItem('user');
          if (offlineData == null) {
            return {
              name: '',
              id: '',
              avatar: '',
              username: '',
              unLogin: true
            };
          } else {
            return JSON.parse(offlineData);
          }
        },
        set(val) {
          window.localStorage.setItem('user', JSON.stringify(val));
        }
      }
    },
    methods: {
      login() {
        if (this.user.password != '123') {
          this.$message({
            message: '用户名密码错误，请重试',
            type: "error"
          })
          return;
        }

        this.user = {
          id: 16,
          name: 'develop',
          username: '李宾',
          avatar: 'MTZsaWJpbg==',
          unLogin: false
        };

        //测试模式，此处设为true表示未登录，此处需加入数据库逻辑
        this.hisData = {
          id: 16,
          name: 'develop',
          username: '李宾',
          avatar: 'MTZsaWJpbg==',
          unLogin: true
        };

        this.$message({
          message: '登录成功',
          type: "success"
        })
      }
    },
    created() {
      this.user = this.hisData;
      console.log(this.user);
    }
  }

</script>
<style lang="less" scoped>
  .avatar {
    width: 120px;
    height: 120px;
    margin: 0px auto 20px auto;
    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
    }
  }

</style>
