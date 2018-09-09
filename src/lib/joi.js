const Joi = require('joi')

module.exports = {
  middleware: function (schema) {
    return function (req, res, next) {
      const result = Joi.validate(req.body, schema, {
        abortEarly: false,
        stripUnknown: true
      })

      if (!result.error) {
        req.body = result.value
        next()
      } else {
        const errors = result.error.details.map(error => {
          return {
            message: error.message,
            key: error.context.key
          }
        })

        return res.status(400).json({
          error: true,
          errors: errors
        })
      }
    }
  }
}