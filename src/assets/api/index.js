import axios from 'axios'

const userRequest = axios.create({
  baseURL: '/user'
})

const goodsRequest = axios.create({
  baseURL: '/goods'
})

const shipRequest = axios.create({
  baseURL: '/ship'
})

export default {
  getGoodsList(page, pageSize, sort, priceLevel) {
    return goodsRequest.get('/list', {
      params: {
        page,
        pageSize,
        sort,
        priceLevel
      }
    })
  },
  addCart(productId) {
    return goodsRequest.post('/cart/add', { productId })
  },
  login(username, password) {
    return userRequest.post('/login', { username, password })
  },
  register(username, password) {
    return userRequest.post('/register', { username, password })
  },
  logout() {
    return userRequest.post('/logout')
  },
  getUserCart() {
    return userRequest.get('/cart')
  },
  getUserCartCount() {
    return userRequest.get('/cartCount')
  },
  deleteCart(productId) {
    return userRequest.post('/cart/del', { productId })
  },
  editCart(productId, goodsNum, isChecked) {
    return userRequest.post('/cart/edit', { productId, goodsNum, isChecked })
  },
  checkedAll(isCheckedAll) {
    return userRequest.post('/cart/checkedAll', { isCheckedAll })
  },
  getAddress() {
    return userRequest.get('/address')
  },
  deleteAddress(addressId) {
    return userRequest.post('/address/del', { addressId })
  },
  addAddress(newAddress) {
    return userRequest.post('/address/add', { newAddress })
  },
  editAddress(newData) {
    return userRequest.post('/address/edit', { newData })
  },
  setDefaultAddress(addressId) {
    return userRequest.post('/address/setDefault', { addressId })
  },
  checkedAddress(addressId) {
    return userRequest.post('/address/checked', { addressId })
  },
  getOrderDetail() {
    return userRequest.get('/orderDetail')
  },
  getShipList() {
    return shipRequest.get('/list')
  },
  checkedShip(shipId) {
    return shipRequest.post('/checked', { shipId })
  }
}
