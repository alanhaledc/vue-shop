const express = require('express')
const router = express.Router()

const Users = require('../models/users')

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
        if (checkedAllFlag) {
          usersDoc.cartList.forEach(item => {
            item.checked = true
          })
          usersDoc.save((err1, doc1) => {
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
    }

  })
})
module.exports = router
