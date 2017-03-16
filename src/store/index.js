// src/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// vuex中数据
const state = {
  add: {
    prod: '',
    proc: '',
    machine: '',
    operator: [],
    cartno: '',
    category: '',
    content: '',
    title: ''
  },
  // 文章预览数据
  preview: '',
  previewMode: false,

  activeIndex: '',
  listId: '',
  user: {
    name: '',
    id: '',
    avatar: ''
  },
  articleId: {

  }, // 记录各分类的最大id

  // 文章二级列表数据缓存
  newsList: {

  },
  // 主页列表缓存
  mainList: [],
  needRefreshMainList: false,

  //附件文件列表
  fileList:[]
}

// 同步事件
const mutations = {
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
  clearFileList(){
    state.fileList=[];
  },
  removeFileItem(state,id){
    state.fileList.splice(id, 1);
  },
  addFileItem(state,item){
    state.fileList.push(item);
  }
}

// 计算属性
// const getters = {
//  scoreLimit: (state) => {
//    let obj = {
//      excellent: 0,
//      good: 0
//    }
//    state.users.forEach((item) => {
//      obj.excellent += (item.value == '5')
//      obj.good += (item.value == '4')
//    })
//    return obj
//  }
// }

// 异步事件
// const actions = {
//  submit() {
//    var votes = []
//    votes = state.users.map(function(item) {
//      return [item.name, item.dpt, item.value, isGM]
//    })
//    //console.log(JSON.stringify(votes))
//    state.voteNum[state.voteStep] = 1
//    //state.back()
//    //write the data to localStorage
//    console.log('提交数据')
//  }
// }

export default new Vuex.Store({
  state,
  mutations,
// actions,
// getters
})
