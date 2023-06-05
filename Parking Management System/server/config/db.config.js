const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'harshil',
  password: 'rootroot',
  database: 'VMS',
});

con.connect(function(err) {
  if (err) throw err;
  console.log('DB is Connected!');
});

con.on('error', function(err) {
  console.log(err.code);
});

module.exports = con;
