const mysql = require('mysql2');
const config = require('./index');

const db = mysql.createConnection(config.mysql);

function connectDB() {
  db.connect((err) => {
    if (!err) {
      console.log('MySQL connected');
      return;
    }

    console.error('MySQL connection error:', err);
    if (config.nodeEnv === 'dev') {
      console.warn('MySQL is unavailable in dev mode; server will keep running, but database queries may fail.');
      return;
    }

    process.exit(1);
  });
}

module.exports = connectDB;
module.exports.db = db;
