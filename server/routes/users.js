const express = require('express')
const router = express.Router()

const Users = require('../models/users')
const farmetDate = require('../utils/util')
router.get('/', (req, res, next) => {
  res.send('respond with a resource')
})

// 登录账户
router.post('/login', (req, res, next) => {
  let params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }

  Users.findOne(params, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7
        })
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7
        })
        // req.session.user = doc
        res.json({
          status: 0,
          msg: '',
          results: {
            userName: doc.userName
          }
        })
      }
    }
  })
})

// 登出账户
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  // res.clearCookie('userId')
  res.json({
    status: 0,
    msg: '',
    results: ''
  })
})

// 检查登录状态
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: 0,
      msg: '',
      results: req.cookies.userName || ''
    })
  } else {
    res.json({
      status: 1,
      msg: '当前未登录',
      results: ''
    })
  }
})

// 获取购物车列表
router.get('/cart', (req, res, next) => {
  let userId = req.cookies.userId
  Users.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        results: ''
      })
    } else {
      if (doc) {
        res.json({
          status: 0,
          msg: '',
          results: doc.cartList
        })
      }
    }
  })
})

// 获取购物车商品数量
router.get('/cartCount', (req, res, next) => {
  const uertId = req.cookies.userId
  Users.findOne({userId: uertId}, (err, usersDoc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        results: ''
      })
    } else {
      if (usersDoc.cartList.length) {
        let cartCount = 0
        usersDoc.cartList.forEach(item => {
          cartCount += parseInt(item.productNum)
        })
        res.json({
          status: 0,
          msg: '',
          results: cartCount
        })
      } else {
        res.json({
          status: 0,
          msg: '',
          results: 0
        })
      }
    }
  })
})

// 删除购物车商品
router.post('/cart/del', (req, res, next) => {
  const userId = req.cookies.userId
  const productId = req.body.productId

  Users.update({userId: userId}, {
    $pull: {
      cartList: {productId: productId}
    }
  }, (err) => {
    if (err) {
      res.json({
        status: 1,
        msg: '',
        results: ''
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        results: 'success'
      })
    }
  })
})

// 编辑购物车商品
router.post('/cart/edit', (req, res, next) => {
  const uertId = req.cookies.userId
  const productId = req.body.productId
  const productNum = req.body.productNum
  const checked = req.body.checked

  Users.update({userId: uertId, 'cartList.productId': productId}, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err) => {
    if (err) {
      res.json({
        status: 1,
        msg: '',
        results: ''
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        results: 'success'
      })
    }
  })
})

// 检查是否全选
router.post('/cart/checkedALL', (req, res, next) => {
  const userId = req.cookies.userId
  const checkedAllFlag = req.body.checkedAllFlag
  Users.findOne({userId: userId}, (err, usersDoc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        results: ''
      })
    } else {
      if (usersDoc) {
        usersDoc.cartList.forEach(item => {
          item.checked = checkedAllFlag
        })
        usersDoc.save(err1 => {
          if (err1) {
            res.json({
              status: 1,
              msg: err.message,
              results: ''
            })
          } else {
            res.json({
              status: 0,
              msg: '',
              results: 'success'
            })
          }
        })
      }
    }
  })
})

// 获取地址列表
router.get('/address', (req, res, next) => {
  const userId = req.cookies.userId
  Users.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        message: err.message,
        results: ''
      })
    } else {
      res.json({
        status: 0,
        message: '',
        results: doc.addressList
      })
    }
  })
})

// 删除地址
router.post('/address/del', (req, res, next) => {
  const userId = req.cookies.userId
  const addressId = req.body.addressId

  Users.update({userId: userId}, {
    $pull: {
      addressList: {_id: addressId}
    }
  }, (err) => {
    if (err) {
      res.json({
        status: 1,
        msg: '',
        results: ''
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        results: 'success'
      })
    }
  })
})

// 新增地址
router.post('/address/add', (req, res, next) => {
  let userId = req.cookies.userId
  let newAddress = req.body.newAddress
  Users.findOne({userId: userId}, (err, usersDoc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        results: ''
      })
    } else {
      if (usersDoc) {
        usersDoc.addressList.push({
          ...newAddress,
          isDefault: false
        })
        usersDoc.save(err => {
          if (err) {
            res.json({
              status: 1,
              msg: err.message,
              results: ''
            })
          } else {
            res.json({
              status: 0,
              msg: '',
              results: 'success'
            })
          }
        })
      }
    }
  })
})

// 设置默认地址
router.post('/address/setDefault', (req, res, next) => {
  const userId = req.cookies.userId
  const id = req.body.id

  Users.findOne({userId: userId}, (err, usersDoc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        results: ''
      })
    } else {
      if (usersDoc) {
        usersDoc.addressList.forEach(item => {
          if (item._id.toString() === id) {
            item.isDefault = true
          } else {
            item.isDefault = false
          }
        })
        usersDoc.save(err1 => {
          if (err1) {
            res.json({
              status: 1,
              msg: err.message,
              results: ''
            })
          } else {
            res.json({
              status: 0,
              msg: '',
              results: 'success'
            })
          }
        })
      }
    }
  })
})

// 生成订单
router.post('/payment', (req, res, next) => {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  let orderTotalPrice = req.body.orderTotalPrice

  Users.findOne({userId: userId}, (err, usersDoc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        results: ''
      })
    } else {
      let address = ''
      usersDoc.addressList.forEach(item => {
        if (item._id.toString() === addressId) {
          address = item
        }
      })
      const goodList = usersDoc.cartList.filter(item => {
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
      usersDoc.orderList.push(order)
      usersDoc.save(err1 => {
        if (err1) {
          res.json({
            status: 1,
            msg: err.message,
            results: ''
          })
        } else {
          res.json({
            status: 0,
            msg: '',
            results: {
              orderId,
              orderTotalPrice
            }
          })
        }
      })
    }
  })
})

// 获取订单详情
router.get('/orderDetail', (req, res, next) => {
  const userId = req.cookies.userId
  const orderId = req.param('orderId')
  console.log(orderId)

  Users.findOne({userId: userId}, (err, usersDoc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        results: ''
      })
    } else {
      if (usersDoc.orderList.length) {
        const OrderIndex = usersDoc.orderList.findIndex(item => {
          return item.orderId === orderId
        })
        if (OrderIndex > -1) {
          res.json({
            status: 0,
            msg: '',
            results: usersDoc.orderList[OrderIndex]
          })
        } else {
          res.json({
            status: 1,
            msg: '无此订单',
            results: ''
          })
        }
      } else {
        res.json({
          status: 1,
          msg: '当前用户未创建订单',
          results: ''
        })
      }
    }
  })
})

module.exports = router
