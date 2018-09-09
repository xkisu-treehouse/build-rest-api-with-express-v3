const router = require('express').Router()

const authenticated = require('../lib/authenticated')

const Course = require('../models/Course')
const Review = require('../models/Review')

// List all courses
router.get('/courses', (req, res) => {
  Course.find({}, '_id title').exec().then(courses => {
    res.status(200).json(courses)
  })
})

// Get details for a specific course
router.get('/courses/:courseid', (req, res) => {
  Course.findById(req.params.courseid).populate('user reviews').exec().then(course => {
    res.status(200).json(course)  
  })
})

// Creates a new course
router.post('/courses', authenticated, (req, res, next) => {
  const course = new Course(req.body)
  course.save(err => {
    if (err) {
      err.status = 400
      return next(err)
    }

    res.status(201)
    res.set('Location', '/api/course/' + course.id)
    res.end()
  })
})

// Updates a course
router.put('/courses/:courseid', authenticated, (req, res, next) => {
  Course.findById(req.params.courseid, (err, course) => {
    err.status = 400
    if(err) return next(err)

    if(!course) return res.status(404).end()

    Course.update({
      id: req.params.courseid
    }, {
      $set: req.body
    }, {}, function(err){
      if(err) return next(err)

      res.status(204).end()
    })
  })
})

// create a new review on a course
router.post('/courses/:courseid/reviews', authenticated, (req, res, next) => {
  const review = new Review(req.body)
  review.save(err => {
    err.status = 400
    if(err) next(err)

    res.status(201)
    res.set('Location', '/api/course/' + review.id)
    res.end()
  })
})

module.exports = router
