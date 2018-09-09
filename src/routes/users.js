const router = require('express').Router()

const Joi = require('joi')
const User = require('../models/User')

const authenticated = require('../lib/authenticated')

const {
  middleware: joiMiddleware
} = require('../lib/joi')

const userSchema = Joi.object().keys({
  fullName: Joi.string().required(),
  emailAddress: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
})

router.get('/users', authenticated, (req, res) => {
  res.status(200).json(req.user)
})

router.post('/users', joiMiddleware(userSchema), async (req, res, next) => {
  console.log(req.body)
  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
      error: true,
      message: 'Password confirmation does not match password!'
    })
  }

  const existingUser = await User.findOne({
    emailAddress: req.body.emailAddress
  }).exec()

  if (existingUser) {
    return res.status(409).json({
      error: true,
      message: 'User with email address already exists'
    })
  }

  // remove the confirmation since we don't want it saved to the database
  delete req.body.confirmPassword
  const user = new User(req.body)

  user.save(err => {
    if (err) return next(err)

    res.set('Location', '/')
    res.status(201)
    res.end()
  })
})

module.exports = router