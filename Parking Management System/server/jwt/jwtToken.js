const config = require('../config/auth.config.js');

const jwt = require('jsonwebtoken');

function jwtToken(owner_email) {
  const accessToken = jwt.sign(owner_email, config.secret);
  return accessToken;
}

module.exports = jwtToken;
