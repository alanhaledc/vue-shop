const Router = require('koa-router')

const User = require('../database/models/user')
require('../database/models/goods')
const Ship = require('../database/models/ship')

const { successResponse, failureResponse, createOrderId, md5Pwd } = require('../utils')

const router = new Router({
  prefix: '/user'
})

// 用户登录
router.post('/login', async ctx => {
  try {
    const { username, password } = ctx.request.body
    const user = await User.findOne({
      username
    })
    if (!user) {
      failureResponse(ctx, 200, '用户不存在')
    } else {
      const match = await User.findOne({
        username,
        password: md5Pwd(password)
      })
      if (match) {
        ctx.cookies.set('userId', user._id, {
          path: '/',
          maxAge: 86400000,
          httpOnly: false
        })
        successResponse(ctx, {
          username
        })
      } else {
        failureResponse(ctx, 200, '用户名或者密码不正确！')
      }
    }
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

// 用户注册
router.post('/register', async ctx => {
  try {
    const { username, password } = ctx.request.body
    const exist = await User.findOne({ username })
    if (exist) {
      failureResponse(ctx, 200, '用户名重复,请重新输入或者去登录！')
      return
    }
    const newUser = new User({ username, password: md5Pwd(password) })
    const user = await newUser.save()
    const { _id } = user
    ctx.cookies.set('userId', _id, {
      path: '/',
      maxAge: 86400000,
      httpOnly: false
    })
    successResponse(ctx, {
      username
    })
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

// 用户登出
router.post('/logout', async ctx => {
  ctx.cookies.set('userId', '', {
    path: '/',
    maxAge: -1
  })
  successResponse(ctx, '注销成功')
})

// 获取用户购物车数据
router.get('/cart', async ctx => {
  try {
    const _id = ctx.cookies.get('userId')
    const user = await User.findOne({ _id })
    const { cartList } = user
    successResponse(ctx, cartList)
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

// 获取购物车物品总数量
router.get('/cartCount', async ctx => {
  try {
    const _id = ctx.cookies.get('userId')
    const user = await User.findOne({ _id }).populate('cartList.goods')
    let count = 0
    if (user.cartList.length) {
      user.cartList.forEach(item => {
        if (item.isChecked) {
          count += item.goodsNum
        }
      })
    }
    successResponse(ctx, count)
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

// 删除购物车物品
router.post('/cart/del', async ctx => {
  try {
    const _id = ctx.cookies.get('userId')
    const { productId } = ctx.request.body
    const user = await User.findOne({ _id })
    const idx = user.cartList.findIndex(item => item.goods.productId === productId)
    user.cartList.splice(idx, 1)
    await user.save()
    successResponse(ctx, user.cartList)
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

// 编辑购物车物品数量和选中
router.post('/cart/edit', async ctx => {
  try {
    const _id = ctx.cookies.get('userId')
    const { productId, goodsNum, isChecked } = ctx.request.body
    const user = await User.findOne({ _id }).populate('cartList.goods')
    const idx = user.cartList.findIndex(item => item.goods.productId === productId)
    if (goodsNum) {
      user.cartList[idx].goodsNum = goodsNum
    }
    if (isChecked !== undefined) {
      user.cartList[idx].isChecked = isChecked
    }
    await user.save()
    successResponse(ctx, user.cartList)
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

// 检查是否全选
router.post('/cart/checkedAll', async ctx => {
  try {
    const _id = ctx.cookies.get('userId')
    const { isCheckedAll } = ctx.request.body
    const user = await User.findOne({ _id }).populate('cartList.goods')
    if (user.cartList.length) {
      user.cartList.forEach(item => {
        item.isChecked = isCheckedAll
      })
      await user.save()
      successResponse(ctx, user.cartList)
    }
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

// 获取地址列表
router.get('/address', async ctx => {
  try {
    const _id = ctx.cookies.get('userId')
    const user = await User.findOne({ _id })
    successResponse(ctx, user.addressList)
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

// 删除地址
router.post('/address/del', async ctx => {
  try {
    const _id = ctx.cookies.get('userId')
    const { addressId } = ctx.request.body
    const user = await User.findOne({ _id })
    const idx = user.addressList.findIndex(item => {
      return item._id.toString() === addressId
    })
    user.addressList.splice(idx, 1)
    await user.save()
    successResponse(ctx, user.addressList)
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

// 修改地址
router.post('/address/edit', async ctx => {
  try {
    const _id = ctx.cookies.get('userId')
    const { newData } = ctx.request.body
    newData.meta.updateAt = Date.now()
    const user = await User.findOne({ _id })
    const idx = user.addressList.findIndex(item => item._id.toString() === newData._id)
    user.addressList.splice(idx, 1, newData)
    await user.save()
    successResponse(ctx, user.addressList)
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

// 添加地址
router.post('/address/add', async ctx => {
  try {
    const _id = ctx.cookies.get('userId')
    const { newAddress } = ctx.request.body
    const user = await User.findOne({ _id })
    user.addressList.push(newAddress)
    await user.save()
    successResponse(ctx, user.addressList)
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

// 设置默认地址
router.post('/address/setDefault', async ctx => {
  try {
    const _id = ctx.cookies.get('userId')
    const { addressId } = ctx.request.body
    const user = await User.findOne({ _id })
    user.addressList.forEach(item => {
      item.isDefault = item._id.toString() === addressId
    })
    await user.save()
    successResponse(ctx, user.addressList)
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

// 选中地址
router.post('/address/checked', async ctx => {
  try {
    const _id = ctx.cookies.get('userId')
    const { addressId } = ctx.request.body
    const user = await User.findOne({ _id })
    user.addressList.forEach(item => {
      item.isChecked = item._id.toString() === addressId
    })
    await user.save()
    successResponse(ctx, user.addressList)
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

// 获取订单详情
router.get('/orderDetail', async ctx => {
  try {
    const _id = ctx.cookies.get('userId')
    const user = await User.findOne({ _id }).populate('cartList.goods')
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
    // 加上快递费
    orderTotalPrice += parseInt(ship.cost)
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
    user.cartList = []
    await user.save()
    successResponse(ctx, order)
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

module.exports = router
