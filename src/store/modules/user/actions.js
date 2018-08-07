import api from '../../../assets/api'

const normalizeCart = data => {
  let arr = []
  data.forEach(item => {
    const goods = {
      id: item.goods.productId,
      image: item.goods.productImage,
      name: item.goods.productName,
      price: item.goods.salePrice,
      quantity: item.goodsNum,
      isChecked: item.isChecked
    }
    arr.push(goods)
  })
  return arr
}

export const login = ({commit}, {username, password}) => {
  return api.login(username, password)
    .then(data => {
      if (data.status === 0) {
        commit('setUserInfo', data.result)
      }
      return data
    })
}
export const getCart = ({commit}) => {
  api.getUserCart()
    .then(data => {
      if (data.status === 0) {
        commit('setCart', normalizeCart(data.result))
      }
    })
}

export const deleteCart = ({commit}, productId) => {
  api.deleteCart(productId)
    .then(data => {
      if (data.status === 0) {
        commit('setCart', normalizeCart(data.result))
      }
    })
}

export const editCart = ({commit}, {productId, goodsNum, isChecked}) => {
  api.editCart(productId, goodsNum, isChecked)
    .then(data => {
      if (data.status === 0) {
        commit('setCart', normalizeCart(data.result))
      }
    })
}

export const checkedAll = ({commit}, isCheckedAll) => {
  api.checkedAll(isCheckedAll)
    .then(data => {
      if (data.status === 0) {
        commit('setCart', normalizeCart(data.result))
      }
    })
}

export const getAddressList = ({commit}) => {
  api.getAddress()
    .then(data => {
      if (data.status === 0) {
        commit('setAddress', data.result)
      }
    })
}

export const addAddress = ({commit}, newAddress) => {
  api.addAddress(newAddress)
    .then(data => {
      if (data.status === 0) {
        commit('setAddress', data.result)
      }
    })
}

export const deleteAddress = ({commit}, addressId) => {
  api.deleteAddress(addressId)
    .then(data => {
      if (data.status === 0) {
        commit('setAddress', data.result)
      }
    })
}

export const editAddress = ({commit}, newData) => {
  api.editAddress(newData)
    .then(data => {
      if (data.status === 0) {
        commit('setAddress', data.result)
      }
    })
}

export const setDefaultAddress = ({commit}, addressId) => {
  api.setDefaultAddress(addressId)
    .then(data => {
      if (data.status === 0) {
        commit('setAddress', data.result)
      }
    })
}

export const checkedAddress = ({commit}, addressId) => {
  api.checkedAddress(addressId)
    .then(data => {
      if (data.status === 0) {
        commit('setAddress', data.result)
      }
    })
}

export const getOrderDetail = ({commit}) => {
  api.getOrderDetail()
    .then(data => {
      if (data.status === 0) {
        commit('setOrderDetail', data.result)
      }
    })
}
