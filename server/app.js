const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const serve = require('koa-static')
const path = require('path')
const {failResponse} = require('./utils')

const router = require('./routes')
require('./db/index')

const app = new Koa()

app.use(logger())
app.use(bodyParser())
app.use(serve(path.join(__dirname, './static')))

app.use(async (ctx, next) => {
  try {
    if (ctx.cookies.get('userId')) {
      await next()
    } else {
      if (ctx.url === '/user/login' || ctx.url === '/user/logout' ||
        ctx.url === '/user/register' || ctx.url.indexOf('/goods/list') > -1) {
        await next()
      } else {
        ctx.body = failResponse('当前未登录')
      }
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = failResponse(err.message)
  }
})

app.use(router.routes()).use(router.allowedMethods())

const PORT = process.env.PORT || 9096

app.listen(PORT, err => {
  if (err) {
    console.log(err)
    return
  }
  console.log(`Server started at port: ${PORT}!`)
})
