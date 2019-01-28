'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate : {
        isEmail : true,
        isUnique(value) {
          return new Promise((resolve, reject) => {
            Student.findAll({
              where : {
                email : value
              }
            })
            .then(data => {
              if(data.length !== 0 && data[0].dataValues.id != this.id) {
                throw new Error ('Email already in use!')
              } else {
                resolve()
              }
            })
            .catch(err => {
              reject(err)
            })
          })
        }
      }
    }
  }, {
    hooks : {
      beforeDelete : (value) => {
        return sequelize.models.SubjectStudent.destroy({
          where : { StudentId : value.id}
        })
      }
    }
  });
  Student.associate = function(models) {
    // associations can be defined here
    Student.belongsToMany(models.Subject, {through : 'SubjectStudent'})
  };
  return Student;
};