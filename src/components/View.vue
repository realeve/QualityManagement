<template>
  <div>
    <div class="card article">
      <h1 class="title">{{article.title}}</h1>
      <h3 class="sub-title">
        {{article.user}}
        <span class="time">{{article.datetime}}</span>
        <p>
          {{article.prod}} • {{article.proc}} • {{article.machine}}
        </p>
      </h3>
      <div class="content" v-html="article.content"></div>
      <blockquote>本问题由 {{article.operator}} 确认
        <p>类型：{{article.category}}</p>
        <p v-if="article.cartno">车号: <a target="_blank" :href="cartUrl+article.cartno">{{article.cartno}}</a></p>
        <p v-show="article.status_username!='' && !previewMode">文章状态：{{article.status_username}} 于 {{status_time}}{{status==1?'关闭':'重新打开'}}</p>
      </blockquote>
      <div v-if="previewMode" class="submit">
        <el-button type="success" @click="closePreview">返回编辑</el-button>
      </div>
      <div v-else class="article-status">
        <span>文章状态</span>
        <el-switch v-model="status" on-color="#13ce66" off-color="#ff4949" on-text="已关闭" off-text="未关闭" :width="72" @change="closeArticle">
        </el-switch>
      </div>
      <div v-if="showDonate" class="donate">
        <div class="verify-reward">
          <el-button v-if="shouldReward && article.reward==''" type="danger" size="large" @click="donate">发起奖励</el-button>
        </div>
        <template v-if="article.reward">
          <div class="verify-reward">
            <el-button v-if="shouldVerify && article.reward_status==0" type="danger" size="large" @click="passDonate(1)">通过奖励</el-button>
            <el-button v-if="shouldVerify && article.reward_status==0" type="warning" size="large" @click="passDonate(-1)">拒绝通过</el-button>
          </div>
          <p v-show="article.reward_status>0 || (article.reward_status>-1 && shouldVerify)">本文由{{article.reward_user}}发起了
            <el-tag type="danger">￥{{article.reward}}</el-tag> 元的奖励</p>
        </template>
      </div>
    </div>
    <div v-show="attachList.length">
      <h2 class="font-thin">附件列表</h2>
      <div class="card attach">
        <el-carousel indicator-position="inside" height="500px" v-if="attaches.image.length" arrow="always">
          <el-carousel-item v-for="(item,i) in attaches.image" :key="i">
            <img :src="item.url" :alt="item.name">
          </el-carousel-item>
        </el-carousel>

        <div v-if="musicList.length" class="center margin-top-20">
          <my-player :music="musicList" />
        </div>

        <div class="center margin-top-20">
          <div v-for="item in attaches.video">
            <video :src="item.url" controls="controls"></video>
          </div>
        </div>

        <ul class="attach-list">
          <li class="attach-item" v-for="(item,i) in attaches.other" :title="'点击下载 '+item.name">
            <a :href="item.url" target="_blank" :title="'点击下载 '+item.name"><i class="el-icon-document"></i> 附件{{i+1}} —— {{item.name}}</a>
          </li>
        </ul>

      </div>
    </div>
    <div v-show="!previewMode">
      <div v-show="!noComment">
        <h2 class="font-thin">补充说明</h2>
        <div class="card comment">
          <div v-if="noComment">
            <p class="no-comment">
              现在还没有人留言.
            </p>
          </div>
          <div v-else>
            <div v-for="item in comment" class="entry">
              <div class="user float-left center">
                <img class="img-header" :src="item.useravatar">
              </div>
              <div class="info">
                <div v-html="item.content"></div>
                <div class="user-info float-right"><i class="el-icon-edit"></i>{{item.username}} 发表于 {{item.rec_time}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-show="user.id!=''">
        <h2 class="font-thin">留言</h2>
        <div class="card editor">
          <quill-editor :config="config" v-model="mycomment"></quill-editor>
          <div class="submit">
            <el-button type="primary" @click="postComment" :disabled="mycomment==''">提交</el-button>
          </div>
        </div>
        <div class="card">
          <h3>附件管理</h3>
          <attach :listType="'picture-card'" />
        </div>
      </template>

    </div>
  </div>
</template>
<script>
  import {
    quillEditor
  } from 'vue-quill-editor';
  import Attach from './common/Attach';

  import settings from '../config/settings';
  const HOST = settings.host;
  import util from '../config/util';
  import MyPlayer from './common/Player';

  // php.ini中mssql.textlimit/mssql.textsize被设置为 409600，导致接口输入长度被截取

  let config = {
    placeholder: '在此处输入留言信息...',
    //theme: 'bubble',
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote'],
        [{
          'header': [1, 2, 3, 4, 5, 6, false]
        }],
        [{
          'list': 'ordered'
        }, {
          'list': 'bullet'
        }],
        [{
          'size': ['small', false, 'large', 'huge']
        }],
        [{
          'color': []
        }, {
          'background': []
        }],
        [{
          'align': []
        }],
        ['clean'],
        ['link']
      ]
    }
  }

  export default {
    name: 'main',
    components: {
      quillEditor,
      MyPlayer,
      Attach
    },
    data() {
      return {
        article: {},
        config,
        comment: [],
        noComment: true,
        cartUrl: HOST + '/search/#',
        // 车号/轴号信息搜索接口
        attachList: [],
        musicList: [],
        mycomment: ''
      }
    },
    watch: {
      "article.status" (val) {
        let label = val ? '已关闭' : '未关闭';
      }
    },
    computed: {
      showDonate() {
        return this.article.category == '风险隐患排查';
      },
      status_time() {
        return ('' + this.article.status_rectime).substr(0, 16);
      },
      status() {
        return this.article.status != 0;
      },
      user() {
        return this.$store.state.user;
      },
      previewMode() {
        return this.$store.state.previewMode;
      },
      commentSettings() {
        return {
          article_id: this.$route.params.id,
          username: this.user.username,
          uid: this.user.id,
          useravatar: this.user.avatar
        };
      },
      attaches() {
        //根据附件类型不同提供不同解析
        var obj = {
          image: [],
          video: [],
          audio: [],
          other: []
        }

        this.attachList.forEach(item => {
          var type = item.type;
          var url = settings.uploadContent + item.url;
          var item = {
            url,
            name: item.name
          };
          if (type.includes('image')) {
            //图片
            obj.image.push(item);
          } else if (type.includes('audio')) {
            //音频
            obj.audio.push(item);
          } else if (type.includes('video/mp4')) {
            //视频
            obj.video.push(item);
          } else {
            //文档 ('application/vnd.ms') PDF('pdf')以及其它文件，直接点击后跳转链接下载
            obj.other.push(item);
          }
        });
        this.musicList = obj.audio.map(item => {
          return {
            title: item.name.split('.')[0],
            author: '未知艺术家',
            url: item.url
          }
        })
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
      }
    },
    methods: {
      receiver(mode = 'reward') {
        let users;
        if (mode == 'reward') {
          users = settings.rtxInfo.reward.filter(item => item.name == item.reward_user);
          users = users.id;
        } else {
          users = settings.rtxInfo.verify.map(item => item.id);
        }

        return users.join(',');
      },
      pushMsgByRtx(params) {
        let url = settings.host + '/DataInterface/rtxPush'
        return this.$http.jsonp(url, {
          params
        }).then(response => this.$message.success(response.data.msg))
      },
      verifyDonate(val) {
        var params = {
          tblname: 'tbl_article',
          id: this.article.id,
          reward_status: val
        };
        return this.$http.jsonp(settings.api.update, {
          params
        });
      },
      updateDonateInfo(reward) {
        var params = {
          tblname: 'tbl_article',
          id: this.article.id,
          reward_status: 0,
          utf2gbk: ['reward_user'],
          reward_user: this.user.username,
          reward
        };
        return this.$http.jsonp(settings.api.update, {
          params
        });
      },
      passDonate(val) {
        let tip = {};
        if (val == 1) {
          tip.text = '该操作将通过该奖励申请，是否继续？';
          tip.title = '通过奖励'
        } else {
          tip.text = '该操作将拒绝该奖励申请，是否继续？';
          tip.title = '拒绝奖励'
        }
        this.$confirm(tip.text, tip.title, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => this.verifyDonate(val))
          .then(() => {
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.article.reward_status = val;
            let passInfo = val ? '已经通过' : '拒绝通过';

            let msg =
              `${this.$store.state.user.username}对[(${this.article.title})|${settings.rtxJmpLink+'/view/'+this.article.id}]的奖励申请${passInfo}`;
            //反馈至奖励发起人员

            this.pushMsgByRtx({
              msg,
              title: '质量信息平台',
              delaytime: 0,
              receiver: this.receiver()
            });
          })
          .catch((e) => {
            console.log(e);
          });
      },
      donate() {
        var curValue;
        this.$prompt('请输入奖励金额', '金额', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^(\d*\.)?\d+$/,
            inputErrorMessage: '金额格式不正确'
          })
          .then(({
            value
          }) => {
            this.updateDonateInfo(value);
            curValue = value;

            let msg =
              `${this.$store.state.user.username}发起了一项专项奖励,[(${this.article.title})|${settings.rtxJmpLink+'/view/'+this.article.id}]`;
            //进入下一步审批流程
            this.pushMsgByRtx({
              msg,
              title: '质量信息平台',
              delaytime: 0,
              receiver: this.receiver('verify')
            });
          })
          .then(() => {
            this.$message({
              type: 'success',
              message: '赞赏成功,金额:￥' + curValue
            });
            this.article.reward_user = this.user.username;
            this.article.reward = curValue;
            this.article.reward_status = 0;
          })
          .catch((e) => {
            console.log(e);
          });
      },
      changeArticleStatus(status) {
        var params = {
          tblname: 'tbl_article',
          id: this.article.id,
          status,
          utf2gbk: ['status_username'],
          status_username: this.user.username,
          status_rectime: util.getNow()
        };
        return this.$http.jsonp(settings.api.update, {
          params
        });
      },
      closeArticle() {
        let tip;
        if (this.status) {
          tip = {
            title: '此操作将文章重新置为未关闭状态, 是否继续?',
            message: '打开成功!',
            status: 0
          };

        } else {
          tip = {
            title: '是否关闭该文章?',
            message: '关闭成功!',
            status: 1
          };
        }

        this.$confirm(tip.title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return this.changeArticleStatus(tip.status);
        }).then(() => {
          this.$message({
            type: 'success',
            message: tip.message
          });
          this.article.status = tip.status;

          this.$store.commit('refreshMainList', true);
          this.$store.commit('updateneedRefreshNewsList', {
            category: this.article.category,
            value: true
          })
          this.article.status_username = this.user.username;
          this.article.status_rectime = util.getNow();
        }).catch(e => {
          console.log(e);
        });
      },
      closePreview() {
        this.$store.commit('enterPreview', false);
        this.$router.push('/add');
      },
      loadComment() {
        let id = this.$route.params.id;
        this.$http.jsonp(settings.api.commentDetail, {
          params: {
            aid: id
          }
        }).then(res => {
          let obj = res.data;
          if (obj.rows == 0) {
            this.noComment = true;
            return;
          }
          this.noComment = false;
          obj.data = util.handleContent(obj.data);
          this.comment = obj.data;
        });
      },
      getCommentAttach() {
        this.fileList.sort((item1, item2) => item1.type - item2.type);

        let arrStr = this.fileList.map((file, i) => {
          let url = file.url.includes('//') ? file.url : settings.uploadContent + file.url;
          let str;
          if ((file.type == 'image' || file.type == 'images/webp')) {
            str = `<img src="${url}"/>`;
          } else {
            // pdf文件直接点击打开
            let strPdf = file.url.includes('.pdf') ? '' : `download="${file.name}"`;

            // 其它文件点击下载到本地,需保证服务器存储文件与服务文件不跨域
            // the filename that you defined will be used only if the URI of the link has the same origin of the current page.
            str =
              `<ul class="attach-list"><li class="attach-item"  title="'点击下载 '+${file.name}"><a href="${url}" ${strPdf} target="_blank" title="'点击下载 '+${file.name}"><i class="el-icon-document"></i> 附件${i+1} —— ${file.name}</a></li></ul>`;
          }
          return str;
        });
        return arrStr.join(',');
      },
      postComment() {
        this.mycomment += this.getCommentAttach();

        let comment = {
          rec_time: util.getNow(1),
          content: util.parseHtml(this.mycomment),
        };

        comment = Object.assign(comment, this.commentSettings);

        let params = {
          tblname: 'tbl_article_comment',
          utf2gbk: ['username', 'content']
        };

        params = Object.assign(params, comment);

        let url = settings.api.insert;
        this.$http.post(url, params, {
          emulateJSON: true
        }).then(res => {
          this.noComment = false;
          comment.content = this.mycomment; // util.handleAttach
          this.comment.push(comment);

          this.mycomment = '';

          this.rtxCommentStatus();
          this.$store.commit('clearFileList');
        }).catch(e => {
          console.log(e);
          this.$message({
            message: '发表评论失败，请刷新重试',
            type: 'error'
          });
        })
      },
      // 腾讯通更新用户发送评论状态
      rtxCommentStatus() {
        let msg =
          `${this.$store.state.user.username}对文章[(${this.article.title})|${settings.rtxJmpLink+'/view/'+this.article.id}]添加了评论`;
        this.pushMsgByRtx({
          msg,
          title: '质量信息平台',
          delaytime: 0,
          receiver: this.allReceiver //this.$store.state.rtxlist.join(',')
        });
      },
      loadArticle() {
        let id = this.$route.params.id;
        let url = HOST + '/DataInterface/Api';
        this.$http.jsonp(settings.api.articleDetail, {
          params: {
            aid: id
          }
        }).then(res => {
          let obj = res.data;
          if (obj.rows == 0) {
            return;
          }
          this.article = obj.data[0];
          //this.article.content = util.handleAttach(this.article.content);
          this.loadAttachList();
        });
      },
      loadAttachList() {
        this.$http.jsonp(settings.api.attachList, {
          params: {
            attachid: this.article.attach_list.replace(/,/g, "','")
          }
        }).then(res => {
          let obj = res.data;
          if (obj.rows == 0) {
            this.attachList = [];
            return;
          }
          this.attachList = obj.data;
        });
      },
      init() {
        if (!this.previewMode) {
          if ('preview' == this.$route.params.id) {
            this.$router.push('/add');
            return;
          }
          this.loadArticle();
          this.loadComment();
        } else {
          this.article = this.$store.state.preview;
          this.article.content = JSON.parse('"' + this.article.content + '"');
          //this.article.content = util.handleAttach(this.article.content);
          this.loadAttachList();
        }
      }
    },
    activated() {
      this.init();
    }
  }

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


  .article {
    min-height: 300px; //.margin-top-20;
    .title {
      .font-thin;
      text-align: center;
      font-size: 30pt;
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

    blockquote {
      color: @text-color;
      padding: 10px 30px 10px 10px;
      border-left: 5px solid @vue-color;
      background-color: #eff;
    }

    .desc {
      border-top: 1px dotted #eee;
      padding: 20px 30px 30px 50px;
      ul li {
        line-height: 2em;
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

</style>
