// src/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import state from './state'
import mutations from './mutations'


// 异步事件
// const actions = { 
//   getUserInfo(state, value) {
//     state.user = value
//   }
// }

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

export default new Vuex.Store({
  state,
  mutations,
// actions,
// getters
})
