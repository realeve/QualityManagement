<template>
  <div>
    <el-row class="el-menu--dark">
      <el-col :span="20">
        <el-menu
          theme="dark"
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
        >
          <template v-for="(item, i) in list">
            <el-menu-item
              v-if="i != 1"
              :index="i.toString()"
              :key="item.label"
              @click="jump(item.value)"
              >{{ item.label }}</el-menu-item
            >
            <el-submenu v-else :index="i.toString()" :key="item.label">
              <template slot="title">{{ item.label }}</template>
              <el-menu-item
                v-for="(submenu, j) in category"
                :index="i + '-' + j"
                :key="i * 10 + j"
                @click="jump('/list/' + submenu.name)"
                >{{ submenu.name }}</el-menu-item
              >
            </el-submenu>
          </template>
          <li
            class="el-menu-item"
            v-if="showPartyUrl"
            style="background: #20a0ff; color: #fff"
          >
            <a href="http://10.8.2.133:71" target="_blank"
              >印钞党支部党员管理</a
            >
          </li>
        </el-menu>
      </el-col>
      <el-col :span="4">
        <div class="user-info">
          <span class="username" v-text="user.username"></span>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <img class="avatar" :src="user.avatar" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                ><a :href="host + '/settings/account'" target="_blank"
                  >个人信息</a
                ></el-dropdown-item
              >
              <el-dropdown-item @click.native="logout">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import options from "../../config/options";
import settings from "../../config/settings";
import * as db from "../../config/db";
export default {
  name: "my-menu",
  data() {
    return {
      list: options.menu,
      category: [],
      activeIndex: "0",
      host: settings.host,
    };
  },
  computed: {
    user: {
      get() {
        return this.$store.state.user;
      },
      set(val) {
        this.$store.commit("setUserInfo", val);
      },
    },
    showPartyUrl() {
      return this.$store.state.showPartyUrl && db.sys_id == 0;
    },
  },
  methods: {
    jump(url) {
      this.$router.push(url);
    },
    logout() {
      this.user = {
        name: "",
        id: "",
        avatar: "",
        username: "",
        unLogin: true,
      };
    },
    async loadCategory() {
      let { data: category } = await db.getCateList();
      this.category = [
        {
          value: "-2",
          name: "与我有关的工作事项",
        },
        {
          value: "-1",
          name: "我的工作列表",
        },
        ...category,
      ];
    },
  },
  watch: {
    "user.name"() {
      if (["印钞管理部", "经理部"].includes((this.user.dept || "").trim())) {
        this.$store.commit("updatePartyUrl", true);
      }
    },
  },
  created() {
    this.loadCategory();
  },
};
</script>
<style lang="less" scoped>
.el-menu-demo {
  border-radius: 0px;
}

.user-info {
  color: #fff;
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  .username {
    padding: 0 10px;
  }
  .avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
}

@media print {
  .el-menu--dark {
    display: none;
  }
}
</style>
