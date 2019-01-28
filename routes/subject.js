const Model = require('../models')
const express = require('express')
const getScore = require('../helpers/getScore')
const getFullName = require('../helpers/getFullName')
const router = express.Router()


router.get('/', function(req, res) {
  let msg = req.query.msg || null
  Model.Subject.findAll({
    order : [['id', 'ASC']]
  })
  .then(subjects => {
    let newSubjects = subjects.map(subject => {
      return new Promise((resolve, reject) => {
        subject.getTeachers()
        .then(data => {
          subject.dataValues.Teachers = data
          resolve(subject)
        })
        .catch(err => {
          reject(err)
        })
      })
    })
    return Promise.all(newSubjects)
  })
  .then(subjects => {
    let column = ['ID', 'Subject Name','Teacher', 'Action']
    res.render('subject_list', {data : subjects, msg, name:'subjects', column, getFullName})
  })
  .catch(err => {
    res.redirect('/subjects?msg='+err)
  })
})

router.get('/add', function(req,res) {
  let subject = {
    name : ''
  }
  res.render('subject-add', {subject})
})

router.post('/add', function(req, res) {
  Model.Subject.create({
    subject_name : req.body.subject_name
  })
  .then(() => { 
    res.redirect('/subjects')
  })
  .catch(err => {
    res.redirect(`/subjects/?msg=${err}`)
  })
})

router.get('/edit/:id', function(req, res) {
  Model.Subject.findByPk(req.params.id)
  .then(subject => {
    
    res.render('subject', {subject, post:`edit/${req.params.id}`, action: 'edit'})
  })
})

router.post('/edit/:id', function(req, res) {
  Model.Subject.update({
    id : Number(req.params.id),
    subject_name: req.body.subject_name
  }, {where : {
    id : Number(req.params.id)
    }
  })
  .then(() => {
    res.redirect('/subjects')
  })
  .catch((err) => {
    res.redirect(`/subjects?msg=${err}`)
  })
})

router.get('/delete/:id', function(req, res) {
  Model.Subject.destroy({
    where : { id : Number(req.params.id)}
  })
  .then(() => {
    res.redirect('/subjects')
  })
  .catch(err => {
    res.redirect(`/subjects?msg=${err}`)
  })
})

router.get('/:id/enrolled-students', function(req, res) {
  let subject = null
  Model.Subject.findByPk(Number(req.params.id))
  .then(subjectData => {
    subject = subjectData
    return subjectData.getStudents()
  })
  .then(data => {
    subject.Students = data
    res.render('subject', {subject, getFullName, getScore})
  })
  
  .catch(err => {
    res.redirect(`/subjects?msg=${err}`)
  })
})


router.get('/:id/give-score', function(req, res) {
  res.render('give-score' ,{id : req.params.id})
})

router.post('/:id/give-score', function(req, res) {
  Model.SubjectStudent.update({
    score : Number(req.body.score)
  },{where : {
    id : Number(req.params.id)
    }
  })
  .then(() => {
    return Model.SubjectStudent.findByPk(Number(req.params.id))
  })
  .then(data => {
    res.redirect(`/subjects/${data.dataValues.SubjectId}/enrolled-students`)
  })
  .catch(err => {
    res.redirect('/subjects?msg='+err)
  })
})



module.exports = router