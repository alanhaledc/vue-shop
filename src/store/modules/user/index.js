import state from './state'
import * as getters from './getters'
import * as mutations from './mutaions'
import * as actions from './actions'

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
