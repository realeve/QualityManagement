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

var config = {
  placeholder: '在此处输入问题描述...',
  //theme: 'bubble',
  theme: 'snow',
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
      return this.$store.state.addValue;
    }
  }
}
</script>
<style lang="less">
.ql-editor {
  min-height: 300px;
  p {
    font-size: 16pt;
    // text-indent: 2em;
    color: #5e6d82;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }
}
</style>
