
function getSecret() {
  return new Promise((resolve, reject) => {
    let crypto = require('crypto')
    crypto.randomBytes(48, function(err, buffer) {
      if(err) {
        reject(err)
      } else {
        token = buffer.toString('hex');
        resolve(token)
      }
    })
  })
}


module.exports = getSecret