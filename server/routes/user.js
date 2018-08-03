const Router = require('koa-router')

const User = require('../db/models/user')

const {successResponse, failResponse, createOrderId} = require('../utils')

const router = new Router({
  prefix: '/api/user'
})

// 用户登录
router.post('/login', async ctx => {
  try {
    const userData = ctx.request.body
    const user = await User.findOne(userData)
    ctx.cookies.set('userId', user.userId, {
      path: '/',
      maxAge: 86400000
    })
    ctx.cookies.set('userName', user.userName, {
      path: '/',
      maxAge: 86400000
    })
    ctx.body = successResponse({
      userName: user.userName
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
    const user = await User.findOne({userId})
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
    const user = await User.findOne({userId})
    let count = 0
    if (user.cartList.length) {
      user.cartList.forEach(item => {
        count += item.productNum
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
    await User.update(
      {userId},
      {
        $pull: {
          cartList: {productId}
        }
      }
    )
    ctx.body = successResponse('')
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 编辑购物车物品数量
router.post('/cart/edit', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const productId = ctx.request.body.productId
    const productNum = ctx.request.body.productNum
    const isChecked = ctx.request.body.isChecked

    await User.update(
      {userId, 'cartList.productId': productId},
      // {
      //   'cartList.$.productNum': productNum,
      //   'cartList.$.isChecked': isChecked
      // }
      {
        $set: {
          productNum: productNum,
          isChecked: isChecked
        }
      }
    )
    ctx.body = successResponse('')
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
    const user = await User.findOne({userId})
    if (user.cartList.length) {
      user.cartList.forEach(item => {
        item.isChecked = isCheckedAll
      })
      await user.save()
      ctx.body = successResponse('')
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
    await User.update(
      {userId},
      {
        $pull: {
          addressList: {_id: addressId}
        }
      }
    )
    ctx.body = successResponse('')
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
    user.addressList.push({
      ...newAddress,
      isDefault: false
    })
    await user.save()
    ctx.body = successResponse('')
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
    const user = User.findOne({userId})
    user.addressList.forEach(item => {
      if (item._id.toString() === addressId) {
        item.isDefault = true
      } else {
        item.isDefault = false
      }
    })
    await user.save()
    ctx.body = successResponse('')
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 生成订单
router.post('/payment', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const addressId = ctx.request.body.addressId
    const orderTotalPrice = ctx.request.body.orderTotalPrice
    const user = await User.findOne({userId})
    let address = ''
    user.addressList.forEach(item => {
      if (item._id.toString() === addressId) {
        address = item
      }
    })
    const goodsList = user.cartList.filter(item => item.isChecked === true)
    const orderId = createOrderId()
    const order = {
      orderId,
      orderTotalPrice,
      addressInfo: address,
      orderStatus: 1,
      goodsList
    }
    user.orderList.push(order)
    await user.save()
    ctx.body = successResponse({
      orderId,
      orderTotalPrice
    })
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 获取订单详情
router.get('/orderDetail', async ctx => {
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
