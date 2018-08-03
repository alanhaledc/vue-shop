const Koa = require('Koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const serve = require('koa-static')
const path = require('path')

const router = require('./routes')
require('./db/index')

const app = new Koa()

app.use(logger())
app.use(bodyParser())
app.use(serve(path.join(__dirname, './static')))

app.use(router.routes()).use(router.allowedMethods())

const PORT = process.env.PORT || 9096

app.listen(PORT, err => {
  if (err) {
    console.log(err)
    return
  }
  console.log(`Server started at port: ${PORT}!`)
})
