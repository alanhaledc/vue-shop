import {LocalStorage} from 'quasar'

export const setUserInfo = (state, data) => {
  state.userInfo = data
  LocalStorage.set('userInfo', data)
}

export const setCart = (state, list) => {
  state.cart = list
}

export const setCartCount = (state, data) => {
  state.cartCount = data
}

export const setAddress = (state, list) => {
  state.addressList = list
}

export const setOrderDetail = (state, data) => {
  state.orderDetail = data
}
