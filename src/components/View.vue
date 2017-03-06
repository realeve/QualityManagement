<template>
  <div>
    <div class="card article">
      <h2 class="title">{{article.title}}</h2>
      <h3 class="sub-title">
          {{article.user}}
          <span class="time">{{article.datetime}}</span>
          <p>
            {{article.prod}} • {{article.proc}} • {{article.machine}}
          </p>
      </h3>
      <div class="content" v-html="article.content"></div>
      <blockquote>本问题由 {{article.operator}} 确认</blockquote>
    </div>
    <h2 class="font-thin">评论</h2>
    <div class="card comment">
      <div v-for="item in comment" class="entry">
        <div class="user float-left center">
           <img class="img-header" :src="item.img">
        </div>
        <div class="info">
            <div v-html="item.content"></div>
            <div class="user-info float-right"><i class="el-icon-edit"></i>{{item.user}} 发表于 {{item.datetime}}</div>
        </div>
      </div>
    </div>
    <h2 class="font-thin">留言</h2>
    <div class="card">
      <quill-editor :config="config" v-model="mycomment"></quill-editor>
      <div class="submit">
        <el-button  type="primary" @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  quillEditor
} from 'vue-quill-editor';

var config = {
  placeholder: '在此处输入留言信息...',
  //theme: 'bubble',
  theme: 'snow',
}

export default {
  name: 'main',
  components: {
    quillEditor
  },
  data(){
    return{
      article:{
        title: '这是一段质量周段信息这是一段质量周段信息',
        count: 421,
        user: '张三',
        datetime: '2017-03-06 09:23',
        id: 211,
        content:'<p>基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。</p>',
        machine:'接线凹-4号机',
        proc:'凹印',
        prod:'9607T',
        operator:'张三,李四,李五'
      },
      config,
      comment:[{
        user:'张三',
        datetime:'2017-03-05 11:23:33',
        content:'信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印钞专业的信息关联，同时提供相关生产和质量信息查询统计。基本功能：整合公司各类质量数据库，实现钞纸、印',
        img:'http://localhost/demo/avatar/Avatar_none.jpg'
      },{
        user:'张四',
        datetime:'2017-03-04 14:23:33',
        content:'sdfasdfasdfasdf',
        img:'http://localhost/demo/avatar/Avatar_none.jpg'
      }],
      mycomment:''
    }
  },
  methods:{
    submit(){
      this.comment.push({
        user:'张四',
        datetime:'2017-03-04 14:23:33',
        content:this.mycomment,
        img:'http://localhost/demo/avatar/Avatar_none.jpg'
      });
      this.mycomment='';
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@text-color:#5e6d82;
.card {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}
.font-thin{
    font-weight:300;
}
.margin-top-20 {
  margin-top: 20px;
}

.submit {
    .margin-top-20;
    display: flex;
    justify-content: flex-end;
}
.article{
  min-height: 300px;
  .margin-top-20;
  .title,{
    .font-thin;
    text-align:center;
  }
  .sub-title{
    .title;
    font-size:12pt;
    color:@text-color;
  }
  .time{
    padding-left:1.5em;
  }

  .content{
    text-indent:2em;
    color:@text-color;
    line-height: 1.7em;
    border-top: 1px dotted #eee;
    padding:20px 30px;
    padding-bottom:10px;
  }
  blockquote{
    color:@text-color;
    padding:10px 30px 10px 10px;
    border-left:5px solid #aaa;
    background-color:#eee;
  }

  .desc{
    border-top: 1px dotted #eee;
    padding:20px 30px 30px 50px;
    ul li{
      line-height:2em;
    }
  }
}

.comment{
  min-height:200px;
  height:100%;
  .entry{
    width:100%;
    min-height: 110px;
    margin-top:15px;
    border-bottom: 1px dotted #ddd;
    display:flex;
    align-items:center;
  }
  .info{
    width:90%;
    color:@text-color;
    padding:10px 30px 10px 10px;
    text-indent:2em;
  }

  blockquote{
    border-left:5px solid #7af;
    background-color:#eef;
  }

  .center{
    display:flex;
    justify-content:center;
    align-items:center;
  }
  .user{
    width:10%;
    min-height:80px;
  }
  .img-header{
    width:60px;
    height:60px;
    border-radius: 50%;
  }
  .user-info{
    font-size:11pt;
    font-style: italic;
  }
}
.float-left{
  float:left;
}
.float-right{
  float:right;
}

</style>
