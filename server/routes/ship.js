const Router = require('koa-router')

const Ship = require('../db/models/ship')
const {successResponse, failResponse} = require('../utils')

const router = new Router({
  prefix: '/ship'
})

router.get('/list', async ctx => {
  try {
    const shipList = await Ship.find()
    ctx.body = successResponse(shipList)
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

router.post('/checked', async ctx => {
  try {
    const _id = ctx.request.body.shipId
    await Ship.updateMany({}, {$set: {isChecked: false}})
    await Ship.updateOne({_id}, {$set: {isChecked: true}})
    const shipList = await Ship.find()
    ctx.body = successResponse(shipList)
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

module.exports = router
