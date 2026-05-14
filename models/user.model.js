const { db } = require('../config/db');

const tableName = 'users';

// User 数据访问对象，可用于演示权限验证或用户信息存储
module.exports = {
  tableName,

  findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ${tableName} WHERE username = ? LIMIT 1`, [username], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(rows[0] || null);
      });
    });
  },

  create({ username, token }) {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO ${tableName} (username, token) VALUES (?, ?)`,
        [username, token || null],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          resolve({ id: result.insertId, username, token: token || null });
        }
      );
    });
  }
};
