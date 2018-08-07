const User = require('./models/user')
const Goods = require('./models/goods')
const Ship = require('./models/ship')
require('./index')

const goodsData = require('../data/goods')
const userData = require('../data/users')
const shipData = require('../data/ship')

Goods.insertMany(goodsData, err => {
  if (err) throw err
  console.log('goods数据导入成功')
})

User.insertMany(userData, err => {
  if (err) throw err
  console.log('user数据导入成功')
})

Ship.insertMany(shipData, err => {
  if (err) throw err
  console.log('ship数据导入成功')
})
