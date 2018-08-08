import {LocalStorage} from 'quasar'

const state = {
  userInfo: LocalStorage.get.item('userInfo') || {},
  cart: [],
  cartCount: 0,
  addressList: [],
  orderDetail: {}
}

export default state
