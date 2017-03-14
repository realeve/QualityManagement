<template>
  <div class="article-contant">
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
      </blockquote>
      <div v-if="previewMode" class="submit">
        <el-button type="success" @click="closePreview">返回编辑</el-button>
      </div>
    </div>
    <div v-if="!previewMode">
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
      <h2 class="font-thin">留言</h2>
      <div class="card editor">
        <quill-editor :config="config" v-model="mycomment"></quill-editor>
        <div class="submit">
          <el-button type="primary" @click="postComment">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    quillEditor
  } from 'vue-quill-editor';

  import settings from '../config/settings';
  const HOST = settings.host;
  import util from '../config/util';

  //存储评论临时数据，解决Vue无法全部观察的问题
  //let commentHackArr=[];

  let config = {
    placeholder: '在此处输入留言信息...',
    //theme: 'bubble',
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        //['blockquote', 'code-block'],
        ['blockquote'],
        [{
          'header': [1, 2, 3, 4, 5, 6, false]
        }],
        //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{
          'list': 'ordered'
        }, {
          'list': 'bullet'
        }],
        //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        //[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        //[{ 'direction': 'rtl' }],                         // text direction
        [{
          'size': ['small', false, 'large', 'huge']
        }], // custom dropdown
        [{
          'color': []
        }, {
          'background': []
        }], // dropdown with defaults from theme
        //[{ 'font': [] }],
        [{
          'align': []
        }],
        ['clean'],
        ['link', 'image'] // remove formatting button
        // ['link', 'image', 'video']                         // link and image, video
      ]
    }
  }

  export default {
    name: 'main',
    components: {
      quillEditor
    },
    data() {
      return {
        article: {},
        config,
        comment: [],
        mycomment: '',
        noComment: true,
        cartUrl: HOST + '/search/#'
        // 车号/轴号信息搜索接口
      }
    },
    // watch: {
    //   comment() {
    //     // 对 v-html中包含大量元素时无法正常显示的hack
    //     // 当数据量过大时，push到被观测的数据后，observer无法全部接收数据
    //     // 经测试，原因为  php.ini中mssql.textlimit/mssql.textsize被设置为 409600，导致接口输入长度被截取
    //     // 重置为：40960000
    //     this.$nextTick(() => {  
    //       console.log(commentHackArr);        
    //       commentHackArr.forEach(item => {
    //         var el = document.querySelector('#comment'+item.comment_id);
    //         if(el.innerHTML==''){
    //           el.innerHTML = item.content;
    //         }            
    //       });
    //     })
    //   }
    // },
    computed: {
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
          useravatar: HOST + '/demo/avatar/' + this.user.avatar + '.jpg'
        };
      }
    },
    methods: {
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
            return;
          }
          this.noComment = false;
          // commentHackArr = util.handleContent(obj.data);
          // console.log(commentHackArr);
          obj.data = util.handleContent(obj.data);
          this.comment = obj.data;
        });
      },
      postComment() {
        let comment = {
          rec_time: util.getNow(1),
          content: util.parseHtml(this.mycomment),
        };

        comment = Object.assign(comment, this.commentSettings);

        let params = {
          tbl: 99,
          tblname: 'tbl_article_comment',
          utf2gbk: ['username', 'content']
        };

        params = Object.assign(params, comment);

        let url = settings.api.insert;
        this.$http.post(url, params, {
          emulateJSON: true
        }).then(res => {
          this.noComment = false;
          comment.content = util.handleAttach(this.mycomment);
          this.comment.push(comment);
          this.mycomment = '';
        }).catch(e => {
          console.log(e);
          this.$message({
            message: '发表评论失败，请刷新重试',
            type: 'error'
          });
        })
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
        });
      }
    },
    mounted() {
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
      }
    }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @text-color: #5e6d82;
  @vue-color: #42b983;
  .card {
    background-color: #fff;
    padding: 20px 40px;
    border-radius: 4px;
  }
  
  .article-contant {
    margin: 60px 50px 10px 50px;
  }
  
  .font-thin {
    font-weight: 300;
  }
  
  .margin-top-20 {
    margin-top: 20px;
  }
  
  .submit {
    .margin-top-20;
    display: flex;
    justify-content: flex-end;
  }
  
  .ql-editor {
    height: 100px;
    min-height: 100px;
  }
  
  .article {
    min-height: 300px;
    .margin-top-20;
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
