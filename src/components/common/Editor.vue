<template>
  <div>
    <quill-editor ref="myTextEditor" :config="config" v-model="value.content">
    </quill-editor>
  </div>
</template>
<script>
import {
  quillEditor
} from 'vue-quill-editor'

let config = {
  placeholder: '在此处输入问题描述...',
  //theme: 'bubble',
  theme: 'snow',
    modules:{
      toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote'],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'align': [] }],
            ['clean'],      
            ['link']                                       // remove formatting button
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
    value() {
      return this.$store.state.add;
    }
  }
}
</script>
<style lang="less">
.ql-editor {
  min-height: 200px;
  p {
    font-size: 16pt;
    // text-indent: 2em;
    color: #5e6d82;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }
}
</style>
