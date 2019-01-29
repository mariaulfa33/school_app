const Model = require('../models')
const express = require('express')
const getSubject = require('../helpers/getSubject')
const router = express.Router()


router.get('/', function(req, res) {
  let order = req.query.name || 'asc'
  let msg = req.query.msg || null
  let teachers = []
  Model.Teacher.findAll({
    order : [['first_name', `${order.toUpperCase()}`]]
  })
  .then(data => {
    let promise = []
    teachers = data
    data.forEach( teacher => {
      promise.push(teacher.getSubject())
    })
    return Promise.all(promise)
  })
  .then(subject => {
    let column = ['ID', 'First Name', 'Last Name', 'Email', 'Subject', 'Option']
    if(order == 'asc') {
      order = 'desc'
    } else if(order == 'desc') {
      order = 'asc'
    }
    res.render('teacher-list', {data : teachers, msg, name:'teachers', column, subject, getSubject, order})
  })
  .catch(err => {
    res.redirect(`/?msg=${err}`)
  })
})

router.get('/add', function(req,res) {
  let teacher = {
    first_name : '',
    last_name : '',
    email : ''
  }
  Model.Subject.findAll()
  .then(subjects => {
    res.render('teacher', {teacher, action:'add', post:'add', subjects})
  })
  .catch(err => {
    res.redirect('/teachers?msg='+err)
  })
})

router.post('/add', function(req, res) {
  Model.Teacher.create({
    first_name: req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email
  })
  .then(() => { 
    res.redirect('/teachers')
  })
  .catch(err => {
    res.redirect(`/teachers/?msg=${err}`)
  })
})

router.get('/edit/:id', function(req, res) {
  let teacher = null
  Model.Teacher.findByPk(req.params.id)
  .then(data => {
    teacher = data
    return Model.Subject.findAll()
  })
  .then(subjects => {
    res.render('teacher', {teacher, post:`edit/${req.params.id}`, action: 'edit', subjects})
  })
  .catch(err => {
    res.redirect(`/teachers/?msg=${err}`)
  })
})

router.post('/edit/:id', function(req, res) {
  Model.Teacher.update({
    id : Number(req.params.id),
    first_name: req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email,
    SubjectId : req.body.subject
  }, {where : {
    id : Number(req.params.id)
    }
  })
  .then(() => {
    res.redirect('/teachers')
  })
  .catch((err) => {
    res.redirect(`/teachers?msg=${err.message}`)
  })
})

router.get('/delete/:id', function(req, res) {
  Model.Teacher.destroy({
    where : { id : Number(req.params.id)}
  })
  .then(() => {
    res.redirect('/teachers')
  })
  .catch(err => {
    res.redirect(`/teachers?msg=${err}`)
  })
})

router.get('/sort', function(req, res) {
  if(req.query.name == 'asc') {
    res.redirect('/teachers?name=asc')
  } else if(req.query.name == 'desc') {
    res.redirect('/teachers?name=desc')
  }
})


module.exports = router