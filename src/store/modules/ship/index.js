import api from '../../../assets/api'

const state = {
  shipList: []
}
const getters = {
  shipList: state => state.shipList
}
const mutations = {
  setShipList(state, list) {
    state.shipList = list
  }
}
const actions = {
  getShipList({ commit }) {
    api.getShipList()
      .then(res => {
        const { data } = res
        if (data.success) {
          commit('setShipList', data.data)
        }
      })
  },
  checkedShip({ commit }, shipId) {
    api.checkedShip(shipId)
      .then(res => {
        const { data } = res
        if (data.success) {
          commit('setShipList', data.data)
        }
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
