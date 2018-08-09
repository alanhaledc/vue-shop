import axios from 'axios'
import {createError} from '../utils'

const userRequest = axios.create({
  baseURL: '/user'
})

const goodsRequest = axios.create({
  baseURL: '/goods'
})

const shipRequest = axios.create({
  baseURL: '/ship'
})

const handleRequest = (request) => {
  return new Promise((resolve, reject) => {
    request
      .then(res => {
        const data = res.data
        if (!data) {
          return reject(createError(400, 'no result'))
        }
        if (!data.success) {
          resolve({
            status: 1,
            message: data.message
          })
        }
        resolve({
          status: 0,
          result: data.result
        })
      })
      .catch(err => {
        const res = err.response
        if (res.status === 401) {
          reject(createError(401, 'need auth'))
        }
      })
  })
}

export default {
  getGoodsList(page, pageSize, sort, priceLevel) {
    return handleRequest(goodsRequest.get('/list', {
      params: {
        page,
        pageSize,
        sort,
        priceLevel
      }
    }))
  },
  addCart(productId) {
    return handleRequest(goodsRequest.post('/cart/add', {productId}))
  },
  login(username, password) {
    return handleRequest(userRequest.post('/login', {username, password}))
  },
  register(username, password) {
    return handleRequest(userRequest.post('/register', {username, password}))
  },
  logout() {
    return handleRequest(userRequest.post('/logout'))
  },
  getUserCart() {
    return handleRequest(userRequest.get('/cart'))
  },
  getUserCartCount() {
    return handleRequest(userRequest.get('/cartCount'))
  },
  deleteCart(productId) {
    return handleRequest(userRequest.post('/cart/del', {productId}))
  },
  editCart(productId, goodsNum, isChecked) {
    return handleRequest(userRequest.post('/cart/edit', {productId, goodsNum, isChecked}))
  },
  checkedAll(isCheckedAll) {
    return handleRequest(userRequest.post('/cart/checkedAll', {isCheckedAll}))
  },
  getAddress() {
    return handleRequest(userRequest.get('/address'))
  },
  deleteAddress(addressId) {
    return handleRequest(userRequest.post('/address/del', {addressId}))
  },
  addAddress(newAddress) {
    return handleRequest(userRequest.post('/address/add', {newAddress}))
  },
  editAddress(newData) {
    return handleRequest(userRequest.post('/address/edit', {newData}))
  },
  setDefaultAddress(addressId) {
    return handleRequest(userRequest.post('/address/setDefault', {addressId}))
  },
  checkedAddress(addressId) {
    return handleRequest(userRequest.post('/address/checked', {addressId}))
  },
  getOrderDetail() {
    return handleRequest(userRequest.get('/orderDetail'))
  },
  getShipList() {
    return handleRequest(shipRequest.get('/list'))
  },
  checkedShip(shipId) {
    return handleRequest(shipRequest.post('/checked', {shipId}))
  }
}
