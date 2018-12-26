const mongoose = require('mongoose')
const Goods = require('./models/goods')

const DB_URL = 'mongodb://127.0.0.1:27017/shop'

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDb server connected successfully!')
  })
  .catch(err => {
    console.log(err)
  })

const initDatabase = async () => {
  try {
    const goods = await Goods.find()
    if (goods.length === 0) {
      require('./init')
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  mongoose,
  initDatabase: initDatabase()
}
