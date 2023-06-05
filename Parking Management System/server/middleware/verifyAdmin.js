const con = require('../config/db.config');

checkIsAdmin = async (req, res, next) => {
  // console.log(req.body)
  try {
    con.query('SELECT * FROM owner_data WHERE email_id = ?', [req.body.email], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        return;
      }
      if (result.length === 0) {
        return res.status(404).send({message: 'User Not found.'});
      }
      req.body.isAdmin = result[0].isAdmin;
      next();
    });
  } catch (err) {
    this.next(err);
  }
};

module.exports = checkIsAdmin;
