const utility = require('utility')
const moment = require('moment')

const successResponse = data => {
  return {
    success: true,
    result: data
  }
}

const failResponse = msg => {
  return {
    success: false,
    message: msg
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
  const sysDate = moment().format('YYYYMMDDhhmmss')
  return platform + r1 + sysDate + r2
}

module.exports = {
  successResponse,
  failResponse,
  md5Pwd,
  createOrderId
}
