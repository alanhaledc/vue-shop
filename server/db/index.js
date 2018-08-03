const mongoose = require('mongoose')

const DB_URL = 'mongodb://127.0.0.1:27017/shop'

mongoose.connect(DB_URL)

const connection = mongoose.connection

connection.on('connected', () => {
  console.log('MongoDb server connected successfully!')
})

connection.on('error', () => {
  console.log('MongoDB server connected failed.')
})

connection.on('disconnected', () => {
  console.log('MongoDB server is disconnected.')
})

module.exports = connection
