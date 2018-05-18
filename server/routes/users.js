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
module.exports = router
