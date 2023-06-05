const con = require('../config/db.config');
const config = require('../config/auth.config');

const cron = require('node-cron');
const nodemailer = require('nodemailer');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

cron.schedule('* * 1 * * *', () => {
  return new Promise((resolve, reject) => {
    con.query(
        'UPDATE slot_allotation AS sa LEFT JOIN guest_parking_request AS gp ON sa.slot_id = gp.requested_slot SET isAllotted = false, gp.status=\'completed\' WHERE gp.to_time < NOW();',
        (err, res) => {
          if (err) {
            return reject(err);
          } else {
            console.log('cron job worked!');
            resolve();
          }
        },
    );
  });
});

const addNotification = (userId, text) => {
  sql = `INSERT INTO notifications SET owner_id = ${userId}, notification_text = '${text}', created_at = NOW();`;
  con.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.displayChart = async (req, res) => {
  try {
    const result1 = new Promise((resolve, reject) => {
      con.query(
          'SELECT MONTH(created_at) AS month, COUNT(*) AS count FROM owner_data WHERE YEAR(created_at) = 2023 GROUP BY MONTH(created_at);',
          (err, res) => {
            if (err) {
              reject(err);
            }
            resolve(res);
          },
      );
    });
    const result2 = new Promise((resolve, reject) => {
      con.query(
          'SELECT MONTH(created_at) AS month, COUNT(*) AS count FROM vehicle_data WHERE YEAR(created_at) = 2023 GROUP BY MONTH(created_at);',
          (err, res) => {
            if (err) {
              reject(err);
            }
            resolve(res);
          },
      );
    });
    const data1 = await result1;
    const data2 = await result2;
    const arr1 = new Array(12).fill(0);
    const arr2 = new Array(12).fill(0);
    for (let i = 0; i < data1.length; i++) {
      arr1[data1[i].month - 1] = data1[i].count;
    }
    for (let i = 0; i < data2.length; i++) {
      arr2[data2[i].month - 1] = data2[i].count;
    }
    return res.status(200).send({arr1, arr2});
  } catch (err) {
    return res.status(500).send({message: err});
  }
};

// UPDATE owner_data SET created_at = TIMESTAMP(CONCAT('2023-', LPAD(FLOOR(1 + RAND() * 4), 2, '0'), '-', LPAD(FLOOR(1 + RAND() * 31), 2, '0'), ' ', LPAD(FLOOR(RAND() * 24), 2, '0'), ':', LPAD(FLOOR(RAND() * 60), 2, '0'), ':', LPAD(FLOOR(RAND() * 60), 2, '0'))) WHERE created_at IS NULL; -- Only update rows where created_at is NULL;
// UPDATE vehicle_data SET created_at = TIMESTAMP(CONCAT('2023-', LPAD(FLOOR(1 + RAND() * 4), 2, '0'), '-', LPAD(FLOOR(1 + RAND() * 31), 2, '0'), ' ', LPAD(FLOOR(RAND() * 24), 2, '0'), ':', LPAD(FLOOR(RAND() * 60), 2, '0'), ':', LPAD(FLOOR(RAND() * 60), 2, '0'))) WHERE created_at IS NULL; -- Only update rows where created_at is NULL;

exports.displayDashboard = async (req, res) => {
  try {
    const totalOwners = await getTotalOwners();
    const totalVehicles = await getTotalVehicles();
    const slotsAvailable = await getSlotsAvailable();
    return res.status(200).send({totalOwners, totalVehicles, slotsAvailable});
  } catch (err) {
    console.log(err);
  }
};

function getTotalOwners() {
  return new Promise((resolve, reject) => {
    con.query(
        'SELECT COUNT(*) as totalOwners FROM owner_data WHERE isAdmin = false AND status=\'approved\';',
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result[0].totalOwners);
          }
        },
    );
  });
}

function getTotalVehicles() {
  return new Promise((resolve, reject) => {
    con.query(
        'SELECT COUNT(*) as totalVehicles FROM vehicle_data WHERE status = "approved"',
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result[0].totalVehicles);
          }
        },
    );
  });
}

function getSlotsAvailable() {
  return new Promise((resolve, reject) => {
    con.query(
        'SELECT COUNT(*) as availableSlots FROM slot_allotation WHERE isAllotted = false;',
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result[0].availableSlots);
          }
        },
    );
  });
}

exports.getProfile = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      con.query(
          'SELECT * FROM owner_data WHERE owner_id = ?;',
          [req.body.owner_id],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result[0]);
            }
          },
      );
    });
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({message: err});
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      con.query(
          `SELECT * FROM notifications WHERE owner_id = ? AND status='unseen'`,
          [req.body.owner_id],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
      );
    });
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({message: err});
  }
};

exports.changeNotificationStatus = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      con.query(
          `UPDATE notifications SET status = 'seen' WHERE id = ?`,
          [req.body.id],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
      );
    });
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({message: err});
  }
};

exports.clearNotifications = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      con.query(
          `UPDATE notifications SET status = 'seen' WHERE owner_id = ?`,
          [req.body.owner_id],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
      );
    });
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({message: err});
  }
};

exports.getOwners = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      con.query(
          'SELECT * FROM owner_data WHERE status = \'approved\' ORDER BY block_no DESC;',
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
      );
    });
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({message: err});
  }
};
exports.getVehicles = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      con.query(
          'SELECT vd.vehicle_id, vd.vehicle_number, vd.vehicle_type, vd.isFavourite, sa.slot_id FROM vehicle_data as vd LEFT JOIN slot_allotation AS sa ON vd.vehicle_id = sa.vehicle_id WHERE vd.vehicle_owner_id = ? AND vd.status=\'approved\' ORDER BY vehicle_id DESC;',
          [req.body.owner_id],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
      );
    });
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({message: err});
  }
};

exports.getOwnerByType = async (req, res) => {
  try {
    if (req.body.type !== 'vehicle_no') {
      const result = await new Promise((resolve, reject) => {
        const sql = `SELECT * FROM owner_data WHERE ${req.body.type} = ?`;
        con.query(sql, [req.body.value], (err, result) => {
          if (err) {
            reject(err);
          } else if (result.length === 0) {
            return res.status(404).send({msg: 'No data found'});
          } else {
            resolve(result);
          }
        });
      });
      return res.status(200).send(result);
    } else {
      const result = await new Promise((resolve, reject) => {
        const sql =
          'SELECT vehicle_owner_id FROM vehicle_data WHERE vehicle_number = ?';
        con.query(sql, [req.body.value], (err, result) => {
          if (err) {
            reject(err);
          } else if (result.length === 0) {
            return res.status(404).send({msg: 'No data found'});
          } else {
            resolve(result[0].vehicle_owner_id);
          }
        });
      });
      const value = result;
      const result2 = await new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM owner_data WHERE owner_id = ?';
        con.query(sql, [value], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      return res.status(200).send(result2);
    }
  } catch (err) {
    return res.status(500).send({message: err});
  }
};

exports.getMap = async (req, res) => {
  return new Promise((resolve, reject) => {
    try {
      res.status(200).sendFile('../../client/src/assets/map.jpeg', () => {
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.updateProfile = async (req, res) => {
  return new Promise((resolve, reject) => {
    sql = `UPDATE owner_data SET owner_name = '${req.body.owner_name}', contact_no = '${req.body.contact_no}', email_id = '${req.body.email_id}', block_no = '${req.body.block_no}' WHERE owner_id=${req.body.owner_id}`;
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve(res.status(200).send(result));
    });
  });
};

exports.deleteOwner = async (req, res) => {
  return new Promise((resolve, reject) => {
    sql = 'DELETE FROM wrong_parking WHERE owner_id = ?;';
    con.query(sql, [req.body.owner_id], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      console.log('wrong_parking deleted');
      const vehicles = [];
      con.query(
          'SELECT vehicle_id FROM vehicle_data WHERE vehicle_owner_id = ?',
          [req.body.owner_id],
          (req, result) => {
            if (err) {
              res.status(500).send({message: err});
              reject(err);
            }
            vehicles.push(result[0]);
            console.log(vehicles);
          },
      );
      for (const i in vehicles) {
        con.query(
            'DELETE slot_allotation WHERE vehicle_id = ?',
            [i[vehicle_id]],
            (req, result) => {
              if (err) {
                res.status(500).send({message: err});
                reject(err);
              }
            },
        );
      }
      console.log('vehicle slot deleted');
      con.query(
          'DELETE FROM vehicle_data WHERE vehicle_owner_id = ?;',
          [req.body.owner_id],
          (err, result) => {
            if (err) {
              res.status(500).send({message: err});
              reject(err);
            }
            console.log('vehicle deleted');
            con.query(
                'DELETE FROM owner_data WHERE owner_id = ?;',
                [req.body.owner_id],
                (err, result) => {
                  if (err) {
                    res.status(500).send({message: err});
                    reject(err);
                  }
                  console.log('owner deleted');
                  resolve(res.status(200).send(result));
                },
            );
          },
      );
    });
  });
};

exports.addOwner = async (req, res) => {
  return new Promise((resolve, reject) => {
    const data = [];
    data.push(req.body.block_no);
    data.push(req.body.owner_name);
    data.push(req.body.contact_no);
    data.push(req.body.email_id);
    password = bcrypt.hashSync(req.body.password, 8);
    data.push(password);

    sql =
      'INSERT INTO owner_data(block_no, owner_name, contact_no, email_id, password) VALUES ?';
    con.query(sql, [[data]], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve(
          res.status(200).send({message: 'User was registered successfully!'}),
      );
    });
  });
};

exports.getPendingOwner = async (req, res) => {
  return new Promise((resolve, reject) => {
    sql = 'SELECT * FROM owner_data WHERE status = \'pending\'';
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve(res.status(200).send(result));
    });
  });
};

exports.approveOwner = async (req, res) => {
  const result = new Promise((resolve, reject) => {
    sql = 'UPDATE owner_data SET status = \'approved\' WHERE owner_id = ?';
    con.query(sql, [req.body.owner_id], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve();
    });
  });

  const mail = {
    to: req.body.email_id,
    subject: 'Owner Registered Successfully!',
    text: `Dear ${req.body.owner_name}, Your owner request is accepted. Now you can login to Park@Ease`,
  };
  await sendMail(mail);

  res.status(200).send(result);
};

exports.rejectOwner = async (req, res) => {
  const result = new Promise((resolve, reject) => {
    sql = 'UPDATE owner_data SET status = \'rejected\' WHERE owner_id = ?';
    con.query(sql, [req.body.owner_id], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve();
    });
  });

  const mail = {
    to: req.body.email_id,
    subject: 'Owner Request Rejected!',
    text: `Dear ${req.body.owner_name}, Your owner request is rejected. Please try again`,
  };
  await sendMail(mail);

  res.status(200).send(result);
};

exports.getPendingVehicle = async (req, res) => {
  return new Promise((resolve, reject) => {
    sql =
      'SELECT vd.vehicle_id, vd.vehicle_type, vd.vehicle_number, od.owner_id, od.owner_name,  od.block_no FROM vehicle_data AS vd LEFT JOIN owner_data AS od ON vd.vehicle_owner_id = od.owner_id WHERE vd.status = \'pending\'';
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve(res.status(200).send(result));
    });
  });
};

const allotSlot = async (vehicleId, slotId) => {
  return new Promise((resolve, reject) => {
    con.query(
        `UPDATE slot_allotation SET isAllotted = true, vehicle_id = ${vehicleId} WHERE slot_id = ${slotId}`,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        },
    );
  });
};

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

exports.approveVehicle = async (req, res) => {
  await allotSlot(req.body.vehicle_id, req.body.slot_id);
  const result = await new Promise((resolve, reject) => {
    sql = 'UPDATE vehicle_data SET status = \'approved\' WHERE vehicle_id = ?';
    con.query(sql, [req.body.vehicle_id], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve();
    });
  });

  /**/ await addNotification(
      req.body.owner_id,
      'New Vehicle Request Accepted',
  );
  const mail = {
    to: req.body.email_id,
    subject: 'Slot Allotted Successfully!',
    text: `Dear ${req.body.owner_name}, Your Vehicle Request for Vehicle Number: ${req.body.vehicle_number} is Accepted. Your allocatted slot number is: ${req.body.slot_id}`,
  };
  await sendMail(mail);

  return res.status(200).send(result);
};

exports.rejectVehicle = async (req, res) => {
  const result = new Promise((resolve, reject) => {
    sql = 'UPDATE vehicle_data SET status = \'rejected\' WHERE vehicle_id = ?';
    con.query(sql, [req.body.vehicle_id], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve();
    });
  });

  /**/ await addNotification(
      req.body.owner_id,
      'Vehicle Request Rejected',
  );
  const mail = {
    to: req.body.email_id,
    subject: 'Vehicle Request Rejected!',
    text: `Dear ${req.body.owner_name}, Your Vehicle Request for Vehicle Number: ${req.body.vehicle_number} is Rejected. Please apply again.`,
  };
  await sendMail(mail);
  res.status(200).send(result);
};

exports.getWrongParking = async (req, res) => {
  return new Promise((resolve, reject) => {
    sql =
      'SELECT wp.id, wp.vehicle_id, vd.vehicle_type, vd.vehicle_number, wp.owner_id, od1.owner_name, od1.email_id, od.owner_name AS complain_by, od1.block_no, wp.event_time, wp.complain_owner_id FROM wrong_parking AS wp LEFT JOIN owner_data AS od ON wp.complain_owner_id = od.owner_id LEFT JOIN owner_data AS od1 ON wp.owner_id = od1.owner_id LEFT JOIN vehicle_data AS vd ON wp.vehicle_id = vd.vehicle_id WHERE wp.status = \'pending\'';
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve(res.status(200).send(result));
    });
  });
};

exports.approveWrongParking = async (req, res) => {
  const result = new Promise((resolve, reject) => {
    sql = 'UPDATE wrong_parking SET status = \'approved\' WHERE id = ?';
    con.query(sql, [req.body.item.value], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve();
    });
  });

  /**/ await addNotification(
      req.body.item.props.title.owner_id,
      'Your vehicle is Parked Wrongly',
  );
  const mail = {
    to: `"${req.body.item.props.title.email_id}"`,
    // to: "hkharshil26202@gmail.com",
    subject: 'Wrong Parking!',
    text: `Dear ${req.body.item.props.title.owner_name}, Your ${req.body.item.props.title.vehicle_type} of Vehicle Number: ${req.body.item.props.title.vehicle_number} is Wrongly parked and complained by ${req.body.item.props.title.complain_by}. Please park it on your slot and resolve parking afterwards.`,
  };
  await sendMail(mail);
  res.status(200).send(result);
};

exports.rejectWrongParking = async (req, res) => {
  return new Promise((resolve, reject) => {
    sql = 'UPDATE wrong_parking SET status = \'rejected\' WHERE id = ?';
    con.query(sql, [req.body.id], (err, result) => {
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
    sql =
      'SELECT wp.id, wp.vehicle_id, wp.penalty_amount, vd.vehicle_type, vd.vehicle_number, wp.owner_id, od1.owner_name, od1.block_no, wp.event_time, wp.complain_owner_id FROM wrong_parking AS wp LEFT JOIN owner_data AS od1 ON wp.owner_id = od1.owner_id LEFT JOIN vehicle_data AS vd ON wp.vehicle_id = vd.vehicle_id WHERE wp.status = \'paid\'';
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve(res.status(200).send(result));
    });
  });
};

exports.approvePenalty = async (req, res) => {
  const result = new Promise((resolve, reject) => {
    sql = 'UPDATE wrong_parking SET status = \'completed\' WHERE id = ?';
    con.query(sql, [req.body.item.props.title.id], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve();
    });
  });

  /**/ await addNotification(
      req.body.item.props.title.owner_id,
      'Penalty Paid Successfully',
  );
  const mail = {
    to: req.body.item.props.title.email_id,
    subject: 'Pending Penalties!',
    text: `Dear ${req.body.item.props.title.owner_name}, Your penalty for ${req.body.item.props.title.vehicle_type} of amount ${req.body.item.props.title.penalty_amount} of Vehicle Number: ${req.body.item.props.title.vehicle_number} is Paid Successfully.`,
  };
  await sendMail(mail);
  res.status(200).send(result);
};

exports.rejectPenalty = async (req, res) => {
  const result = new Promise((resolve, reject) => {
    sql = 'UPDATE wrong_parking SET status = \'resolved\' WHERE id = ?';
    con.query(sql, [req.body.item.props.title.id], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve();
    });
  });

  /**/ await addNotification(
      req.body.item.props.title.owner_id,
      'Penalty Rejected',
  );
  const mail = {
    to: req.body.item.props.title.email_id,
    // to: "hkharshil26202@gmail.com",
    subject: 'Pending Penalties!',
    text: `Dear ${req.body.item.props.title.owner_name}, Your penalty for ${req.body.item.props.title.vehicle_type} of amount ${req.body.item.props.title.penalty_amount} of Vehicle Number: ${req.body.item.props.title.vehicle_number} is rejected by admin. Please pay it and resolve it afterwards`,
  };
  await sendMail(mail);
  res.status(200).send(result);
};

exports.getSlots = async (req, res) => {
  return new Promise((resolve, reject) => {
    sql =
      'SELECT slot_id FROM slot_allotation WHERE isAllotted = false AND isGuestSlot = true';
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve(res.status(200).send(result));
    });
  });
};

exports.getVehicleSlots = async (req, res) => {
  return new Promise((resolve, reject) => {
    sql =
      'SELECT slot_id FROM slot_allotation WHERE isAllotted = false AND isGuestSlot = false';
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve(res.status(200).send(result));
    });
  });
};

exports.updateOwner = async (req, res) => {
  try {
    sql = `UPDATE owner_data SET block_no = ${req.body.block_no}, owner_name = ${req.body.owner_name}, contact_no = ${req.body.contact_no}, email_id = ${req.body.email_id}, password = ${req.body.password} WHERE owner_id = ${req.body.ownerId}`;

    const result = await new Promise((resolve, reject) => {
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    return res.status(200).send({message: 'Owner was updated successfully!'});
  } catch (err) {
    res.status(500).send({message: err});
  }
};

exports.getAddVehicleRequest = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      con.query(
          'SELECT * FROM vehicle_data WHERE status = "pending";',
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
      );
    });

    return res.status(200).send(result[0]);
  } catch (err) {
    res.status(500).send({message: err});
  }
};

exports.addVehicle = async (req, res) => {
  try {
    if (req.body.isApproved) {
      const result = await new Promise((resolve, reject) => {
        con.query(
            'UPDATE vehicle_data SET status = \'approved\';',
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            },
        );
      });

      req.body.vehicle_id = result[0][vehicle_id];

      const result2 = await new Promise((resolve, reject) => {
        con.query(
            'UPDATE owner_id SET number_of_vehicle = number_of_vehicle + 1 WHERE owner_id = ?',
            [req.body.owner_id],
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            },
        );
      });

      const result3 = await new Promise((resolve, reject) => {
        con.query(
            `INSERT INTO slot_allotation(slot_id, vehicle_id, isAllotted) VALUES(${req.body.slot_id}, ${req.body.vehicle_id}, true)`,
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            },
        );
      });

      return res.status(200).send({message: 'Vehicle added successfully!'});
    } else {
      const result = await new Promise((resolve, reject) => {
        con.query(
            'DELETE vehicle_data WHERE vehicle_id = ?',
            [req.body.vehicle_id],
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            },
        );
      });

      return res.status(200).send({message: 'Vehicle Request is rejected!'});
    }
  } catch (err) {
    res.status(500).send({message: err});
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const deleteVehiclePromise = async () => {
      return new Promise((resolve, reject) => {
        con.query(
            'DELETE FROM vehicle_data WHERE vehicle_id = ?',
            [req.body.vehicle_id],
            (err, result) => {
              if (err) {
                console.log(err);
                reject(err);
                return;
              }
              resolve();
            },
        );
      });
    };
    const deleteWrongParkingLog = async () => {
      return new Promise((resolve, reject) => {
        con.query(
            'DELETE FROM wrong_parking WHERE vehicle_id = ?',
            [req.body.vehicle_id],
            (err, result) => {
              if (err) {
                console.log(err);
                reject(err);
                return;
              }
              resolve();
            },
        );
      });
    };
    const updateOwnerIdPromise = async () => {
      return new Promise((resolve, reject) => {
        con.query(
            'UPDATE owner_data SET number_of_vehicle = number_of_vehicle - 1 WHERE owner_id = ?',
            [req.body.owner_id],
            (err, result) => {
              if (err) {
                console.log(err);
                reject(err);
                return;
              }
              resolve();
            },
        );
      });
    };
    const updateSlot = async () => {
      return new Promise((resolve, reject) => {
        con.query(
            'UPDATE slot_allotation SET vehicle_id = NULL, isAllotted = false where slot_id = ?',
            [req.body.slot_id],
            (err, result) => {
              if (err) {
                console.log(err);
                reject(err);
                return;
              }
              resolve();
            },
        );
      });
    };
    await deleteWrongParkingLog();
    await updateSlot();
    await deleteVehiclePromise();
    await updateOwnerIdPromise();
    return res.status(200).send({message: 'Vehicle deleted successfully!'});
  } catch (err) {
    res.status(500).send({message: err});
  }
};

exports.wrongParkingApprovement = async (req, res) => {
  try {
    const smsPromise = () => {
      return new Promise((resolve, reject) => {
        // sms implementation
        resolve();
      });
    };
    const mailPromise = () => {
      return new Promise((resolve, reject) => {
        // mail implementation
        resolve();
      });
    };
    await smsPromise();
    await mailPromise();
    return res.status(200).send({message: 'SMS and mail sent successfully!'});
  } catch (err) {
    res.status(500).send({message: err});
  }
};

exports.getUnallottedRequestedSlots = async (req, res) => {
  try {
    const getUnallottedSlotsPromise = () => {
      return new Promise((resolve, reject) => {
        con.query(
            'SELECT slot_id, owner_id FROM slot_allotation WHERE isAllotted = false AND isGuestSlot = true AND owner_id IS NOT NULL;',
            (err, result) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(result[0]);
            },
        );
      });
    };
    const smsPromise = (result) => {
      return new Promise((resolve, reject) => {
        // sms implementation
        resolve(result);
      });
    };
    const mailPromise = (result) => {
      return new Promise((resolve, reject) => {
        // mail implementation
        resolve(result);
      });
    };
    const unallottedSlots = await getUnallottedSlotsPromise();
    await smsPromise(unallottedSlots);
    await mailPromise(unallottedSlots);
    return res.status(200).send(unallottedSlots);
  } catch (err) {
    res.status(500).send({message: err});
  }
};

exports.guestParkingAllotation = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      con.query(
          'UPDATE slot_allotation SET isAllotted = true WHERE slot_id = ?',
          [req.body.slot_id],
          (err, result) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          },
      );
    });
    // sms and mail implementation
    return res.status(200).send(result[0]);
  } catch (err) {
    this.next(err);
  }
};

exports.resolveGuestParking = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      con.query(
          'UPDATE slot_allotation SET isAllotted = false WHERE slot_id = ?',
          [req.body.slot_id],
          (err, result) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          },
      );
    });
    return res.status(200).send(result[0]);
  } catch (err) {
    this.next(err);
  }
};

exports.penaltiesApprovement = async (req, res) => {
  try {
    const result1 = await new Promise((resolve, reject) => {
      con.qery(
          'SELECT penalty_amount, owner_id FROM wrong_parking WHERE id = ?',
          [req.body.wrong_parking_id],
          (err, result) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          },
      );
    });

    const amount = result1[0].penalty_amount;
    const ownerId = result1[0].owner_id;

    const result2 = await new Promise((resolve, reject) => {
      con.query(
          'UPDATE owner_data SET due_penalty = due_penalty - ? WHERE owner_id = ?',
          [amount, ownerId],
          (err, result) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          },
      );
    });

    // sms and mail implementation
    const result3 = await new Promise((resolve, reject) => {
      con.query(
          'UPDATE wrong_parking SET status = \'resolved\' WHERE id = ?',
          [req.body.wrong_parking_id],
          (err, result) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          },
      );
    });

    return res.status(200).send(result3[0]);
  } catch (err) {
    this.next(err);
  }
};

exports.getGuestParking = async (req, res) => {
  return new Promise((resolve, reject) => {
    sql =
      'SELECT od.owner_name, od.owner_id, od.email_id, od.block_no, gp.from_time, gp.to_time, gp.id, gp.requested_slot FROM guest_parking_request AS gp LEFT JOIN owner_data AS od ON gp.owner_id = od.owner_id WHERE gp.status = \'pending\'';
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve(res.status(200).send(result));
    });
  });
};

exports.rejectGuestParking = async (req, res) => {
  const result = new Promise((resolve, reject) => {
    sql = 'UPDATE guest_parking_request SET status = \'rejected\' WHERE id = ?';
    con.query(sql, [req.body.item.value], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve();
    });
  });

  const mail = {
    // to: req.body.item.props.title.email_id,
    to: 'hkharshil26202@gmail.com',
    subject: 'Guest Parking Request Rejected!',
    text: `Dear ${req.body.item.props.title.owner_name}, Your guest parking request for ${req.body.item.props.title.requested_slot} from ${req.body.item.props.title.from_time} to ${req.body.item.props.title.to_time} is rejected by admin. Please book another slot.`,
  };

  /**/ await addNotification(
      req.body.item.props.title.owner_id,
      'Guest Parking Request Rejected',
  );
  await sendMail(mail);
  res.status(200).send(result);
};

exports.approveGuestParking = async (req, res) => {
  const result = new Promise((resolve, reject) => {
    sql = 'UPDATE guest_parking_request SET status = \'accepted\' WHERE id = ?';
    con.query(sql, [req.body.item.value], (err, result) => {
      if (err) {
        res.status(500).send({message: err});
        reject(err);
      }
      resolve();
    });
  });
  if (req.body.item.props.title.requested_slot === null) {
    sql =
      'select slot_id from slot_allotation WHERE isAllotted = false AND isGuestSlot = true;';
    con.query(sql, (err, result) => {
      if (err) {
        return res.status(500).send({message: err});
      }
      if (result.length === 0) {
        res.status(200).send(result);

        /**/ addNotification(
            req.body.item.props.title.owner_id,
            'Guest Parking Request Rejected',
        );
        const mail = {
          to: req.body.item.props.title.email_id,
          // to: "hkharshil26202@gmail.com",
          subject: 'Guest Parking Request Rejected!',
          text: `Dear ${req.body.item.props.title.owner_name}, Your guest parking request from ${req.body.item.props.title.from_time} to ${req.body.item.props.title.to_time} is rejected by admin due no slots availibility. Please book for another time.`,
        };
        sendMail(mail);
      } else {
        con.query(
            'UPDATE slot_allotation SET isAllotted = true WHERE slot_id = ?',
            [result[0].slot_id],
            (err, res) => {
              if (err) {
                return res.status(500).send({message: err});
              }
            },
        );
        con.query(
            `UPDATE guest_parking_request SET requested_slot = ${result[0].slot_id} WHERE id = ${req.body.item.value};`,
            (err, res) => {
              if (err) {
                return res.status(500).send({message: err});
              }
            },
        );

        /**/ addNotification(
            req.body.item.props.title.owner_id,
            'Guest Parking Request Accepted',
        );
        const mail = {
          // to: req.body.item.props.title.email_id,
          to: 'hkharshil26202@gmail.com',
          subject: 'Guest Parking Request Accepted!',
          text: `Dear ${req.body.item.props.title.owner_name}, Your guest parking request for ${result[0].slot_id} from ${req.body.item.props.title.from_time} to ${req.body.item.props.title.to_time} is accepted by admin.`,
        };
        sendMail(mail);
      }
    });
  } else {
    const result1 = new Promise((resolve, reject) => {
      sql = 'UPDATE slot_allotation SET isAllotted = true WHERE slot_id = ?';
      con.query(
          sql,
          [req.body.item.props.title.requested_slot],
          (err, result) => {
            if (err) {
              res.status(500).send({message: err});
              reject(err);
            }
            resolve();
          },
      );
    });

    /**/ await addNotification(
        req.body.item.props.title.owner_id,
        'Guest Parking Request Accepted',
    );
    const mail = {
      // to: req.body.item.props.title.email_id,
      to: 'hkharshil26202@gmail.com',
      subject: 'Guest Parking Request Accepted!',
      text: `Dear ${req.body.item.props.title.owner_name}, Your guest parking request for ${req.body.item.props.title.requested_slot} from ${req.body.item.props.title.from_time} to ${req.body.item.props.title.to_time} is accepted by admin.`,
    };
    await sendMail(mail);
  }

  res.status(200).send(result);
};
