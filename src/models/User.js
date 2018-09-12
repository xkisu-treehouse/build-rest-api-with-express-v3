const mongoose = require('mongoose')
const bcrypt = require ('bcrypt')

const SALT_WORK_FACTOR = 10

const schema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

schema.path('emailAddress').validate(function (value) {
  return /^\S+@\S+\.\S+$/.test(value)
}, 'Email is in invalid format')

schema.methods.comparePassword = function(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return reject(err)
      resolve(isMatch)
    })
  })
}

schema.statics.authenticate = function userAuthenticate (email, password, callback) {
  this.findOne({
    email
  }).exec().then(async user => {
    if (user) {
      const match = await user.comparePassword(password)

      if (match) {
        callback(user)
      } else {
        callback(new Error('User passwords don\'t match'))
      }
    } else {
      callback(new Error('Cannot find user'))
    }
  })
}

schema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err)

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err)

      // override the cleartext password with the hashed one
      user.password = hash
      next()
    })
  })
})



module.exports = mongoose.model('User', schema)