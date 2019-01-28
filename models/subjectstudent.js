'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubjectStudent = sequelize.define('SubjectStudent', {
    id : {
      type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    StudentId: DataTypes.INTEGER,
    SubjectId: DataTypes.INTEGER,
    score : DataTypes.INTEGER
  }, {});
  SubjectStudent.associate = function(models) {
    // associations can be defined here
  };
  return SubjectStudent;
};