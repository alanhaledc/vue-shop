const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const historyApiFallback = require('koa2-history-api-fallback')
const logger = require('koa-logger')
const serve = require('koa-static')
const path = require('path')
const { failureResponse } = require('./utils')

const isProd = process.env.NODE_ENV === 'production'

const router = require('./routes')
require('./database/index')

const app = new Koa()

app.use(historyApiFallback({}))
app.use(logger())
app.use(bodyParser())
app.use(
  serve(path.join(__dirname, './static'), {
    maxAge: 1000 * 60 * 60 * 24 * 7
  })
)

app.use(async (ctx, next) => {
  try {
    if (ctx.cookies.get('userId')) {
      await next()
    } else {
      if (
        ctx.url === '/user/login' ||
        ctx.url === '/user/logout' ||
        ctx.url === '/user/register' ||
        ctx.url.indexOf('/goods/list') > -1
      ) {
        await next()
      } else {
        failureResponse(ctx, 401, '当前未登录')
      }
    }
  } catch (err) {
    isProd
      ? failureResponse(ctx, 500, '服务器内部错误')
      : failureResponse(ctx, 500, err.message)
  }
})

app.use(router.routes()).use(router.allowedMethods())

const PORT = process.env.PORT || 9096

app.listen(PORT, err => {
  if (err) {
    console.log(err)
    return
  }
  console.log(`Server running at http://127.0.0.1:${PORT}!`)
})
