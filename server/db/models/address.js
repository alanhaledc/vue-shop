const mongoose = require('mongoose')

const Schema = mongoose.Schema

const addressSchema = new Schema({
  userName: String,
  streetName: String,
  postCode: String,
  tel: String,
  isDefault: {
    type: Boolean,
    default: false
  },
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

addressSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})

module.exports = mongoose.model('Address', addressSchema)
