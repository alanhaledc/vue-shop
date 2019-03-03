const Router = require('koa-router')

const Ship = require('../database/models/ship')
const { successResponse } = require('../utils')

const router = new Router({
  prefix: '/ship'
})

router.get('/list', async ctx => {
  const shipList = await Ship.find()
  successResponse(ctx, shipList)
})

router.post('/checked', async ctx => {
  const { shipId: _id } = ctx.request.body
  await Ship.updateMany({}, { $set: { isChecked: false } })
  await Ship.updateOne({ _id }, { $set: { isChecked: true } })
  const shipList = await Ship.find()
  successResponse(ctx, shipList)
})

module.exports = router
