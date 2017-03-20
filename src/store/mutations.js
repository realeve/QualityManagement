// 同步事件
let mutations = {
  refreshMainList(state, val) {
    state.needRefreshMainList = val
    if (val) {
      state.mainList = []
    }
  },
  resetAddInfo(state) {
    state.add = {
      prod: '',
      proc: '',
      machine: '',
      operator: [],
      cartno: '',
      category: '',
      content: '',
      title: ''
    }
  },
  enterPreview(state, val) {
    state.previewMode = val
  },
  setPreviewData(state, data) {
    state.preview = data
  },
  clearMacineInfo(state) {
    state.add.machine = ''
  },
  convertCartno(state, val) {
    state.add.cartno = val
  },
  recordMaxListId(state, param) {
    state.articleId[param.title] = param.id
  },
  refreshNewsList(state, data) {
    // 文章二级列表数据
    if (typeof state.newsList[data.title] == 'undefined') {
      state.newsList[data.title] = data.data
    } else {
      state.newsList[data.title] = state.newsList[data.title].concat(data.data)
    }
  },
  refreshHomeNewsList(state, data) {
    // 更新主页文章数据
    state.mainList = state.mainList.concat(data).sort((a, b) => a.cateId - b.cateId)
  },
  setFileList(state, item) {
    state.fileList = item;
  },
  clearFileList(state) {
    state.fileList = []
  },
  removeFileItem(state, id) {
    state.fileList.splice(id, 1)
  },
  addFileItem(state, item) {
    state.fileList.push(item)
  },
  setUserInfo(state, value) {
    state.user = value
  },
  updateLatestFile(state, value) {
    state.latestFile = value
  },
  setMediaActiveName(state, val) {
    state.activeName = val;
  },
  setUserInfo(state,val){
    state.user = val;
  }
}

export default mutations
