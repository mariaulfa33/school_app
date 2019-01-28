'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate : {
        isEmail : true,
        isUnique(value) {
          return new Promise((resolve, reject) => {
            Teacher.findAll({
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
  }, {});
  Teacher.associate = function(models) {
    // associations can be defined here
    Teacher.belongsTo(models.Subject, {foreignKey : 'SubjectId', sourceKey : 'id'})
  };
  return Teacher;
};