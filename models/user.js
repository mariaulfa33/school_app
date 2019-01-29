'use strict';
const encrypt = require('../helpers/encpryt')
const bycrypt = require('../helpers/byCrypt')
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {type : DataTypes.STRING,
      validate : {
        isEmail : true,
        isUnique(value) {
          return new Promise((resolve, reject) => {
            User.findAll({
              where : {
                email : value
              }
            })
            .then(data => {
              if(data.length != 0 && data[0].dataValues.id != this.id) {
                throw new Error('Email is UnAvailable!')
              } else {
                resolve()
              }
            })
            .catch(err => {
              reject(err)
            })
          })
        }
      }},
    passsword: {
      type : DataTypes.STRING,
      validate : {
        len : {
          args : [5, 20],
          msg : 'harus 5 - 10 karakter'
        }
      }
    },
    secret : DataTypes.STRING
  }, {
    hooks : {
      beforeCreate : (value) => {
        //CRYPTO
        value.dataValues.passsword = encrypt(`hacktiv8${value.dataValues.name}`, value.dataValues.secret)
        //BYCRYPT
        // return new Promise((resolve, reject) => {
        //   bycrypt(`hacktiv8${value.dataValues.name}`) 
        //   .then(data => {
        //     value.passsword = data
        //     resolve()
        //   })
        //   .catch(err => {
        //     reject(err)
        //   })
        // })
      }
    }
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};