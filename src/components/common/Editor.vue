<template>
  <div>
    <quill-editor ref="myTextEditor" :config="config" v-model="value.content" @blur="onEditorBlur($event)" @change="onEditorChange($event)">
    </quill-editor>
  </div>
</template>
<script>
  import {
    quillEditor
  } from 'vue-quill-editor'
  let _ = require('lodash');

  let config = {
    placeholder: '在此处输入问题描述...',
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
        }], // custom dropdown
        [{
          'color': []
        }, {
          'background': []
        }], // dropdown with defaults from theme
        [{
          'align': []
        }],
        ['clean'],
        ['link'] // remove formatting button
      ]
    }
  }

  // use
  export default {
    components: {
      quillEditor
    },
    data() {
      return {
        config
      }
    },
    computed: {
      value: {
        get() {
          return this.$store.state.add;
        },
        set(content) {
          this.$store.commit('setArticleInfo', {
            content
          });
        }
      }
    },
    methods: {
      onEditorBlur(editor) {
        window.localStorage.setItem('editor', this.value.content);
      },
      onEditorChange: _.throttle(function ({
        editor,
        html,
        text
      }) {
        if (html.length > 10000) {
          this.$message.info('文字长度达到10,000，建议分段发送文章.');
        }
        window.localStorage.setItem('editor', html);      
      }, 1000 * 10),
    },
    mounted() {
      let content = window.localStorage.getItem('editor');
      if (typeof content != 'undefined'  && this.value.content) {
        this.value.content = content;
      }
    }
  }

</script>
<style lang="less">
  .ql-editor {
    min-height: 200px;
    p {
      font-size: 16pt; 
      text-indent: 2em;
      color: #333;
      font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    }
  }

</style>
