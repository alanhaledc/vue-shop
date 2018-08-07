const Router = require('koa-router')

const User = require('../db/models/user')
require('../db/models/goods')
const Ship = require('../db/models/ship')

const {successResponse, failResponse, createOrderId} = require('../utils')

const router = new Router({
  prefix: '/user'
})

// 用户登录
router.post('/login', async ctx => {
  try {
    const userData = ctx.request.body
    const user = await User.findOne(userData).populate('cartList.goods')
    ctx.cookies.set('userId', user.userId, {
      path: '/',
      maxAge: 86400000
    })
    ctx.cookies.set('username', user.username, {
      path: '/',
      maxAge: 86400000
    })
    ctx.body = successResponse({
      username: user.username
    })
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 用户登出
router.post('/logout', async ctx => {
  ctx.cookies.set('userId', '', {
    path: '/',
    maxAge: -1
  })
  ctx.body = successResponse('')
})

// 检查用户是否登录
router.get('/checkLogin', async ctx => {
  if (ctx.cookies.get('userId')) {
    ctx.body = successResponse(ctx.cookies.get('userName'))
  } else {
    ctx.body = failResponse('当前未登录')
  }
})

// 获取用户购物车数据
router.get('/cart', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const user = await User.findOne({userId}).populate('cartList.goods')
    ctx.body = successResponse(user.cartList)
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 获取购物车物品总数量
router.get('/cartCount', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const user = await User.findOne({userId}).populate('cartList.goods')
    let count = 0
    if (user.cartList.length) {
      user.cartList.forEach(item => {
        if (item.isChecked) {
          count += item.goodsNum
        }
      })
    }
    ctx.body = successResponse(count)
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 删除购物车物品
router.post('/cart/del', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const productId = ctx.request.body.productId
    const user = await User.findOne({userId}).populate('cartList.goods')
    const idx = user.cartList.findIndex(item => item.goods.productId === productId)
    user.cartList.splice(idx, 1)
    await user.save()
    ctx.body = successResponse(user.cartList)
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 编辑购物车物品数量和选中
router.post('/cart/edit', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const productId = ctx.request.body.productId
    const goodsNum = ctx.request.body.goodsNum
    const isChecked = ctx.request.body.isChecked
    const user = await User.findOne({userId}).populate('cartList.goods')
    const idx = user.cartList.findIndex(item => item.goods.productId === productId)
    if (goodsNum) {
      user.cartList[idx].goodsNum = goodsNum
    }
    if (isChecked !== undefined) {
      user.cartList[idx].isChecked = isChecked
    }
    await user.save()
    ctx.body = successResponse(user.cartList)
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 检查是否全选
router.post('/cart/checkedAll', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const isCheckedAll = ctx.request.body.isCheckedAll
    const user = await User.findOne({userId}).populate('cartList.goods')
    if (user.cartList.length) {
      user.cartList.forEach(item => {
        item.isChecked = isCheckedAll
      })
      await user.save()
      ctx.body = successResponse(user.cartList)
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 获取地址列表
router.get('/address', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const user = await User.findOne({userId})
    ctx.body = successResponse(user.addressList)
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 删除地址
router.post('/address/del', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const addressId = ctx.request.body.addressId
    console.log(addressId)
    const user = await User.findOne({userId})
    const idx = user.addressList.findIndex(item => {
      return item._id.toString() === addressId
    })
    console.log(idx)
    user.addressList.splice(idx, 1)
    await user.save()
    ctx.body = successResponse(user.addressList)
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 修改地址
router.post('/address/edit', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const newData = ctx.request.body.newData
    const {_id} = newData
    newData.meta.updateAt = Date.now()
    const user = await User.findOne({userId})
    const idx = user.addressList.findIndex(item => item._id.toString() === _id)
    user.addressList.splice(idx, 1, newData)
    await user.save()
    ctx.body = successResponse(user.addressList)
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 添加地址
router.post('/address/add', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const newAddress = ctx.request.body.newAddress
    const user = await User.findOne({userId})
    user.addressList.push(newAddress)
    await user.save()
    ctx.body = successResponse(user.addressList)
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 设置默认地址
router.post('/address/setDefault', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const addressId = ctx.request.body.addressId
    const user = await User.findOne({userId})
    user.addressList.forEach(item => {
      if (item._id.toString() === addressId) {
        item.isDefault = true
      } else {
        item.isDefault = false
      }
    })
    await user.save()
    ctx.body = successResponse(user.addressList)
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 选中地址
router.post('/address/checked', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const addressId = ctx.request.body.addressId
    const user = await User.findOne({userId})
    user.addressList.forEach(item => {
      if (item._id.toString() === addressId) {
        item.isChecked = true
      } else {
        item.isChecked = false
      }
    })
    await user.save()
    ctx.body = successResponse(user.addressList)
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 获取订单详情
router.get('/orderDetail', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const user = await User.findOne({userId}).populate('cartList.goods')
    const goodsList = user.cartList.filter(item => item.isChecked === true)
    let orderTotalPrice = 0
    user.cartList.forEach(item => {
      if (item.isChecked) {
        orderTotalPrice += item.goods.salePrice * item.goodsNum
      }
    })
    let address = ''
    user.addressList.forEach(item => {
      if (item.isChecked === true) {
        address = item
      }
    })
    let ship = ''
    const shipList = await Ship.find()
    shipList.forEach(item => {
      if (item.isChecked) {
        ship = item
      }
    })
    const orderId = createOrderId()
    const order = {
      orderId,
      orderTotalPrice,
      addressInfo: address,
      shipInfo: ship,
      orderStatus: 1,
      goodsList
    }
    user.orderList.push(order)
    await user.save()
    ctx.body = successResponse(order)
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 获取订单详情1111
router.get('/1111orderDetail', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const orderId = ctx.query.orderId
    const user = await User.findOne({userId})
    if (user.orderList.length) {
      const orderIndex = user.orderList.findIndex(item => item.order === orderId)
      if (orderIndex) {
        ctx.body = successResponse(user.orderList[orderIndex])
      } else {
        ctx.body = failResponse('无此订单')
      }
    } else {
      ctx.body = failResponse('当前用户未创建订单')
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

module.exports = router
