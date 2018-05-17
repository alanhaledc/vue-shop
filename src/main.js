import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import LazyLoad from 'vue-lazyload'

Vue.config.productionTip = false

Vue.prototype.$axios = axios

Vue.use(LazyLoad, {
  loading: '/static/loading/loading-bars.svg'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
