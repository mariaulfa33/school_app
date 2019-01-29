const router = require('express').Router()
const getSecret = require('../helpers/getSecret')
const encrypt = require('../helpers/encpryt')
const bycrypt = require('bcrypt')
const Model = require('../models')

router.get('/', function(req, res) {
  let msg = req.query.msg || null
  res.render('home', {msg})
})

router.post('/', function(req, res) {
  getSecret()
  .then(data => {
    return Model.User.create({
      name : req.body.name,
      email : req.body.email,
      secret : data
    })
  })
  .then(() => {
    res.redirect('/user')
  })
  .catch(err => {
    res.redirect('/user?msg='+err.message)
  })
})

router.post('/login', function(req, res) {

  //CRYPTO
  Model.User.findOne({
    where : {
      email : req.body.email
    }
  })
  .then(data => {
    console.log(data)
    if(data == undefined) {
      throw new Error('Email tidak terdaftar')
    } else if (data.passsword == encrypt(req.body.password, data.secret)) {
      res.redirect('/user?msg=berhasil login')
    } else {
      throw new Error('password salah')
    }
  })
  .catch(err => {
    res.redirect('/user?msg='+err)
  })

  //BYCRYPT
  // Model.User.findOne({
  //   where : {
  //     email : req.body.email
  //   }
  // })
  // .then(data => {
  //   if(data == undefined) {
  //     throw new Error('Email tidak terdaftar')
  //   } else {
  //     return bycrypt.compare(req.body.password, data.passsword)
  //   }
  // })
  // .then(function(pass) {
  //   if(pass == true) {
  //     res.redirect('/user?msg=berhasil login')
  //   } else {
  //     throw new Error('password salah')
  //   }
  // })
  // .catch(err => {
  //   res.redirect('/user?msg='+err)
  // })
})

module.exports = router