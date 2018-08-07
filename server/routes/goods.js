const Router = require('koa-router')

const Goods = require('../db/models/goods')
const User = require('../db/models/user')
const {successResponse, failResponse} = require('../utils')

const router = new Router({
  prefix: '/goods'
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
    let pricrLte = ''

    if (priceLevel) {
      switch (priceLevel) {
        case '0':
          priceGt = 0
          pricrLte = 100000000
          break
        case '1':
          priceGt = 0
          pricrLte = 100
          break
        case '2':
          priceGt = 100
          pricrLte = 500
          break
        case '3':
          priceGt = 500
          pricrLte = 1000
          break
        case '4':
          priceGt = 1000
          pricrLte = 5000
          break
      }

      params = {
        salePrice: {
          // 大于 >
          $gt: priceGt,
          // 小于和等于 <=
          $lte: pricrLte
        }
      }
    }

    const goods = await Goods.find(params).skip(skip).limit(pageSize).sort({salePrice: sort})
    ctx.body = successResponse({
      count: goods.length,
      list: goods
    })
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

// 加入购物车
router.post('/cart/add', async ctx => {
  try {
    const userId = '100000077'
    const productId = ctx.request.body.productId

    const user = await User.findOne({userId}).populate('cartList.goods')
    let goods = ''
    // 查看购物车中是否有这个产品
    user.cartList.forEach(item => {
      if (item.goods.productId === productId) {
        goods = item.goods
        item.goodsNum += 1
      }
    })
    if (goods) {
      await user.save()
      ctx.body = successResponse('success')
    } else {
      const newGoods = await Goods.findOne({productId})
      const goodsNum = 1
      const isChecked = true
      user.cartList.push({
        goods: newGoods,
        goodsNum,
        isChecked
      })
      await user.save()
      ctx.body = successResponse(('success'))
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

module.exports = router
