const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const goods = require('./routes/goods')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'html'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 未登录拦截
app.use(async (ctx, next) => {
  try {
    if (ctx.cookies.get('userId')) {
      await next()
    } else {
      if (ctx.url === '/users/login' || ctx.url === '/users/logout' || ctx.url.indexOf('/goods/list') > -1) {
        await next()
      } else {
        ctx.body = {
          status: 10001,
          msg: '当前未登录',
          results: ''
        }
      }
    }
  } catch (err) {
    ctx.body = {
      status: 1,
      msg: err.message
    }
  }
})

// routes
app.use(index.routes()).use(index.allowedMethods())
app.use(users.routes()).use(users.allowedMethods())
app.use(goods.routes()).use(goods.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
