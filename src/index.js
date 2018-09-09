'use strict'

const path = require('path')
const fs = require('fs')

// load modules
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

// set our port
app.set('port', process.env.PORT || 5000)

// morgan gives us http request logging
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

// TODO add additional routes here

// send a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Course Review API'
  })
})

// Use all routes in the routes folder
var normalizedPath = path.join(__dirname, 'routes')
fs.readdirSync(normalizedPath).forEach(function(file) {
  app.use('/api', require('./routes/' + file))
})

// uncomment this route in order to test the global error handler
// app.get('/error', function (req, res) {
//   throw new Error('Test error')
// })

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  })
})

mongoose.connect('mongodb://localhost:27017/course-api', function(error){
  if(error) return console.log(error)

  console.log('connected to mongo')

  const server = app.listen(app.get('port'), () => {
    console.log(`Express server is listening on port ${server.address().port}`)
  })
})
