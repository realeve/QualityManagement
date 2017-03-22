<template>
  <el-dialog title="登录" v-model="user.unLogin" size="tiny" :close-on-click-modal="false" :show-close="false">
    <div class='avatar'>
      <img :src="user.avatar">
    </div>
    <el-form :model="user">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="user.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="user.password" type="password" auto-complete="off" @keyup.enter="login"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="login">确 定</el-button>
    </div>
  </el-dialog>

</template>
<script>
  import settings from '../../config/settings';
  let _ = require('lodash');
  export default {
    name: 'el-login',
    data() {
      return {
        formLabelWidth: '80px',
        avatarContent: settings.host + '/demo/avatar/',
        userList: []
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
        this.setAvatar();
        this.$http.jsonp(settings.api.md5, {
          params: {
            key: this.user.password
          }
        }).then(res => {
          return this.$http.jsonp(settings.api.login, {
            params: {
              uid: this.user.id,
              psw: res.data.key
            }
          });
        }).then(res => {
          if (res.data.rows) {
            this.user.unLogin = false;
            this.hisData = this.user;
            this.$message({
              message: '登录成功',
              type: "success"
            })
          } else {
            this.$message({
              message: '用户名密码错误，请重试',
              type: "error"
            })
          }
        });
      },
      loadUserList() {
        this.$http.jsonp(settings.api.userList).then(res => {
          this.userList = res.data.data;
          this.setAvatar();
        });
      },
      setAvatar: _.debounce(function () {
        let username = this.user.name;
        if (username == '' || typeof this.userList == 'undefined') {
          this.user.avatar = 'Avatar_none.jpg';
          return;
        }
        let user = this.userList.filter(res => res.name.includes(username))[0];
        this.user = Object.assign(this.user,user);
        if (user && user.avatar == 1) {
          this.user.avatar = this.avatarContent + btoa(user.id + user.name) + '.jpg';  
        } else {          
          this.user.avatar = this.avatarContent +'Avatar_none.jpg';
        }
      }, 300),
      init() {
        this.user = this.hisData;
        if (this.user.unLogin) {
          this.loadUserList();
        }
      }
    },
    watch: {
      "user.name" () {
        if(this.user.name==''){
          this.loadUserList();
        }
        this.setAvatar();
      }
    },
    created() {
      this.init();
    }
  }

</script>
<style lang="less" scoped>
  .avatar {
    width: 120px;
    height: 120px;
    margin: -135px auto 20px auto;
    border-radius: 50%;
    border: 5px solid rgba(255, 255, 255, 0.35);
    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
    }
  }

</style>
