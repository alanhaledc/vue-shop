import axios from 'axios'
import {createError} from '../utils'

const userRequest = axios.create({
  baseURL: '/api/user'
})

const goodsRequest = axios.create({
  baseURL: '/api/goods'
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
    return handleRequest(goodsRequest.post('/card/add', {productId}))
  },
  login(username, password) {
    return handleRequest(userRequest.post('/login', {username, password}))
  },
  logout() {
    return handleRequest(userRequest.post('/logout'))
  },
  checkLogin() {
    return handleRequest(userRequest.get('/checkLogin'))
  },
  getUserCart() {
    return handleRequest(userRequest.get('/cart'))
  },
  getUserCartCount() {
    return handleRequest(userRequest.get('/cartCount'))
  },
  deleteCart(productId) {
    return handleRequest(userRequest.post('/card/del', {productId}))
  },
  editCart(productId, productNum, isChecked) {
    return handleRequest(userRequest.post('/card/edit', {productId, productNum, isChecked}))
  },
  checkedAll(isCheckedAll) {
    return handleRequest(userRequest.post('/card/checkedAll', {isCheckedAll}))
  },
  getAddress() {
    return handleRequest(userRequest.get('/address'))
  },
  deleteAddress(addressId) {
    return handleRequest(userRequest.post('/address/del', {addressId}))
  },
  AddAddress(newAddress) {
    return handleRequest(userRequest.post('/address/add', {newAddress}))
  },
  setDefaultAddress(addressId) {
    return handleRequest(userRequest.post('/address/setDefault', {addressId}))
  },
  createPayment(addressId, orderTotalPrice) {
    return handleRequest(userRequest.post('/payment', {addressId, orderTotalPrice}))
  },
  getOrderDetail(orderId) {
    return handleRequest(userRequest.get('/orderDetail', {params: {orderId}}))
  }
}
