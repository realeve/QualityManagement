<template>
  <div>
    <div class="main">
      <div class="article-container">
        <div class="card article">
          <div :class="isNotice ? 'noticeFont' : null">
            <div v-if="isNotice" class="notice_id">
              <img src="/static/image/cbpc.png" alt="" />
              <p>
                印钞管理部通知（{{ article.datetime.slice(0, 4) }}）{{
                  article.notice_id.padLeft(2, "0")
                }}号
              </p>
            </div>
            <h1 class="title">{{ article.title }}</h1>
            <h3 class="sub-title no-print">
              {{ article.user }}
              <span class="time">{{ article.datetime }}</span>
              <p class="no-print">
                <span v-if="article.prod">{{ article.prod }} • </span
                ><span v-if="article.proc">{{ article.proc }} • </span
                ><span v-if="article.machine">{{ article.machine }} </span
                ><span>(阅读数:{{ article.readnum }})</span>
              </p>
            </h3>
            <div class="content" v-html="article.content"></div>
          </div>
          <blockquote>
            本问题由
            <el-button
              plain
              v-for="(item, i) in operators"
              size="small"
              :key="i"
              @click="remind(item)"
              >{{ item }}</el-button
            >
            确认
            <p>类型：{{ article.category }}</p>
            <p v-if="article.cartno">
              车号:
              <a
                class="cart-info"
                v-for="item in article.cartno.split(',')"
                :key="item"
                target="_blank"
                :href="cartUrl + item"
                >{{ item }}</a
              >
            </p>
            <p v-show="article.status_username != '' && 0 == previewMode">
              文章状态：{{ article.status_username }} 于 {{ status_time
              }}{{ status == 1 ? "关闭" : "重新打开" }}
            </p>
            <p v-show="article.remark != ''">备注：{{ article.remark }}</p>
            <p v-if="article.read_users != ''">
              阅读状态：{{ article.read_users }}
            </p>
            <p v-else>阅读状态：无</p>
            <p v-if="article.read_users != ''">
              首次阅读时间：<span style="font-size: 12px">{{ logs }}</span>
            </p>
          </blockquote>
          <div v-if="1 == previewMode" class="submit">
            <el-button class="no-print" type="success" @click="closePreview"
              >返回编辑</el-button
            >
          </div>
          <div v-else class="article-status no-print">
            <span>文章状态</span>
            <el-switch
              v-model="status"
              on-color="#13ce66"
              off-color="#ff4949"
              on-text="已关闭"
              off-text="未关闭"
              :width="72"
              @change="closeArticle"
            >
            </el-switch>
          </div>
          <div v-if="0 == previewMode" class="submit reedit no-print">
            <el-button type="success" @click="edit">重新编辑</el-button>
            <el-button
              class="no-print"
              style="margin-left: 20px"
              type="primary"
              @click="print"
              >打印</el-button
            >
          </div>
          <div v-if="showDonate" class="donate">
            <div class="verify-reward">
              <el-button
                v-if="
                  shouldReward &&
                  (article.reward == '' || article.reward_status == 0)
                "
                type="danger"
                size="large"
                @click="donate"
                >发起奖励</el-button
              >
            </div>
            <template v-if="article.reward">
              <div class="verify-reward">
                <el-button
                  v-if="shouldVerify && article.reward_status == 1"
                  type="danger"
                  size="large"
                  @click="passDonate(1)"
                  >通过奖励</el-button
                >
                <el-button
                  v-if="shouldVerify && article.reward_status == 1"
                  type="warning"
                  size="large"
                  @click="passDonate(-1)"
                  >拒绝通过</el-button
                >
              </div>
              <p
                v-show="
                  (article.reward_status == 1 || article.reward_status == 0) &&
                  shouldVerify
                "
              >
                本文由{{ article.reward_user }}发起了 ￥
                <el-input
                  style="width: 50px"
                  v-model="article.reward"
                ></el-input>
                元的奖励
              </p>
              <p v-show="article.reward_status == 2">
                本文由{{ article.reward_user }}发起了
                <el-tag type="danger">￥{{ article.reward }}</el-tag> 元的奖励
              </p>
            </template>
          </div>
        </div>
        <div class="widget no-print">
          <div class="welcome">
            <my-card
              v-if="latestList.length > 0"
              :news="latestList[0]"
              style="min-height: unset"
              bgcolor="rgba(255,255,255,0.7)"
              fontcolor="#333"
            />
          </div>
          <div class="welcome">
            <my-card
              v-if="hotList.length > 0"
              :news="hotList[0]"
              style="min-height: unset"
              bgcolor="rgba(255,255,255,0.7)"
              fontcolor="#333"
            />
          </div>
          <div class="welcome">
            <my-card
              v-if="myWorkList.length > 0"
              :news="myWorkList[0]"
              style="min-height: unset"
              bgcolor="rgba(255,255,255,0.7)"
              fontcolor="#333"
            />
          </div>
        </div>
      </div>
    </div>
    <div style="display: flex; justify-content: center">
      <div style="max-width: 1600px; width: 100%">
        <div v-show="attachList.length" class="no-print">
          <h2 class="font-thin">附件列表</h2>
          <div class="card attach">
            <el-carousel
              indicator-position="inside"
              height="500px"
              v-if="attaches.image.length"
              arrow="always"
            >
              <el-carousel-item v-for="(item, i) in attaches.image" :key="i">
                <img :src="item.url" :alt="item.name" />
              </el-carousel-item>
            </el-carousel>

            <div v-if="musicList.length" class="center margin-top-20">
              <my-player :music="musicList" />
            </div>

            <div class="center margin-top-20">
              <div v-for="(item, i) in attaches.video" :key="i">
                <video :src="item.url" controls="controls"></video>
              </div>
            </div>

            <ul class="attach-list">
              <li
                class="attach-item"
                v-for="(item, i) in attaches.other"
                :key="i"
                :title="'点击下载 ' + item.name"
              >
                <a
                  :href="item.url"
                  target="_blank"
                  :title="'点击下载 ' + item.name"
                >
                  <i class="el-icon-document"></i> 附件{{ i + 1 }} ——
                  {{ item.name }}</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div v-show="0 == previewMode">
          <div v-show="!noComment">
            <h2 class="font-thin">补充说明</h2>
            <div class="card comment">
              <div v-if="noComment">
                <p class="no-comment">现在还没有人留言.</p>
              </div>
              <div v-else>
                <div
                  v-for="item in comment"
                  :key="item.comment_id"
                  class="entry"
                >
                  <div class="user float-left center">
                    <img class="img-header" :src="item.useravatar" />
                  </div>
                  <div class="info">
                    <el-button
                      type="danger"
                      icon="delete"
                      class="float-right"
                      v-if="user.username == item.username"
                      @click="deleteComment(item.comment_id)"
                    ></el-button>
                    <div v-html="item.content"></div>
                    <div class="user-info float-right">
                      <i class="el-icon-edit"></i>{{ item.username }} 发表于
                      {{ item.rec_time }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <template v-show="user.id != ''">
            <div class="no-print">
              <h2 class="font-thin">留言</h2>
              <div class="card editor">
                <quill-editor
                  :config="config"
                  v-model="mycomment"
                ></quill-editor>
                <div class="submit">
                  <el-button
                    type="primary"
                    @click="postComment"
                    :disabled="mycomment == ''"
                    >提交</el-button
                  >
                </div>
              </div>
              <div class="card">
                <h3>附件管理</h3>
                <attach :listType="'picture-card'" />
              </div>
            </div>
          </template>
        </div>
      </div>

      <el-dialog title="原因确认" v-model="dialogFormVisible">
        <el-form :model="article">
          <el-form-item label="问题原因" :label-width="'120px'">
            <el-input
              v-model="article.remark"
              placeholder="请输入问题原因，如：机检系统异常，胶印质量、凹印质量、印码质量、成像异常等"
              auto-complete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateRemark">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor";
import Attach from "./common/Attach";

import settings from "../config/settings";
const HOST = settings.host;
import util from "../config/util";
import MyPlayer from "./common/Player";
import * as db from "../config/db";
import rtx from "../config/rtx";
import MyCard from "./common/NewsCard";

// php.ini中mssql.textlimit/mssql.textsize被设置为 409600，导致接口输入长度被截取

let config = {
  placeholder: "在此处输入留言信息...",
  //theme: 'bubble',
  theme: "snow",
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote"],
      [
        {
          header: [1, 2, 3, 4, 5, 6, false],
        },
      ],
      [
        {
          list: "ordered",
        },
        {
          list: "bullet",
        },
      ],
      [
        {
          size: ["small", false, "large", "huge"],
        },
      ],
      [
        {
          color: [],
        },
        {
          background: [],
        },
      ],
      [
        {
          align: [],
        },
      ],
      ["clean"],
      ["link"],
    ],
  },
};

export default {
  name: "my-view",
  components: {
    quillEditor,
    MyPlayer,
    Attach,
    "my-card": MyCard,
  },
  data() {
    return {
      article: {},
      config,
      comment: [],
      noComment: true,
      cartUrl: HOST + ":8000/search/#",
      // 车号/轴号信息搜索接口
      attachList: [],
      musicList: [],
      dialogFormVisible: false,
      myWorkList: [],
      hotList: [],
      latestList: [],
      logs: [],
    };
  },
  watch: {
    "article.status"(val) {
      let label = val ? "已关闭" : "未关闭";
    },
    article_id() {
      console.log(this.article_id);
      if (!this.article_id) {
        return;
      }
      this.init();
    },
  },
  computed: {
    isNotice() {
      return this.article.notice_id > 0;
    },
    needUpdateRemark() {
      return (
        this.article.category == "机检异常品" ||
        this.article.category == "质量问题发布"
      );
    },
    showDonate() {
      return this.article.category == "工艺质量隐患排查";
    },
    status_time() {
      return ("" + this.article.status_rectime).substr(0, 16);
    },
    status: {
      get() {
        return this.article.status != 0;
      },
      set(val) {
        this.article.status = val ? 1 : 0;
      },
    },
    user() {
      return this.$store.state.user;
    },
    previewMode: {
      get() {
        return this.$store.state.previewMode;
      },
      set(val) {
        this.$store.commit("enterPreview", val);
      },
    },
    preview: {
      get() {
        return this.$store.state.preview;
      },
      set(val) {
        this.$store.commit("setPreviewData", val);
      },
    },
    commentSettings() {
      return {
        article_id: this.$route.params.id,
        username: this.user.username,
        uid: this.user.id,
        useravatar: this.user.avatar,
      };
    },
    attaches() {
      //根据附件类型不同提供不同解析
      var obj = {
        image: [],
        video: [],
        audio: [],
        other: [],
      };

      this.attachList.forEach((item) => {
        var type = item.type;
        var url = settings.uploadContent + item.url;
        var item = {
          url,
          name: item.name,
        };
        if (type.includes("image")) {
          //图片
          obj.image.push(item);
        } else if (type.includes("audio")) {
          //音频
          obj.audio.push(item);
        } else if (type.includes("video/mp4")) {
          //视频
          obj.video.push(item);
        } else {
          //文档 ('application/vnd.ms') PDF('pdf')以及其它文件，直接点击后跳转链接下载
          obj.other.push(item);
        }
      });
      this.musicList = obj.audio.map((item) => {
        return {
          title: item.name.split(".")[0],
          author: "未知艺术家",
          url: item.url,
        };
      });
      return obj;
    },
    shouldReward() {
      return settings.rewardUsers.includes(this.user.username);
    },
    shouldVerify() {
      return settings.verifyUsers.includes(this.user.username);
    },
    fileList() {
      return this.$store.state.fileList;
    },
    allReceiver() {
      return util.getAllReceiver();
    },
    mycomment: {
      get() {
        return this.$store.state.commentContent;
      },
      set(val) {
        this.$store.commit("setCommentContent", val);
      },
    },
    operators() {
      return this.article.operator
        ? util.unionArr([
            this.article.user,
            ...this.article.operator.split(","),
          ])
        : [this.article.user];
    },
    article_id() {
      return this.$route.params.id;
    },
  },
  methods: {
    remind(username) {
      let msg = `${this.$store.state.user.username}提醒您尽快办理[(${
        this.article.title
      })|${settings.rtxJmpLink + "/view/" + this.article.id + "?read=1"}]`;
      let rtxList = Object.values(settings.rtxInfo);

      let users = [];
      rtxList.forEach((item) => {
        users = [...users, ...item];
      });
      users = util.unionArr(users);
      let res = users.find((item) => item.value === username.trim());
      if (typeof res == "undefined") {
        return;
      }
      this.pushMsgByRtx({
        msg,
        receiver: res.id,
        title:
          db.sys_id == 0 ? "工艺质量管理交互平台" : "印钞党支部信息管理平台",
        delaytime: 0,
      });
    },
    receiver(mode = "reward") {
      let users;
      if (mode == "reward") {
        users = settings.rtxInfo.reward.filter(
          (item) => item.name == item.reward_user
        );
        users = users.id;
      } else {
        users = settings.rtxInfo.verify.map((item) => item.id);
      }

      return users.join(",");
    },
    pushMsgByRtx(params) {
      db.proxy1082111(params).then(({ data }) => {
        this.$message.success(data.msg);
      });
    },
    verifyDonate(val, reward) {
      this.article.reward = reward;
      this.article.reward_status = val;
      var params = {
        tblname: "tbl_article",
        id: this.article.id,
        reward_status: val,
        reward,
      };
      return this.$http.jsonp(settings.api.update, {
        params,
      });
    },
    updateDonateInfo(reward) {
      var params = {
        tblname: "tbl_article",
        id: this.article.id,
        reward_status: 1,
        utf2gbk: ["reward_user"],
        reward_user: this.user.username,
        reward,
      };
      return this.$http.jsonp(settings.api.update, {
        params,
      });
    },
    passDonate(val) {
      let tip = {};
      let reward;
      if (val == 1) {
        tip.text = "该操作将通过该奖励申请，是否继续？";
        tip.title = "通过奖励";
        val = 2;
        reward = this.article.reward;
      } else {
        tip.text = "该操作将拒绝该奖励申请，是否继续？";
        tip.title = "拒绝奖励";
        reward = 0;
      }
      this.$confirm(tip.text, tip.title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => this.verifyDonate(val, reward))
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.article.reward_status = val;
          let passInfo = val ? "已经通过" : "拒绝通过";

          let msg = `${this.$store.state.user.username}对[(${
            this.article.title
          })|${
            settings.rtxJmpLink + "/view/" + this.article.id
          }]的奖励申请${passInfo}`;
          //反馈至奖励发起人员

          this.pushMsgByRtx({
            msg,
            title:
              db.sys_id == 0
                ? "工艺质量管理交互平台"
                : "印钞党支部信息管理平台",
            delaytime: 0,
            receiver: this.receiver(),
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    donate() {
      var curValue;
      this.$prompt("请输入奖励金额", "金额", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(\d*\.)?\d+$/,
        inputErrorMessage: "金额格式不正确",
        inputValue: this.article.reward,
      })
        .then(({ value }) => {
          this.updateDonateInfo(value);
          curValue = value;

          let msg = `${this.$store.state.user.username}发起了一项专项奖励,[(${
            this.article.title
          })|${settings.rtxJmpLink + "/view/" + this.article.id}]`;
          //进入下一步审批流程
          this.pushMsgByRtx({
            msg,
            title:
              db.sys_id == 0
                ? "工艺质量管理交互平台"
                : "印钞党支部信息管理平台",
            delaytime: 0,
            receiver: this.receiver("verify"),
          });
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "赞赏成功,金额:￥" + curValue,
          });
          this.article.reward_user = this.user.username;
          this.article.reward = curValue;
          this.article.reward_status = 1;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    changeArticleStatus(status) {
      return db.setArticleStatus({
        status,
        status_username: this.user.username,
        status_rectime: util.getNow(),
        remark: this.article.remark,
        _id: this.article.id,
      });
    },
    updateRemark() {
      this.dialogFormVisible = false;
      this.changeArticleStatus(1).then(() => {
        this.handleArticleClose({
          message: "关闭成功!",
          status: 1,
        });
      });
    },
    handleArticleClose(tip) {
      this.$message({
        type: "success",
        message: tip.message,
      });
      this.article.status = tip.status;

      this.$store.commit("refreshMainList", true);

      this.article.status_username = this.user.username;
      this.article.status_rectime = util.getNow();
    },
    closeArticle() {
      let tip;
      if (!this.status) {
        tip = {
          title: "此操作将文章重新置为未关闭状态, 是否继续?",
          message: "打开成功!",
          status: 0,
        };
      } else {
        tip = {
          title: "是否关闭该文章?",
          message: "关闭成功!",
          status: 1,
        };
        if (this.needUpdateRemark) {
          this.dialogFormVisible = true;
          return;
        }
      }

      this.$confirm(tip.title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return this.changeArticleStatus(this.status ? 1 : 0);
        })
        .then(() => {
          this.handleArticleClose(tip);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    closePreview() {
      this.$store.commit("enterPreview", false);
      this.$router.push("/add");
    },
    deleteComment(comment_id) {
      this.$confirm("你确定要删除该条评论?", "删除评论", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        db.delArticleComment(comment_id)
          .then((_) => {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.comment.forEach((item, i) => {
              if (item.comment_id == comment_id) {
                this.comment.splice(i, 1);
              }
            });
          })
          .catch((e) => {
            this.$message({
              type: "success",
              message: "删除失败",
            });
          });
      });
    },
    loadComment() {
      let id = this.$route.params.id;
      this.noComment = true;
      this.$http
        .jsonp(settings.api.commentDetail, {
          params: {
            aid: id,
          },
        })
        .then((res) => {
          let obj = res.data;
          if (obj.rows == 0) {
            this.comment = [];
            return;
          }
          this.noComment = false;
          obj.data = util.handleContent(obj.data);
          this.comment = obj.data.map((item) => {
            item.content = item.content
              .replace(/\\t/g, " ")
              .replace(/\n\r/g, "<br>");
            return item;
          });
        });
    },
    getCommentAttach() {
      this.fileList.sort((item1, item2) => item1.type - item2.type);

      let arrStr = this.fileList.map((file, i) => {
        let url = file.url.includes("//")
          ? file.url
          : settings.uploadContent + file.url;
        let str;
        if (file.type == "image" || file.type == "images/webp") {
          str = `<img src="${url}"/>`;
        } else {
          // pdf文件直接点击打开
          let strPdf = file.url.includes(".pdf")
            ? ""
            : `download="${file.name}"`;

          // 其它文件点击下载到本地,需保证服务器存储文件与服务文件不跨域
          // the filename that you defined will be used only if the URI of the link has the same origin of the current page.
          str = `<ul class="attach-list"><li class="attach-item"  title="'点击下载 '+${
            file.name
          }"><a href="${url}" ${strPdf} target="_blank" title="'点击下载 '+${
            file.name
          }"><i class="el-icon-document"></i> 附件${i + 1} —— ${
            file.name
          }</a></li></ul>`;
        }
        return str;
      });
      return arrStr.join(",");
    },
    async postComment() {
      this.mycomment += this.getCommentAttach();

      let comment = {
        rec_time: util.getNow(1),
        content: util.parseHtml(this.mycomment),
      };

      let params = Object.assign(comment, this.commentSettings);
      let { data } = await db.addArticleComment(params).catch((e) => {
        console.log(e);
        this.$message({
          message: "发表评论失败，请刷新重试",
          type: "error",
        });
      });
      if (data.length == 0) {
        return;
      }

      // 处理@符号后提醒的人员信息
      this.rtxRemindUser(comment.content);

      this.noComment = false;
      comment.content = this.mycomment; // util.handleAttach
      this.comment.push(comment);

      this.mycomment = "";

      this.rtxCommentStatus();
      this.$store.commit("clearFileList");
      this.addCommentNum();
    },
    getRemindReceiver(content) {
      if (!content.includes("@")) {
        return "";
      }
      // 分析出@的人员信息
      let users = content
        .split("@")
        .slice(1)
        .map((item) => {
          return item.slice(0, item.indexOf(" "));
        });
      let remUsers = rtx.users
        .filter((item) => users.includes(item.value))
        .map((item) => item.id);
      return remUsers.join(",");
    },
    rtxRemindUser(content) {
      let receiver = this.getRemindReceiver(content);
      if (receiver == "") {
        return;
      }
      let msg = `${this.$store.state.user.username}在文章[(${
        this.article.title
      })|${
        settings.rtxJmpLink + "/view/" + this.article.id
      }]的评论中提到了你。`;
      this.pushMsgByRtx({
        msg,
        receiver,
        title:
          db.sys_id == 0 ? "工艺质量管理交互平台" : "印钞党支部信息管理平台",
        delaytime: 0,
      });
    },
    // 腾讯通更新用户发送评论状态
    rtxCommentStatus() {
      let receiver = this.article.receiver;
      if (typeof receiver == "undefined") {
        receiver = this.allReceiver;
      }
      if (typeof receiver == "null" || receiver == null) {
        return;
      }
      let msg = `${this.$store.state.user.username}对文章[(${
        this.article.title
      })|${settings.rtxJmpLink + "/view/" + this.article.id}]添加了评论`;
      this.pushMsgByRtx({
        msg,
        receiver,
        title:
          db.sys_id == 0 ? "工艺质量管理交互平台" : "印钞党支部信息管理平台",
        delaytime: 0,
      });
    },
    loadArticle() {
      let id = this.$route.params.id;
      // let url = HOST + "/DataInterface/Api";
      this.$http
        .jsonp(settings.api.articleDetail, {
          params: {
            aid: id,
          },
        })
        .then((res) => {
          let obj = res.data;
          if (obj.rows == 0) {
            return;
          }
          obj.data[0].content = obj.data[0].content
            .replace(/\\t/g, " ")
            .replace(/\n\r/g, "<br>")
            .replace(/\\"/g, "");
          this.article = obj.data[0];
          this.article.content = this.article.content.replace(
            /\<p\>\<br\>\<\/p\>/g,
            ""
          );
          //this.article.content = util.handleAttach(this.article.content);
          this.loadAttachList();
          this.addReadNum();
          this.setReadStatus(res.body.ip);
          if (this.article.category == "质量隐患整改通知") {
            this.loadDefaultCommentTpl();
          } else {
            this.mycomment = "";
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    loadDefaultCommentTpl() {
      this.mycomment = `
          <p><strong>原因分析</strong></p>
          <p>该问题原因如下：</p>
          <p>1.</p>
          <p>2.</p>
          <p>3.</p>
          <br>
          <p><strong>措施</strong></p>
          <p>针对该问题我们采取了以下措施：</p>
          <p>1.</p>
          <p>2.</p>
          <p>3.</p>
          <br>
          <p><strong>效果</strong></p>
          <p>措施实施后，问题已完全/部分解决</p>
          <br>
          <p>详情请见附件</p>
        `;
    },
    loadAttachList() {
      this.$http
        .jsonp(settings.api.attachList, {
          params: {
            attachid: this.article.attach_list.split(","),
          },
        })
        .then((res) => {
          let obj = res.data;
          if (obj.rows == 0) {
            this.attachList = [];
            return;
          }
          this.attachList = obj.data;
        });
    },
    addReadNum() {
      if (process.env.NODE_ENV != "development") {
        this.$http.jsonp(settings.api.readnum, {
          params: {
            aid: this.article.id,
            aid2: this.article.id,
          },
        });
      }
    },
    addCommentNum() {
      if (process.env.NODE_ENV != "development") {
        this.$http.jsonp(settings.api.commentnum, {
          params: {
            aid: this.article.id,
            aid2: this.article.id,
          },
        });
      }
    },
    edit() {
      this.preview = this.article;
      this.$router.push("/edit/" + this.article.id);
      // 进入编辑模式
      this.previewMode = 2;
    },
    print() {
      window.print();
    },
    // 回执
    sendReceipt() {
      // 不是处理问题的人员，无需回执
      if (
        !this.article.operator.includes(this.user.username) ||
        this.user.username == this.article.user
      ) {
        return;
      }
      let rtxList = Object.values(settings.rtxInfo);
      let receiver = "";
      rtxList.forEach((userList) => {
        userList.forEach((item) => {
          if (item.value == this.article.user) {
            receiver = item.id;
          }
        });
      });

      // 当前用户无rtxid时，无法发送回执
      if (receiver == "") {
        return;
      }

      // 发送回执
      let msg = `${this.user.username}已阅读你的文章：[(${
        this.article.title
      })|${settings.rtxJmpLink + "/view/" + this.article.id}]`;
      this.pushMsgByRtx({
        msg,
        receiver,
        delaytime: 0,
        title:
          db.sys_id == 0 ? "工艺质量管理交互平台" : "印钞党支部信息管理平台",
      });
    },
    // 阅读状态
    setReadStatus(ip = "") {
      // let status = Reflect.has(this.$route.query, 'read');
      // if (!status || this.article.read_users.includes(this.user.username)) {
      //   return;
      // }
      let readUsers = this.article.read_users;
      if (this.article.read_users.includes(this.user.username)) {
        this.article.read_users = readUsers.replace("0、", "");
        return;
      }

      readUsers = this.article.read_users.split("、");
      if (readUsers[0] == "") {
        readUsers[0] = this.user.username;
      } else {
        readUsers.push(this.user.username);
      }
      readUsers = util.unionArr(readUsers);
      readUsers = readUsers.filter((item) => item != "0");
      this.article.read_users = readUsers.join("、");

      //更新文章阅读状态
      this.$http
        .jsonp(settings.api.updateUserInfo, {
          params: {
            read_users: this.article.read_users,
            _id: this.article.id,
          },
        })
        .then((res) => {
          // 记录用户IP地址，阅读时间
          console.info("文章阅读状态更新成功");

          const params = {
            username: this.user.username,
            ip,
            article_id: this.article_id,
          };
          this.$http.jsonp(settings.api.readLog, { params });
        })
        .catch((e) => {
          console.log(e);
        })
        .finally((e) => {
          this.sendReceipt();
        });
    },
    init() {
      // 预览模式
      if (1 == this.previewMode) {
        this.article = this.preview;
        this.article.content = JSON.parse('"' + this.article.content + '"');
        //this.article.content = util.handleAttach(this.article.content);
        this.loadAttachList();
      } else {
        if ("preview" == this.$route.params.id) {
          this.$router.push("/add");
          return;
        }

        // 从编辑界面返回时，重置标志位
        if (2 == this.previewMode) {
          this.previewMode = 0;
        }
        this.getReadLog();
        this.loadArticle();
        this.loadComment();
      }
    },
    getReadLog() {
      this.$http
        .jsonp(settings.api.getReadLog, {
          params: {
            article_id: this.article_id,
          },
        })
        .then((res) => {
          let logs = res.data.data;
          this.logs = logs
            .map((item) => `${item.username}(${item.ip} ${item.rec_time})`)
            .join("\t");
        });
    },
    getMyWorklist() {
      let newsItem = {
        title: "与我有关的工作事项",
        more: "/list/与我有关的工作事项",
        data: [],
        cateId: -2,
      };
      this.$http
        .jsonp(settings.api["workListAboutMe"], {
          params: {
            user: "%" + this.user.username + "%",
          },
        })
        .then((res) => {
          let obj = res.data;
          if (obj.rows == 0) {
            return;
          }
          let avatar;

          newsItem.data = obj.data.map((item) => {
            avatar =
              item.avatar == 1 ? window.btoa(item.avatarkey) : "Avatar_none";
            return Object.assign(item, {
              img: HOST + "/demo/avatar/" + avatar + ".jpg",
              url: "/view/" + item.id,
            });
          });
          this.myWorkList = [newsItem];
        });
    },
    getHot() {
      let newsItem = {
        title: "近期热门",
        more: null,
        data: [],
        cateId: -2,
      };
      this.$http.jsonp(settings.api["hot"]).then((res) => {
        let obj = res.data;
        if (obj.rows == 0) {
          return;
        }
        let avatar;

        newsItem.data = obj.data.map((item) => {
          avatar =
            item.avatar == 1 ? window.btoa(item.avatarkey) : "Avatar_none";
          return Object.assign(item, {
            img: HOST + "/demo/avatar/" + avatar + ".jpg",
            url: "/view/" + item.id,
          });
        });
        this.hotList = [newsItem];
      });
    },
    getLatest() {
      let newsItem = {
        title: "最新文章",
        more: null,
        data: [],
        cateId: -2,
      };
      this.$http.jsonp(settings.api["latest"]).then((res) => {
        let obj = res.data;
        if (obj.rows == 0) {
          return;
        }
        let avatar;

        newsItem.data = obj.data.map((item) => {
          avatar =
            item.avatar == 1 ? window.btoa(item.avatarkey) : "Avatar_none";
          return Object.assign(item, {
            img: HOST + "/demo/avatar/" + avatar + ".jpg",
            url: "/view/" + item.id,
          });
        });
        this.latestList = [newsItem];
      });
    },
  },
  activated() {
    // console.log(this.article_id);
    // this.init();
    this.getMyWorklist();
    this.getHot();
    this.getLatest();
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped lang="less">
@text-color: #5e6d82;
@vue-color: #42b983;
.card {
  background-color: #fff;
  padding: 20px 40px; //border-radius: 4px;
}

h2 {
  padding: 0 30px;
}

.font-thin {
  font-weight: 300;
}

.article-status {
  display: flex;
  justify-content: flex-end;
  span {
    padding-right: 7px;
  }
}

.margin-top-20 {
  margin-top: 20px;
}

.submit {
  .margin-top-20;
  display: flex;
  justify-content: flex-end;
}

.reedit {
  justify-content: flex-start;
  a {
    color: #fff;
  }
}

.donate {
  width: 100%;
  .verify-reward {
    display: flex;
    justify-content: center;
    margin: 0 auto;
  }
  p {
    text-align: center;
    font-size: 0.9em;
  }
}

.ql-editor {
  height: 100px;
  min-height: 100px;
}

.attach {
  min-height: 100px;
  .margin-top-20;
  .center {
    display: flex;
    justify-content: center;
  }
  .attach-img {
    max-width: 80%;
    border: 0;
    margin: 15px 0px;
    background: rgba(255, 255, 255, 0.12);
    border: 4px solid rgba(255, 255, 255, 0.82);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  video {
    border-radius: 4px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    max-width: 100%;
  }
  ul li {
    margin: 10px;
  }
}

@attach-box: 60px;
.attach-list {
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
.main {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  .article-container {
    display: flex;
    flex-direction: row;
    max-width: 1600px;
    width: 100%;
    .article {
      position: relative;
      min-height: 300px; //.margin-top-20;
      flex: 1;
      .noticeFont {
        font-family: "华文仿宋", "仿宋";
      }
      .notice_id {
        img {
          width: 250px;
        }
        p {
          padding-left: 15px;
          margin-top: -6px;
        }
        padding-bottom: 10px;
        margin-bottom: 30px;
        border-bottom: #bbb solid 1px;
      }
      .title {
        .font-thin;
        text-align: center;
        font-size: 21pt;
      }
      .cart-info {
        margin-right: 10px;
      }
      .sub-title {
        .font-thin;
        text-align: center;
        font-size: 12pt;
        color: @text-color;
      }

      .time {
        padding-left: 1.5em;
      }

      .content {
        text-indent: 2em;
        color: @text-color;
        line-height: 1.7em;
        border-top: 1px dotted #eee;
        padding: 20px 30px;
        padding-bottom: 10px;
        max-width: 100%;
        font-size: 1.3em;
      }
      .desc {
        border-top: 1px dotted #eee;
        padding: 20px 30px 30px 50px;
        ul li {
          line-height: 2em;
        }
      }
    }
    .widget {
      margin-left: 20px;
      width: 400px;
      .welcome {
        margin-bottom: 20px;
      }
    }
  }
}

.comment {
  min-height: 120px;
  height: 100%;
  .entry {
    width: 100%;
    min-height: 110px;
    margin-top: 15px;
    border-bottom: 1px dotted #ddd;
    display: flex;
    align-items: center;
  }

  .info {
    width: 90%;
    color: @text-color;
    padding: 10px 30px 10px 10px;
    text-indent: 2em;
  }

  blockquote {
    border-left: 5px solid #7af;
    background-color: #eef;
    font-size: 16pt;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .user {
    width: 10%;
    min-height: 80px;
  }

  .img-header {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  .user-info {
    font-size: 11pt;
    font-style: italic;
  }
}

.float-left {
  float: left;
}

.float-right {
  float: right;
}
@media print {
  .no-print {
    display: none;
  }
  p {
    margin: 0;
    padding: 3px 0;
  }
  .article {
    .title {
      margin: 0 0 10px 0;
      font-size: 25px !important;
    }
    blockquote {
      display: none;
    }
  }
}
</style>
