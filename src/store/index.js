import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  nickName: '',
  cartCount: 0
}

const getters = {
  nickName(state) {
    return state.nickName
  },
  cartCount(state) {
    return state.cartCount
  }
}

const mutations = {
  setNickName(state, name) {
    state.nickName = name
  },
  setCartCount(state, num) {
    state.cartCount = num
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations
})
