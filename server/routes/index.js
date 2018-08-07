const Router = require('koa-router')

const goodsRouter = require('./goods')
const userRouter = require('./user')
const shipRouter = require('./ship')

const router = new Router()

router.use(goodsRouter.routes()).use(goodsRouter.allowedMethods())
router.use(userRouter.routes()).use(userRouter.allowedMethods())
router.use(shipRouter.routes()).use(shipRouter.allowedMethods())

module.exports = router
