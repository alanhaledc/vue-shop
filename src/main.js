import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import LazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

import './assets/css/base.css'
import './assets/css/product.css'
import './assets/css/checkout.css'
import './assets/css/login.css'

Vue.config.productionTip = false

Vue.prototype.$axios = axios

Vue.use(infiniteScroll)
Vue.use(LazyLoad, {
  loading: '/static/loading/loading-bars.svg'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
