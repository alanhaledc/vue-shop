const utility = require('utility')
const { format } = require('date-fns')

const successResponse = (ctx, data) => {
  ctx.body = {
    success: true,
    data
  }
}

const failureResponse = (ctx, status, msg) => {
  ctx.status = status
  ctx.body = {
    success: false,
    msg
  }
}

const md5Pwd = pwd => {
  const salt = 'hale_vue_koa_mongoose_#$%^&*!@'
  return utility.md5(utility.md5(pwd + salt))
}

const createOrderId = () => {
  const platform = '666'
  const r1 = Math.floor(Math.random() * 10)
  const r2 = Math.floor(Math.random() * 10)
  const sysDate = format(new Date(), 'YYYYMMDDHHmmss')
  return platform + r1 + sysDate + r2
}

module.exports = {
  successResponse,
  failureResponse,
  md5Pwd,
  createOrderId
}
