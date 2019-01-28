'use strict';
const fs = require('fs')

function readFile() {
  return new Promise ((resolve, reject) => {
    fs.readFile('teacher.csv', 'utf8', function(err, data) {
      if(err) {
        reject(err)
      } else {
        data = data.split('\n').slice(1)
        let result = []
        data.forEach(teacher => {
          teacher = teacher.split(',')
          let obj = {
            first_name : teacher[0],
            last_name : teacher[1],
            email : teacher[2],
            createdAt : new Date(),
            updatedAt : new Date()
          }
          result.push(obj)
        })
        resolve(result)
      }

    })
  })

}


module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return new Promise ((resolve, reject) => {
     readFile()
     .then(data => {
       resolve(
        queryInterface.bulkInsert('Teachers', data, {})
       )
     })
     .catch(err => {
       reject(err)
     })
   })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('Teachers', null, {});
  }
};
