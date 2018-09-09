const auth = require('basic-auth')
const User = require('../models/User')

module.exports = async function (req, res, next) {
  const credentials = auth(req)

  if (!credentials) {
    res.status(401)
    res.set('WWW-Authenticate', 'Basic realm="Treehouse"')
    return res.end('Access denied')
  }

  const user = await User.findOne({
    emailAddress: credentials.name
  }).exec()

  if (!user) {
    res.status(401)
    res.set('WWW-Authenticate', 'Basic realm="Treehouse"')
    return res.end('Access denied')
  }

  const passwordMatch = await user.comparePassword(credentials.pass)

  if(!passwordMatch) {
    res.status(401)
    res.set('WWW-Authenticate', 'Basic realm="Treehouse"')
    return res.end('Access denied')
  }

  req.user = user
  next()
}