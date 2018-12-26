const Router = require('koa-router')

const Ship = require('../database/models/ship')
const { successResponse, failureResponse } = require('../utils')

const router = new Router({
  prefix: '/ship'
})

router.get('/list', async ctx => {
  try {
    const shipList = await Ship.find()
    successResponse(ctx, shipList)
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

router.post('/checked', async ctx => {
  try {
    const { shipId: _id } = ctx.request.body
    await Ship.updateMany({}, { $set: { isChecked: false } })
    await Ship.updateOne({ _id }, { $set: { isChecked: true } })
    const shipList = await Ship.find()
    successResponse(ctx, shipList)
  } catch (err) {
    failureResponse(ctx, 500, err.message)
  }
})

module.exports = router
