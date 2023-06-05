const con = require('../config/db.config');
const config = require('../config/auth.config');

const cron = require('node-cron');
const nodemailer = require('nodemailer');

const sendMail = (mail) => {
  const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email_id,
      pass: config.password,
    },
  });

  // Setting credentials
  const mailDetails = {
    from: config.email_id,
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
  };

  // Sending Email
  mailTransporter.sendMail(mailDetails, function(err, data) {
    if (err) {
      console.log('Error Occurs', err);
    } else {
      console.log('Email sent successfully');
    }
  });
};

const addNotification = (userId, text) => {
  sql = `INSERT INTO notifications SET owner_id = ${userId}, notification_text = '${text}', created_at = NOW();`;
  con.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.getTotalVehicles = async (req, res) => {
  try {
    con.query(
        'SELECT COUNT(*) FROM vehicle_data WHERE vehicle_owner_id = ?',
        [req.body.owner_id],
        (err, result) => {
          if (err) {
            res.status(500).send({message: err});
            return;
          }
          return res.status(200).send(result[0]);
        },
    );
  } catch (err) {
    this.next(err);
  }
};

exports.getWrongParkingLogs = async (req, res) => {
  try {
    con.query(
        'SELECT COUNT(*) FROM wrong_parking WHERE owner_id = ?',
        [req.body.owner_id],
        (err, result) => {
          if (err) {
            res.status(500).send({message: err});
            return;
          }
          // redirected to wrong parking component
          return res.status(200).send(result[0]);
        },
    );
  } catch (err) {
    this.next(err);
  }
};

exports.getDuePenalties = async (req, res) => {
  try {
    con.query(
        'SELECT due_penalty FROM owner_data WHERE owner_id = ?',
        [req.body.owner_id],
        (err, result) => {
          if (err) {
            res.status(500).send({message: err});
            return;
          }
          return res.status(200).send(result[0]);
        },
    );
  } catch (err) {
    this.next(err);
  }
};

exports.getProfile = async (req, res) => {
  try {
    con.query(
        'SELECT * FROM owner_data WHERE  owner_id = ?;',
        [req.body.ownerId],
        (err, result) => {
          if (err) {
            res.status(500).send({message: err});
            return;
          }
          return res.status(200).send(result[0]);
        },
    );
  } catch (err) {
    this.next(err);
  }
};

exports.complainForWrongParking = async (req, res) => {
  try {
    con.query(
        'SELECT * FROM vehicle_data WHERE vehicle_number = ?',
        [req.body.vehicle_no],
        (err, result) => {
          if (err) {
            res.status(500).send({message: err});
            return;
          }
          if (result.length === 0) {
            return res.status(404).send();
          }
          const ownerId = result[0].vehicle_owner_id;
          const vehiclId = result[0].vehicle_id;

          con.query(
              `INSERT INTO wrong_parking(vehicle_id, owner_id, event_time, complain_owner_id) VALUES(${vehiclId},${ownerId},NOW(), ${req.body.owner_id});`,
              (err, result) => {
                if (err) {
                  res.status(500).send({message: err});
                  return;
                }
                return res.status(200).send(result[0]);
              },
          );
        },
    );
  } catch (err) {
    this.next(err);
  }
};

exports.getWrongParking = async (req, res) => {
  return new Promise((resolve, reject) => {
    sql = `SELECT wrong_parking.id, vehicle_data.vehicle_id, vehicle_data.vehicle_number, vehicle_data.vehicle_type, wrong_parking.event_time, wrong_parking.penalty_amount, wrong_parking.status, wrong_parking.owner_id, wrong_parking.complain_owner_id, owner_data.owner_name as complain_owner_name, owner_data.email_id as complain_owner_email FROM wrong_parking LEFT JOIN vehicle_data ON wrong_parking.vehicle_id = vehicle_data.vehicle_id LEFT JOIN owner_data ON wrong_parking.complain_owner_id = owner_data.owner_id WHERE wrong_parking.owner_id = '${req.body.owner_id}' AND wrong_parking.status='approved'`;
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve(res.status(200).send(result));
    });
  });
};

exports.getPenalties = async (req, res) => {
  return new Promise((resolve, reject) => {
    sql = `SELECT wrong_parking.id, vehicle_data.vehicle_id, vehicle_data.vehicle_number, vehicle_data.vehicle_type, wrong_parking.event_time, wrong_parking.penalty_amount, wrong_parking.status, wrong_parking.owner_id, owner_data.owner_name, owner_data.email_id FROM wrong_parking LEFT JOIN vehicle_data ON wrong_parking.vehicle_id = vehicle_data.vehicle_id LEFT JOIN owner_data ON wrong_parking.complain_owner_id = owner_data.owner_id WHERE wrong_parking.owner_id = '${req.body.owner_id}' AND wrong_parking.status='resolved'`;
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve(res.status(200).send(result));
    });
  });
};

exports.getOwners = async (req, res) => {
  try {
    con.query(
        'SELECT * FROM owner_data ORDER BY block_no DESC;',
        (err, result) => {
          if (err) {
            res.status(500).send({message: err});
            return;
          }
          return res.status(200).send(result);
        },
    );
  } catch (err) {
    this.next(err);
  }
};

exports.getOwnerByType = async (req, res) => {
  if (req.body.type !== 'vehicle_no') {
    sql = 'SELECT * FROM owner_data WHERE ' + req.body.type + ' = ?';
    con.query(sql, [req.body.value], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        return;
      }
      return res.status(200).send(result);
    });
  } else {
    sql = ' SELECT vehicle_owner_id FROM vehicle_data WHERE vehicle_number = ?';
    con.query(sql, [req.body.value], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        return;
      }
      value = result[0].vehicle_owner_id;
      con.query(
          'SELECT * FROM owner_data WHERE owner_id = ?',
          [req.body.value],
          (err, result) => {
            if (err) {
              res.status(500).send({message: err});
              return;
            }
            return res.status(200).send(result);
          },
      );
    });
  }
};

exports.getMap = async (req, res) => {
  try {
    return res.status(200).sendFile('../../client/src/assets/map.jpeg');
  } catch (err) {
    this.next(err);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    sql = `UPDATE INTO owner_data SET owner_name = ${req.body.ownerName}, contact_no = ${req.body.ownerName}, email_id = ${req.body.emailId}, block_no = ${req.body.ownerName}, password = ${req.boddy.password} `;
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        return;
      }
      return res.status(200).send(result);
    });
  } catch (err) {
    this.next(err);
  }
};

exports.addVehicleRequest = async (req, res) => {
  return new Promise((resolve, reject) => {
    sql = `INSERT INTO vehicle_data(vehicle_type, vehicle_owner_id, vehicle_number, isFavourite) VALUES ('${req.body.vehicle.vehicle_type}', ${req.body.owner_id}, '${req.body.vehicle.vehicle_number}', ${req.body.vehicle.isFavourite})`;
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve(res.status(200).send(result));
    });
  });
};

exports.deleteVehicle = async (req, res) => {
  try {
    con.query(
        'DELETE vehicle_data WHERE vehicle_id ?',
        [req.body.vehicle_id],
        (err, result) => {
          if (err) {
            res.status(500).send({message: err});
            return;
          }
          con.query(
              'UPDATE owner_id SET number_of_vehicle = number_of_vehicle - 1 WHERE owner_id = ?',
              [req.body.owner_id],
              (req, res) => {
                if (err) {
                  res.status(500).send({message: err});
                  return;
                }
                return res
                    .status(200)
                    .send({message: 'Vehicle deleted successfully!'});
              },
          );
        },
    );
  } catch (err) {
    this.next(err);
  }
};

exports.guestParkingRequest = async (req, res) => {
  const result = new Promise((resolve, reject) => {
    let slot = req.body.requested_slot;
    slot = slot === 'any' ? null : parseInt(slot);
    con.query(
        `INSERT INTO guest_parking_request(from_time, to_time, requested_slot, owner_id) VALUES ('${req.body.from_time}','${req.body.to_time}',${slot},${req.body.owner_id})`,
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send({message: err});
            reject(err);
          }
          resolve();
        },
    );
  });
  res.status(200).send(result);
};

exports.resolvePenalties = async (req, res) => {
  try {
    con.query(
        'UPDATE wrong_parking SET status = "paid" WHERE id = ?',
        [req.body.wrong_parking_id],
        (err, result) => {
          if (err) {
            res.status(500).send({message: err});
            return;
          }
          res.status(200).send({
            message: 'Request for resolving penalty send successfully to Admin!',
          });
        },
    );
  } catch (err) {
    this.next(err);
  }
};

exports.updateVehicle = async (req, res) => {
  return new Promise((resolve, reject) => {
    con.query(
        `UPDATE vehicle_data SET vehicle_type = '${req.body.vehicle.vehicle_type}', isFavourite = ${req.body.vehicle.isFavourite}, vehicle_number = '${req.body.vehicle.vehicle_number}'  WHERE vehicle_id = ?`,
        [req.body.vehicle.vehicle_id],
        (err, result) => {
          if (err) {
            res.status(500).send({message: err});
            reject(err);
          }
          resolve(res.status(200).send(result));
        },
    );
  });
};

exports.resolveWrongParking = async (req, res) => {
  const result = new Promise((resolve, reject) => {
    sql = 'UPDATE wrong_parking SET status = \'resolved\' WHERE id = ?';
    con.query(sql, [req.body.item.value], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve();
    });
  });
  const mail = {
    to: `"${req.body.item.props.title.complain_owner_email}"`,
    // to: "hkharshil26202@gmail.com",
    subject: 'Wrong Parking!',
    text: `Dear ${req.body.item.props.title.complain_owner_name}, Your wrong parking complain for ${req.body.item.props.title.vehicle_type} of Vehicle Number: ${req.body.item.props.title.vehicle_number} is resolved. Kindly check the penalties for your activity. Thank you`,
  };
  /**/ await addNotification(
      req.body.item.props.title.complain_owner_id,
      'Wrong Parking Resolved',
  );
  await sendMail(mail);
  res.status(200).send(result);
};

exports.resolvePenalty = async (req, res) => {
  const result = new Promise((resolve, reject) => {
    sql = 'UPDATE wrong_parking SET status = \'paid\' WHERE id = ?';
    con.query(sql, [req.body.item.value], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve();
    });
  });
  res.status(200).send(result);
};
