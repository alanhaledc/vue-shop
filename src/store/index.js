import Vue from 'vue'
import Vuex from 'vuex'

import goods from './modules/goods'
import user from './modules/user'
import ship from './modules/ship'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules: {
      goods,
      user,
      ship
    }
  })

  return Store
}
