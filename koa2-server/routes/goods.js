const router = require('koa-router')()
const mongoose = require('mongoose')

router.prefix('/goods')

const Goods = require('../models/goods')
const Users = require('../models/users')

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

// 获取商品列表
router.get('/list', async ctx => {
  try {
    const page = ctx.query.page
    const pageSize = parseInt(ctx.query.pageSize)
    const sort = parseInt(ctx.query.sort)
    const priceLevel = ctx.query.priceLevel
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
    let productsDoc = await Goods.find(params).skip(skip).limit(pageSize).sort({salePrice: sort})
    ctx.body = {
      status: 0,
      msg: '',
      results: {
        count: productsDoc.length,
        list: productsDoc
      }
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

// 加入购物车
router.post('/addCart', async ctx => {
  try {
    const userId = '100000077'
    const productId = ctx.request.body.productId

    let userDoc = await Users.findOne({userId})
    let goodsItem = ''
    userDoc.cartList.forEach(item => {
      if (item.productId === productId) {
        goodsItem = item
        item.productNum += 1
      }
    })
    if (goodsItem) {
      await userDoc.save()
      ctx.body = {
        status: 0,
        msg: '',
        results: 'success'
      }
    } else {
      let productDoc = await Goods.findOne({productId: productId})
      productDoc.productNum += 1
      productDoc.checked = true
      userDoc.cartList.push(productDoc)
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

module.exports = router
