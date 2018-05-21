import Vue from 'vue'
import Router from 'vue-router'
import GoodList from 'pages/good-list'
import Cart from 'pages/cart'
import Address from 'pages/address'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodList',
      component: GoodList
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    }
  ]
})
