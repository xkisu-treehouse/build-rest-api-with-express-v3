const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  postedOn: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String
})

module.exports = mongoose.model('Review', schema)