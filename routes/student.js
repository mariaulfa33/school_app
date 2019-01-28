const Model = require('../models')
const express = require('express')
const router = express.Router()


router.get('/', function(req, res) {
  let msg = req.query.msg || null
  Model.Student.findAll({
    order : [['id', 'ASC']]
  })
  .then(data => {
    let column = ['ID', 'First Name', 'Last Name', 'Email','Action','Option']
    res.render('list', {data, msg, name: 'students', column})
  })
  .catch(err => {
    res.redirect(`/?msg=${err}`)
  })
})

router.get('/add', function(req,res) {
  let student = {
    first_name : '',
    last_name : '',
    email : ''
  }
  res.render('student', {student, action:'add', post:'add'})
})

router.post('/add', function(req, res) {
  Model.Student.create({
    first_name: req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email
  })
  .then(() => { 
    res.redirect('/students')
  })
  .catch(err => {
    res.redirect(`/students/?msg=${err}`)
  })
})

router.get('/edit/:id', function(req, res) {
  Model.Student.findByPk(req.params.id)
  .then(student => {
    res.render('student', {student, post:`edit/${req.params.id}`, action: 'edit'})
  })
})

router.post('/edit/:id', function(req, res) {
  Model.Student.update({
    id : Number(req.params.id),
    first_name: req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email
  }, {where : {
    id : Number(req.params.id)
    }
  })
  .then(() => {
    res.redirect('/students')
  })
  .catch((err) => {
    res.redirect(`/students?msg=${err}`)
  })
})

router.get('/:id/add-subject', function(req, res) {
  let data = null
  Model
    .Student
    .findByPk(Number(req.params.id), {
      include : [{model : Model.Subject}]
    })
    .then(student => {
      // res.send(student)
      data = student
      return Model.Subject.findAll()
    })
    .then(subjects => {
      res.render('Subject-Student.ejs', {data, subjects})
    })
    .catch(err => {
      res.redirect(`/students?msg=${err}`)
    })
})

router.post('/:id/add-subject', function(req, res) {
  Model.SubjectStudent.create({
    StudentId : req.params.id,
    SubjectId : req.body.subject
  })
  .then(() => {
    res.redirect('/students')
  })
  .catch(err => {
    res.redirect(`/students?msg=${err}`)
  })
})

router.get('/delete/:id', function(req, res) {
  Model.Student.destroy({
    where : { id : Number(req.params.id)}, individualHooks : true
  })
  .then(() => {
    res.redirect('/students')
  })
  .catch(err => {
    res.redirect(`/students?msg=${err}`)
  })
})


module.exports = router