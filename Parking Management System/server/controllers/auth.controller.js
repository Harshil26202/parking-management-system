const con = require('../config/db.config');
const jwtToken = require('../jwt/jwtToken.js');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');



const addNotification = (userId, text) => {
  sql = `INSERT INTO notifications SET owner_id = ${userId}, notification_text = '${text}', created_at = NOW();`;
  con.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.signup = async (req, res) => {
  try {
    const data = [];
    data.push(req.body.block_no);
    data.push(req.body.owner_name);
    data.push(req.body.contact_no);
    data.push(req.body.email_id);
    const password = await bcrypt.hash(req.body.password, 8);
    data.push(password);
    const token = await jwtToken(req.body.email_id);
    data.push(token);

    const sql = 'INSERT INTO owner_data(block_no, owner_name, contact_no, email_id, password, token) VALUES ?';

    await new Promise((resolve, reject) => {
      con.query(sql, [[data]], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    const result = await new Promise((resolve, reject) => {
      con.query('SELECT * FROM owner_data WHERE email_id = ?', [req.body.email_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    await addNotification(result[0].owner_id, 'Welcome to Park@Ease');
    return res.status(200).send(result[0]);
  } catch (err) {
    res.status(500).send({message: err});
  }
};



exports.signin = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      con.query('SELECT * FROM owner_data WHERE email_id = ? AND status=\'approved\'', [req.body.email], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    if (result.length === 0) {
      return res.status(404).send({message: 'User Not found.'});
    }
    const passwordIsValid = await checkPassword(req.body.password, result[0].password);

    if (!passwordIsValid) {
      return res.status(401).send({message: 'Invalid Password!'});
    }
    const token = await jwtToken(result[0].email_id);
    const result1 = await new Promise((resolve, reject) => {
      con.query(`UPDATE owner_data SET token = '${token}' WHERE email_id = '${result[0].email_id}'`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    return res.status(200).send(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({message: 'Server error.'});
  }
};

exports.signout = async (req, res) => {
  try {
    return res.status(200).send({message: 'You\'ve been signed out!'});
  } catch (err) {
    this.next(err);
  }
};

async function checkPassword(entered_password, stored_password) {
  try {
    const result = await bcrypt.compare(entered_password, stored_password);
    // console.log(result)
    return result;
  } catch (err) {
    console.log(err);
  }
}

exports.matchPassword = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      con.query('SELECT password FROM owner_data WHERE email_id = ? AND status=\'approved\'', [req.body.email], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    const passwordIsValid = await checkPassword(req.body.password, result[0].password);

    if (!passwordIsValid) {
      return res.status(401).send({message: 'Invalid Password!'});
    }
    return res.status(200).send(result);
  } catch (err) {
    res.status(500).send({message: 'Server error.'});
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 8);
    const sql = `UPDATE owner_data SET password = '${password}' WHERE email_id = '${req.body.email}'`;
    const result = await new Promise((resolve, reject) => {
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    return res.status(200).send(result);
  } catch (err) {
    res.status(500).send({message: err});
  }
};
