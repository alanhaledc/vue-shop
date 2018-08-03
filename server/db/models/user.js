const mongoose = require('mongoose')

const Schema = mongoose.Schema
const {ObjectId} = Schema.Types

const userSchema = new Schema({
  userId: String,
  username: String,
  password: String,
  orderList: [
    {
      orderId: String,
      orderTotalPrice: Number,
      addressInfo: {
        type: ObjectId,
        ref: 'Address'
      },
      orderStatus: Number,
      goodsList: [
        {
          type: ObjectId,
          ref: 'Goods'
        }
      ],
      createDate: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  cartList: [
    {
      type: ObjectId,
      ref: 'Goods'
    }
  ],
  addressList: [
    {
      type: ObjectId,
      ref: 'Address'
    }
  ],
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

module.exports = mongoose.model('User', userSchema)
