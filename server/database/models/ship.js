const mongoose = require('mongoose')

const Schema = mongoose.Schema

const shipSchema = new Schema({
  ship: String,
  cost: String,
  isChecked: {
    type: Boolean,
    default: false
  }

})

module.exports = mongoose.model('Ship', shipSchema)
