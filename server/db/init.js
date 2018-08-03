const User = require('./models/user')
const Address = require('./models/address')
const Goods = require('./models/goods')
require('./index')

const goodsData = require('../data/goods')
const addressData = require('../data/address')
const userData = require('../data/users')

Goods.insertMany(goodsData, err => {
  if (err) throw err
  console.log('goods数据导入成功')
})

Address.insertMany(addressData, err => {
  if (err) throw err
  console.log('address数据导入成功')
})

User.insertMany(userData, err => {
  if (err) throw err
  console.log('user数据导入成功')
})
