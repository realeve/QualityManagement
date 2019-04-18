<template>
  <div>
    <el-form
      :model="value"
      :rules="rules"
      ref="value"
      label-width="100px"
    >
      <div class="card">
        <el-row>
          <el-col
            :md="14"
            :sm="24"
            :xs="24"
          >
            <div class="basic">
              <h3>基础信息</h3>
              <el-form-item
                label="品种"
                prop="prod"
                v-show="sys_proc"
              >
                <el-select
                  v-model="value.prod"
                  clearable
                  placeholder="请选择品种名称"
                >
                  <el-option
                    v-for="item in options.prod"
                    :label="item.label"
                    :value="item.label"
                    :key="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="工序"
                prop="proc"
                v-show="sys_proc"
              >
                <el-select
                  v-model="value.proc"
                  clearable
                  placeholder="请选择工序"
                >
                  <el-option
                    v-for="item in options.proc"
                    :label="item.label"
                    :value="item.label"
                    :key="item.label"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="机台"
                prop="machine"
                v-show="sys_proc"
              >
                <el-autocomplete
                  class="inline-input"
                  v-model="value.machine"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入机台"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item
                label="责任人"
                prop="operator"
              >
                <el-select
                  v-model="value.operator"
                  multiple
                  placeholder="请选择责任人"
                >
                  <el-option-group
                    v-for="group in options.operator"
                    :label="group.label"
                    :key="group.value"
                  >
                    <el-option
                      v-for="item in group.options"
                      :label="item.label"
                      :value="item.value"
                      :key="item.value"
                    >
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
              <el-form-item
                label="车号/轴号"
                prop="cartno"
                v-show="sys_proc"
              >
                <el-tag
                  :key="tag"
                  v-for="tag in cartList"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                >
                  {{tag}}
                </el-tag>
                <el-input
                  v-model="value.cartno"
                  class="input-new-tag"
                  v-if="inputVisible"
                  ref="saveTagInput"
                  size="small"
                  @input="capitalizeCartno"
                  @keyup.enter.native="addCart"
                  @blur="addCart"
                  :maxlength="8"
                  :minlength="7"
                  icon="edit"
                  placeholder="请输入车号/轴号信息"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                >添加车号</el-button>
              </el-form-item>
            </div>
          </el-col>
          <el-col
            :md="10"
            :sm="24"
            :xs="24"
          >
            <h3>消息推送名单</h3>
            <rtx-check />
          </el-col>
        </el-row>
      </div>
      <div class="card">
        <h3>文章内容</h3>
        <el-form-item
          label="类别"
          prop="category"
        >
          <el-select
            v-model="value.category"
            clearable
            placeholder="请选择类别"
          >
            <el-option
              v-for="{name,value} in options.category"
              :label="name"
              :value="value"
              :key="value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <transition
          name="custom-transition"
          enter-active-class="animated slideInUp"
          leave-active-class="animated fadeOutDown"
        >
          <el-form-item
            v-if="value.category == '质量问题发布'"
            :label="infoTips.text"
            prop="remark"
          >
            <el-input
              style="width:210px;"
              v-model="value.remark"
              icon="information"
              :placeholder="infoTips.placeholder"
            ></el-input>
          </el-form-item>
        </transition>
        <transition
          name="custom-transition"
          enter-active-class="animated slideInUp"
          leave-active-class="animated fadeOutDown"
        >
          <el-form-item
            v-if="categoryText == '工艺质量隐患排查'"
            :label="infoTips.text"
            prop="remark"
          >
            <el-input
              style="width:210px;"
              v-model="value.reward"
              icon="information"
              :placeholder="infoTips.placeholder"
            ></el-input>
          </el-form-item>
        </transition>
        <el-form-item
          label="标题"
          prop="title"
        >
          <el-input
            v-model="value.title"
            icon="edit"
            placeholder="请输入标题内容"
          ></el-input>
        </el-form-item>
        <my-editor />
        <div class="submit">
          <el-button
            type="primary"
            @click="submitForm()"
          >{{createText}}</el-button>
          <el-button
            v-show="previewMode == 0"
            @click="enterPreview()"
          >预览</el-button>
          <el-button
            v-show="previewMode == 0"
            @click="resetForm"
          >重置</el-button>
        </div>
      </div>
    </el-form>

    <div class="card">
      <h3>附件管理</h3>
      <attach :listType="'picture-card'" />
    </div>
  </div>
</template>
<script>
import options from "../config/options";
import MyEditor from "./common/Editor";
import Attach from "./common/Attach";
import RtxCheck from "./common/RtxCheck";

import settings from "../config/settings";
import util from "../config/util";
import * as db from "../config/db";
import { getType } from "../config/axios";

const HOST = settings.host;
export default {
  name: "add",
  components: {
    MyEditor,
    Attach,
    RtxCheck
  },
  data() {
    return {
      options: {
        proc: [],
        prod: [],
        machine: [],
        operator: [],
        category: [],
        mediaList: [],
        mediaLoadingNums: 25,
        menu: []
      },
      rules: {
        operator: [
          {
            required: true,
            type: "array",
            message: "请选择操作人员",
            trigger: "blur"
          }
        ],
        category: [
          {
            required: true,
            message: "请选择文章分类",
            trigger: "blur"
          }
        ],
        title: [
          {
            required: true,
            message: "文章标题不能为空",
            trigger: "blur"
          }
        ],
        cartno: [
          {
            required: false,
            trigger: "blur",
            validator(rule, value, callback) {
              let cart = /^[1-9]\d{3}[A-Za-z]\d{3}$|^[1-9]\d{6}[A-Ca-c]$|^[1-9]\d{6}$/;
              if (value != "" && !cart.test(value)) {
                callback(new Error("请输入正确的车号/轴号信息"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      cartList: [],
      inputVisible: true
    };
  },
  computed: {
    categoryText() {
      let res = this.options.category.find(
        item => item.value == this.value.category
      );
      return (res && res.name) || "";
    },
    sys_proc() {
      return db.sys_id == 0;
    },
    infoTips() {
      if (this.categoryText == "质量问题发布") {
        return {
          text: "备注",
          placeholder: "请输入备注信息",
          value: ""
        };
      } else if (this.categoryText == "工艺质量隐患排查") {
        if (this.previewMode != 2) {
          this.value.reward = 5;
          this.value.reward_status = 1;
          this.value.reward_user = this.$store.state.user.username;
        }

        return {
          text: "奖励金额",
          placeholder: "请输入奖励金额"
        };
      }
    },
    createText() {
      return this.previewMode == 0 ? "立即创建" : "更新数据";
    },
    procId() {
      let proc = this.$store.state.add.proc;
      let id;
      switch (proc) {
        case "胶印":
        case "凹印":
          id = 1;
          break;
        case "印码":
          id = 2;
          break;
        case "检封":
          id = 3;
          break;
        default:
          id = 0;
          break;
      }
      return id;
    },
    value: {
      get() {
        return this.$store.state.add;
      },
      set(val) {
        this.$store.commit("setAddInfo", val);
      }
    },
    attachList() {
      return this.$store.state.fileList.map(item => item.attach_id).join(",");
    },
    fileList: {
      get() {
        return this.$store.state.fileList;
      },
      set(val) {
        return this.$store.commit("setFileList", val);
      }
    },
    articleId() {
      return this.$route.params.id;
    },
    previewMode: {
      get() {
        return this.$store.state.previewMode;
      },
      set(val) {
        this.$store.commit("enterPreview", val);
      }
    },
    preview: {
      get() {
        return this.$store.state.preview;
      },
      set(val) {
        this.$store.commit("setPreviewData", val);
      }
    },
    category() {
      return this.value.category;
    },
    title() {
      return this.value.title;
    }
  },
  watch: {
    procId(id, oldId) {
      if (oldId == id) {
        return; //胶凹共用一个id
      }
      if (id > 0) {
        this.loadMachineList(id);
      } else {
        this.options.machine = [];
      }
    },
    category(val) {
      if (this.categoryText == "质量隐患整改通知") {
        this.value.title = "关于 XXX 的整改通知";
      } else if (this.categoryText == "印钞质量问题反馈单") {
        this.value.title = "关于 XXX 的印钞质量问题反馈";
      }
    },
    title(val) {
      if (this.categoryText == "质量隐患整改通知") {
        let title = val.match(/关于(\S+)的整改通知/);
        this.setDefaultData(title != null ? title[1] : "XXX", 0);
      } else if (this.categoryText == "印钞质量问题反馈单") {
        let title = val.match(/关于(\S+)的质量问题反馈/);
        this.setDefaultData(title != null ? title[1] : "XXX", 1);
      }
    }
  },
  methods: {
    handleClose(tag) {
      this.cartList.splice(this.cartList.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    pushMsgByRtx(params) {
      db.proxy1082111(params).then(({ data }) => {
        this.$message.success(data.msg);
      });
    },
    setDefaultData(title, type) {
      this.value.content = this.value.content || "";
      if (type === 0) {
        if (this.value.content.includes("质量隐患问题描述")) {
          return;
        }
        let content = `
          <p><strong>项目</strong></p>
          <p>${title}</p>
          <br>
          <p><strong>质量隐患问题描述</strong></p>
          <p>在此输入质量隐患问题描述</p>
          <br>
          <p><strong>隐患整改必要性</strong></p>
          <p>在此输入隐患整改必要性</p>
          <br>
          <p><strong>整改要求</strong></p>
          <p>问题整改要求如下</p>
          <br>
          <p><strong>审核人员</strong></p>
          <p>${this.$store.state.user.username}</p>
          <br>
          <hr>
          <p style="font-size:13pt;font-weight:lighter;">(注：原因分析、整改措施、达到的效果以附件的形式提交至评论区。)</p>
          `;
        this.value.content = content;
      } else if (type === 1) {
        if (this.value.content.includes("印钞质量问题反馈")) {
          return;
        }
        let content = `
          <p><strong>填报部门：</strong>${this.$store.state.user.dept}</p>
          <p><strong>填报日期：</strong>${util.getNow(0)}</p> 
          <p><strong>项目</strong></p>
          <p>${title}</p> 
          <p><strong>质量问题</strong></p>
          <p>在此输入质量问题</p> 
          <p><strong>问题描述</strong></p>
          <p>在此输入问题描述</p>  
           <strong>原因分析</strong><br>原因分析如下：
          <ol><li></li><li><br></li><li><br></li><li><br></li></ol> 
          <strong>措施</strong><br>
          针对该问题，我们采取了以下措施： 
          <ol><li></li><li><br></li><li><br></li><li><br></li></ol> 
          <p><strong>填报部门负责人确认</strong></p>
          <p> </p>
          <p><strong>填表人：</strong>${this.$store.state.user.username}</p> 
          `;
        this.value.content = content;
      }
    },
    validFile(file) {
      //const isJPG = file.type === 'image/jpeg';
      const isLt20M = file.size / 1024 / 1024 < 100;
      if (!isLt20M) {
        this.$message.error("上传头像图片大小不能超过 20MB!");
      }
      return isLt20M;
    },
    addCart() {
      let result = this.value.cartno;
      if (result.length >= 8 && !this.cartList.includes(result)) {
        if (
          /^[1-9]\d{3}[A-Za-z]\d{3}$|^[1-9]\d{6}[A-Ca-c]$|^[1-9]\d{6}$/.test(
            result
          )
        ) {
          this.cartList.push(result);
          this.inputVisible = false;
          this.value.cartno = "";
        } else {
          this.$message.error("车号/轴号格式无效");
        }
      }
    },
    capitalizeCartno() {
      let str = this.value.cartno;
      let reg = new RegExp(/[a-zA-Z]|\d/);
      let result = str
        .split("")
        .filter(item => item.match(reg))
        .join("")
        .toUpperCase();
      this.value.cartno = result;
    },
    async loadMachineList(id) {
      let { data } = await db.getMachinedata(id);
      this.options.machine = data.map(([label, value]) => ({
        value: value.trim(),
        label: label.trim()
      }));
    },
    querySearch(queryString, next) {
      let machine = this.options.machine;
      let results = queryString
        ? machine.filter(this.createFilter(queryString))
        : machine;
      // 调用 callback 返回建议列表的数据
      next(results);
    },
    createFilter(queryString) {
      return result => {
        return result.value.indexOf(queryString.toLowerCase()) === 0;
      };
    },
    validData(formName = "value") {
      if (this.$store.state.add.content == "") {
        this.$message.error("问题描述不能为空");
        return false;
      }

      let valid = false;
      this.$refs[formName].validate(result => {
        valid = result;
      });
      return valid;
    },
    getParams() {
      if (!this.validData()) {
        return;
      }

      let params = {
        // tblname: "tbl_article",
        // utf2gbk: [
        //   "title",
        //   "content",
        //   "machine",
        //   "operator",
        //   "category",
        //   "proc",
        //   "remark",
        //   "reward_user",
        //   "status_username"
        // ],
        uid: this.$store.state.user.id, //此处需增加用户登录结果
        rec_time: util.getNow(1),
        attach_list: this.attachList
      };

      let operator = this.value.operator.toString();

      params = Object.assign(params, this.value);

      if (this.previewMode == 2) {
        // params.utf2gbk = [
        //   "title",
        //   "content",
        //   "machine",
        //   "operator",
        //   "category",
        //   "proc",
        //   "remark",
        //   "reward_user",
        //   "read_users"
        // ];
        this.value.content += `<blockquote class="remark">备注：${
          this.$store.state.user.username
        } 在 ${util.getNow(1)} 更新本消息</blockquote>`;
      }

      params = Object.assign(params, {
        proc: this.value.proc,
        operator,
        content: util.parseHtml(this.value.content)
      });

      this.preview = params;
      return true;
    },
    enterPreview() {
      if (!this.getParams()) {
        return;
      }
      // this.$store.commit('enterPreview', true);
      this.previewMode = 1;
      this.$router.push("/view/preview");
    },
    async updateAttachArticleId(article_id) {
      if (this.attachList.length == 0) {
        return;
      }
      //更新附件中对应的文章id
      await db.setArticleAttach({
        article_id,
        _id: this.attachList
      });
    },
    async getNoticeId() {
      if (this.categoryText !== "印钞质量问题反馈单") {
        return 0;
      }
      let { data } = await db.getArticle();
      if (data.length) {
        return data[0].notice_id;
      }
    },
    async submitForm() {
      if (!this.getParams()) {
        return;
      }

      // let url =
      //   this.previewMode == 0 ? settings.api.insert : settings.api.update;
      let submitData = Object.assign({}, this.preview);
      submitData.rec_time = submitData.rec_time.substr(0, 19);
      submitData.cate_id = submitData.category;

      // 新增及修改中，增加系统id辨识。
      submitData.sys_id = db.sys_id;
      if (Reflect.has(submitData, "submitData")) {
        submitData.status_rectime = submitData.status_rectime.substr(0, 19);
      }

      // 新增文章
      let method = "addArticle";

      if (this.previewMode == 2) {
        Reflect.deleteProperty(submitData, "rec_time");
        Reflect.deleteProperty(submitData, "status_rectime");
        Reflect.deleteProperty(submitData, "user");
        Reflect.deleteProperty(submitData, "uid");
        Reflect.deleteProperty(submitData, "status");
        Reflect.deleteProperty(submitData, "status_username");
        Reflect.deleteProperty(submitData, "reward");
        Reflect.deleteProperty(submitData, "reward_status");
        method = "setArticle";
        submitData.receiver = submitData.receiver || "";
        submitData.remark = submitData.remark || "";
        submitData.reward_user = submitData.reward_user || "";
        submitData._id = this.preview.id;
      } else {
        Reflect.deleteProperty(submitData, "id");
        Reflect.deleteProperty(submitData, "user");
        submitData.status_username = "";
      }
      Reflect.deleteProperty(submitData, "datetime");
      Reflect.deleteProperty(submitData, "category");

      if (!/\d+/.test(submitData.cate_id)) {
        let res = this.options.category.find(
          item => item.name == submitData.cate_id
        );
        submitData.cate_id = res.value;
      }

      submitData.cartno = this.cartList.join(",");

      let receiver = this.$store.state.rtxlist.join(",");
      submitData.notice_id = await this.getNoticeId();

      let {
        data: [{ affected_rows, id }]
      } = await db[method](submitData);

      if (affected_rows == 1) {
        this.$message({
          message: "数据添加成功",
          type: "success"
        });
        this.updateAttachArticleId(id);
        //提交后重置数据
        this.resetForm();
        if (this.previewMode == 2) {
          this.$router.push("/view/" + submitData.id);
        } else {
          this.$router.push("/view/" + id);
        }
        //没有选择人员时，则不推送
        if (receiver != "" && this.previewMode == 0) {
          let msg = `${this.$store.state.user.username}发表了一篇新文章,[(${
            this.$store.state.preview.title
          })|${settings.rtxJmpLink + "/view/" + id + "?read=1"}]`;
          this.pushMsgByRtx({
            msg,
            receiver,
            title:
              db.sys_id == 0
                ? "工艺质量管理交互平台"
                : "印钞党支部信息管理平台",
            delaytime: 0
          });
        }
        this.previewMode == 0;
      } else {
        this.$message({
          message: "数据添加失败",
          type: "error"
        });
      }

      this.$store.commit("refreshMainList", true);
      window.localStorage.setItem("editor", "");
    },
    resetForm(formName = "value") {
      //this.$store.commit('resetAddInfo');
      (this.value = {
        prod: "",
        proc: "",
        machine: "",
        operator: [],
        cartno: "",
        category: "",
        content: "",
        title: "",
        receiver: "",
        remark: "",
        reward: 5,
        reward_status: 0,
        reward_user: ""
      }),
        this.$store.commit("clearFileList");
    },
    convertFromMedia() {
      if (getType(this.fileList) == "array" && this.fileList.length > 0) {
        this.fileList = this.fileList.map(item => {
          if (typeof item.id != "undefined") {
            item.attach_id = item.id;
            delete item.id;
            item.url = settings.uploadContent + item.url;
          }
          return item;
        });
      }
    },
    async initOption() {
      let { data: category } = await db.getCateList();
      let { data } = await db.getProductdata();
      let prod = data.map(({ value, name: label }) => ({
        value: value.trim(),
        label: label.trim()
      }));

      this.options = Object.assign(options, { category, prod });
    }
  },
  created() {
    if (this.previewMode == 1) {
      this.$store.commit("enterPreview", false);
    }
    this.convertFromMedia();
    this.initOption();
    //this.$store.commit('clearFileList');
  },
  activated() {
    if (this.previewMode == 2) {
      this.value = this.preview;
      this.value.operator = this.preview.operator.split(",");
    }
  }
};
</script>

<style lang="less" scoped>
h3,
h4 {
  font-weight: 400;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 180px;
  margin-left: 10px;
  vertical-align: bottom;
}

.margin-top-20 {
  margin-top: 20px;
}

.submit {
  .margin-top-20;
  display: flex;
  justify-content: flex-end;
}

.card {
  .margin-top-20;
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  .basic {
    width: 290px;
  }
}

.card:nth-child(1) {
  margin-top: 0;
}
</style>
