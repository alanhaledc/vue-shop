const express = require('express')
const mongoose = require('mongoose')

const Goods = require('../models/goods')
const Users = require('../models/users')

const router = express.Router()

mongoose.connect('mongodb://127.0.0.1:27017/vue-shop')

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected success.')
})

mongoose.connection.on('error', () => {
  console.log('MongoDB connected fail.')
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connected disconnected.')
})

// 查找商品列表
router.get('/list', (req, res, next) => {
  const page = parseInt(req.param('page'))
  const pageSize = parseInt(req.param('pageSize'))
  const sort = parseInt(req.param('sort'))
  const priceLevel = req.param('priceLevel')
  const skip = (page - 1) * pageSize
  let params = {}

  let priceGt = ''
  let priceLte = ''

  if (priceLevel !== 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0
        priceLte = 100
        break
      case '1':
        priceGt = 100
        priceLte = 500
        break
      case '2':
        priceGt = 500
        priceLte = 1000
        break
      case '3':
        priceGt = 1000
        priceLte = 5000
        break
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }

  const goodsModel = Goods.find(params).skip(skip).limit(pageSize)

  goodsModel.sort({salePrice: sort})
  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        results: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

// 加入购物车
router.post('/addCart', (req, res, next) => {
  const userId = '100000077'
  const productId = req.body.productId
  Users.findOne({userId: userId}, (err, usersDoc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      if (usersDoc) {
        let goodsItem = ''
        usersDoc.cartList.forEach(item => {
          if (item.productId === productId) {
            goodsItem = item
            item.productNum++
          }
        })
        if (goodsItem) {
          usersDoc.save((err2) => {
            if (err2) {
              res.json({
                status: 1,
                msg: err2.message
              })
            } else {
              res.json({
                status: 0,
                msg: '',
                results: 'success'
              })
            }
          })
        } else {
          Goods.findOne({productId: productId}, (err1, doc1) => {
            if (err) {
              res.json({
                status: 1,
                msg: err1.message
              })
            } else {
              if (doc1) {
                doc1.productNum = 1
                doc1.checked = 1
                usersDoc.cartList.push(doc1)
                usersDoc.save(function(err2) {
                  if (err2) {
                    res.json({
                      status: 1,
                      msg: err2.message
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
        }
      }
    }
  })
})

module.exports = router
