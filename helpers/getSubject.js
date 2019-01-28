function getSubject(input) {
  if(input == null) {
    return 'unsassigned'
  } else {
    return input.dataValues.subject_name
  }
}

module.exports = getSubject