const con = require('../config/db.config');

checkDuplicateEmail = (req, res, next) => {
  con.query('SELECT * FROM owner_data WHERE email_id = ?', [req.body.email_id], (err, result) => {
    if (err) {
      res.status(500).send({message: err});
      return;
    }
    if (result[0]) {
      res.status(400).send({message: 'Failed! Email is already in use!'});
      return;
    }
    next();
  });
};

module.exports = checkDuplicateEmail;
