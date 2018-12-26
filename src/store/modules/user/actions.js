import api from '../../../assets/api'

const normalizeCart = data => {
  let cartList = []
  data.forEach(item => {
    const goods = {
      id: item.goods.productId,
      image: item.goods.productImage,
      name: item.goods.productName,
      price: item.goods.salePrice,
      quantity: item.goodsNum,
      isChecked: item.isChecked
    }
    cartList.push(goods)
  })
  return cartList
}

export const login = ({ commit }, { username, password }) => {
  return api.login(username, password)
    .then(res => {
      const { data } = res
      if (data.success) {
        commit('setUserInfo', data.data)
      }
      return res
    })
}

export const register = ({ commit }, { username, password }) => {
  return api.register(username, password)
    .then(res => {
      const { data } = res
      if (data.success) {
        commit('setUserInfo', data.data)
      }
      return res
    })
}

export const logout = ({ commit }) => {
  return api.logout()
    .then(res => {
      const { data } = res
      if (data.success) {
        commit('setUserInfo', {})
      }
      return res
    })
}

export const getCart = ({ commit }) => {
  api.getUserCart()
    .then(res => {
      const { data } = res
      if (data.success) {
        commit('setCart', normalizeCart(data.data))
      }
    })
}

export const getCartCount = ({ commit }) => {
  api.getUserCartCount()
    .then(res => {
      const { data } = res
      if (data.success) {
        commit('setCartCount', data.data)
      }
    })
}

export const deleteCart = ({ commit }, productId) => {
  api.deleteCart(productId)
    .then(res => {
      const { data } = res
      if (data.success) {
        commit('setCart', normalizeCart(data.data))
      }
    })
}

export const editCart = ({ commit }, { productId, goodsNum, isChecked }) => {
  api.editCart(productId, goodsNum, isChecked)
    .then(res => {
      const { data } = res
      if (data.success) {
        commit('setCart', normalizeCart(data.data))
      }
    })
}

export const checkedAll = ({ commit }, isCheckedAll) => {
  api.checkedAll(isCheckedAll)
    .then(res => {
      const { data } = res
      if (data.success) {
        commit('setCart', normalizeCart(data.data))
      }
    })
}

export const getAddressList = ({ commit }) => {
  api.getAddress()
    .then(res => {
      const { data } = res
      if (data.success) {
        commit('setAddress', data.data)
      }
    })
}

export const addAddress = ({ commit }, newAddress) => {
  api.addAddress(newAddress)
    .then(res => {
      const { data } = res
      if (data.success) {
        commit('setAddress', data.data)
      }
    })
}

export const deleteAddress = ({ commit }, addressId) => {
  api.deleteAddress(addressId)
    .then(res => {
      const { data } = res
      if (data.success) {
        commit('setAddress', data.data)
      }
    })
}

export const editAddress = ({ commit }, newData) => {
  api.editAddress(newData)
    .then(res => {
      const { data } = res
      if (data.success) {
        commit('setAddress', data.data)
      }
    })
}

export const setDefaultAddress = ({ commit }, addressId) => {
  api.setDefaultAddress(addressId)
    .then(res => {
      const { data } = res
      if (data.success) {
        commit('setAddress', data.data)
      }
    })
}

export const checkedAddress = ({ commit }, addressId) => {
  api.checkedAddress(addressId)
    .then(res => {
      const { data } = res
      if (data.success) {
        commit('setAddress', data.data)
      }
    })
}

export const getOrderDetail = ({ commit }) => {
  api.getOrderDetail()
    .then(res => {
      const { data } = res
      if (data.success) {
        commit('setOrderDetail', data.data)
      }
    })
}
