const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

verifyToken = (req, res, next) => {
  console.log(req.headers);
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(' ')[1];

  if (token === null) {
    return res.status(401).send({error: 'Null Token'});
  }
  jwt.verify(token, config.secret, (error, owner) => {
    if (error) {
      return res.status(403).send({error: error.message});
    }
    req.owner = owner;
    next();
  });
};

module.exports = verifyToken;
