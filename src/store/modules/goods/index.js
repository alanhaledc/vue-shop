import api from '../../../assets/api'

const state = {
  goodsList: []
}
const getters = {
  goodsList: state => state.goodsList
}
const mutations = {
  setGoodsList(state, list) {
    state.goodsList = list
  }
}
const actions = {
  addCart({commit}, productId) {
    api.addCart(productId)
      .then(data => {
        Promise.resolve(data)
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
