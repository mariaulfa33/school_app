function encrpyt(password, secret) {
  const crypto = require('crypto')
  return crypto
        .createHmac('sha256', secret)
        .update(password)
        .digest('hex')
}

module.exports = encrpyt