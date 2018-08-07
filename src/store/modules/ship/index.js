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
  getShipList({commit}) {
    api.getShipList()
      .then(data => {
        if (data.status === 0) {
          commit('setShipList', data.result)
        }
      })
  },
  checkedShip({commit}, shipId) {
    api.checkedShip(shipId)
      .then(data => {
        if (data.status === 0) {
          commit('setShipList', data.result)
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
