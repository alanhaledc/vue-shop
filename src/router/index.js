import Vue from 'vue'
import Router from 'vue-router'
import GoodList from 'pages/good-list'
import Cart from 'pages/cart'
import Address from 'pages/address'
import OrderConfirm from 'pages/order-confirm'
import OrderSuccess from 'pages/order-success'

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
    },
    {
      path: '/orderConfirm',
      name: 'OrderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderSuccess',
      name: 'OrderSuccess',
      component: OrderSuccess
    }
  ]
})
