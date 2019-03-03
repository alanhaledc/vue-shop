const Router = require('koa-router')

const Goods = require('../database/models/goods')
const User = require('../database/models/user')
const { successResponse } = require('../utils')

const router = new Router({
  prefix: '/goods'
})

// 获取商品列表
router.get('/list', async ctx => {
  const { page, pageSize, sort, priceLevel } = ctx.query
  const skip = (page - 1) * pageSize

  let params = {}
  let priceGt = ''
  let priceLte = ''

  if (priceLevel) {
    switch (priceLevel) {
      case '0':
        priceGt = '0'
        priceLte = '100000000'
        break
      case '1':
        priceGt = '0'
        priceLte = '100'
        break
      case '2':
        priceGt = '100'
        priceLte = '500'
        break
      case '3':
        priceGt = '500'
        priceLte = '1000'
        break
      case '4':
        priceGt = '1000'
        priceLte = '5000'
        break
    }

    params = {
      salePrice: {
        // 大于 >
        $gt: priceGt,
        // 小于和等于 <=
        $lte: priceLte
      }
    }
  }

  const goods = await Goods.find(params)
    .skip(skip)
    .limit(parseInt(pageSize))
    .sort({ salePrice: sort })

  successResponse(ctx, {
    count: goods.length,
    list: goods
  })
})

// 加入购物车
router.post('/cart/add', async ctx => {
  const _id = ctx.cookies.get('userId')
  const { productId } = ctx.request.body

  const user = await User.findOne({ _id })
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
    successResponse(ctx, 'success')
  } else {
    const newGoods = await Goods.findOne({ productId })
    const goodsNum = 1
    const isChecked = true
    user.cartList.push({
      goods: newGoods,
      goodsNum,
      isChecked
    })
    await user.save()
    successResponse(ctx, 'success')
  }
})

module.exports = router
