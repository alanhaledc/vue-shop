const router = require('koa-router')()
const Users = require('../models/users')
const farmetDate = require('../utils/util')

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

// 用户登录
router.post('/login', async ctx => {
  try {
    let params = {
      userName: ctx.request.body.userName,
      userPwd: ctx.request.body.userPwd
    }
    let userDoc = await Users.findOne(params)
    ctx.cookies.set('userId', userDoc.userId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7
    })
    ctx.cookies.set('userName', userDoc.userName, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7
    })
    ctx.body = {
      status: 0,
      msg: '',
      results: {
        userName: userDoc.userName
      }
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

// 用户登出
router.post('/logout', ctx => {
  ctx.cookies.set('userId', '', {
    path: '/',
    maxAge: -1
  })
  ctx.body = {
    status: 0,
    msg: '',
    results: ''
  }
})

// 检查登录状态
router.get('/checkLogin', ctx => {
  if (ctx.cookies.get('userId')) {
    ctx.body = {
      status: 0,
      msg: '',
      results: ctx.cookies.get('userName') || ''
    }
  } else {
    ctx.body = {
      status: 1,
      msg: '当前未登录'
    }
  }
})

// 获取购物车列表
router.get('/cart', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    let userDoc = await Users.findOne({userId})
    ctx.body = {
      status: 0,
      msg: '',
      results: userDoc.cartList
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: '当前未登录'
    }
  }
})

// 获取购物车商品数量
router.get('/cartCount', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    let userDoc = await Users.findOne({userId})
    let cartCount = 0
    if (userDoc.cartList.length) {
      userDoc.cartList.forEach(item => {
        cartCount += parseInt(item.productNum)
      })
    }
    ctx.body = {
      status: 0,
      msg: '',
      results: cartCount
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

// 删除购物车商品
router.post('/cart/del', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const productId = ctx.request.body.productId
    await Users.update({userId}, {
      $pull: {
        cartList: {productId}
      }
    })
    ctx.body = {
      status: 0,
      msg: '',
      results: 'success'
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

// 编辑购物车商品
router.post('/cart/edit', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const productId = ctx.request.body.productId
    const productNum = ctx.request.body.productNum
    const checked = ctx.request.body.checked
    await Users.update({userId, 'cartList.productId': productId}, {
      'cartList.$.productNum': productNum,
      'cartList.$.checked': checked
    })
    ctx.body = {
      status: 0,
      msg: '',
      results: 'success'
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

// 检查是否全选
router.post('/cart/checkedAll', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const checkedAllFlag = ctx.request.body.checkedAllFlag
    let userDoc = await Users.findOne({userId})
    if (userDoc.cartList.length) {
      userDoc.cartList.forEach(item => {
        item.checked = checkedAllFlag
      })
      await userDoc.save()
      ctx.body = {
        status: 0,
        msg: '',
        results: 'success'
      }
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

// 获取地址列表
router.get('/address', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    let userDoc = await Users.findOne({userId})
    ctx.body = {
      status: 0,
      msg: '',
      results: userDoc.addressList
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

// 删除地址
router.post('/address/del', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const addressId = ctx.request.body.addressId
    await Users.update({userId}, {
      $pull: {
        addressList: {_id: addressId}
      }
    })
    ctx.body = {
      status: 0,
      msg: '',
      results: 'success'
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

// 新增地址
router.post('/address/add', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const newAddress = ctx.request.body.newAddress
    let userDoc = await Users.findOne({userId})
    userDoc.addressList.push({
      ...newAddress,
      isDefault: false
    })
    await userDoc.save()
    ctx.body = {
      status: 0,
      msg: '',
      results: 'success'
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message()
    }
  }
})

// 设置默认地址
router.post('/address/setDefault', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const id = ctx.request.body.id
    let userDoc = await Users.findOne({userId})
    userDoc.addressList.forEach(item => {
      if (item._id.toString() === id) {
        item.isDefault = true
      } else {
        item.isDefault = false
      }
    })
    await userDoc.save()
    ctx.body = {
      status: 0,
      msg: '',
      results: 'success'
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

// 生成订单
router.post('/payment', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const addressId = ctx.request.body.addressId
    const orderTotalPrice = ctx.request.body.orderTotalPrice
    let userDoc = await Users.findOne({userId})
    let address = ''
    userDoc.addressList.forEach(item => {
      if (item._id.toString() === addressId) {
        address = item
      }
    })
    const goodList = userDoc.cartList.filter(item => {
      return item.checked === true
    })

    const platform = '666'
    const r1 = Math.floor(Math.random() * 10)
    const r2 = Math.floor(Math.random() * 10)
    const sysDate = farmetDate(new Date(), 'yyyyMMddhhmmss')
    const createDate = farmetDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
    const orderId = platform + r1 + sysDate + r2
    const order = {
      orderId,
      orderTotalPrice,
      addressInfo: address,
      orderStatus: 1,
      goodList,
      createDate
    }
    userDoc.orderList.push(order)
    await userDoc.save()
    ctx.body = {
      status: 0,
      msg: '',
      results: {
        orderId,
        orderTotalPrice
      }
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message()
    }
  }
})

// 获得订单详情
router.get('/orderDetail', async ctx => {
  try {
    const userId = ctx.cookies.get('userId')
    const orderId = ctx.query.orderId
    let userDoc = await Users.findOne({userId})
    if (userDoc.orderList.length) {
      const OrderIndex = userDoc.orderList.findIndex(item => {
        return item.orderId === orderId
      })
      if (OrderIndex > -1) {
        ctx.body = {
          status: 0,
          msg: '',
          results: userDoc.orderList[OrderIndex]
        }
      } else {
        ctx.body = {
          status: 1,
          msg: '无此订单',
          results: ''
        }
      }
    } else {
      ctx.body = {
        status: 1,
        msg: '当前用户未创建订单'
      }
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})
module.exports = router
