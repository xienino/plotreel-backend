const { db } = require('../config/db');

const tableName = 'users';

const query = (sql, params = []) => new Promise((resolve, reject) => {
  db.query(sql, params, (err, rows) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(rows);
  });
});

const ensureTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      username VARCHAR(64) NULL,
      mobile_no VARCHAR(32) NULL,
      password_hash VARCHAR(255) NULL,
      token VARCHAR(512) NULL,
      flag_src VARCHAR(16) NULL,
      sys_id VARCHAR(32) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_users_mobile_no (mobile_no),
      KEY idx_users_username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const columns = await query(`SHOW COLUMNS FROM ${tableName}`);
  const columnNames = new Set(columns.map((column) => column.Field));
  const addColumn = async (name, definition) => {
    if (!columnNames.has(name)) {
      await query(`ALTER TABLE ${tableName} ADD COLUMN ${name} ${definition}`);
    }
  };

  await addColumn('mobile_no', 'VARCHAR(32) NULL');
  await addColumn('password_hash', 'VARCHAR(255) NULL');
  await addColumn('flag_src', 'VARCHAR(16) NULL');
  await addColumn('sys_id', 'VARCHAR(32) NULL');
  await addColumn('created_at', 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP');
  await addColumn(
    'updated_at',
    'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  );
};

const findByMobile = async (mobileNo) => {
  const rows = await query(`SELECT * FROM ${tableName} WHERE mobile_no = ? LIMIT 1`, [mobileNo]);
  return rows[0] || null;
};

const findByAccount = async (account) => {
  const rows = await query(
    `SELECT * FROM ${tableName} WHERE mobile_no = ? OR username = ? LIMIT 1`,
    [account, account]
  );
  return rows[0] || null;
};

// User 数据访问对象，可用于登录注册和权限验证
module.exports = {
  tableName,
  ensureTable,
  findByMobile,
  findByAccount,

  async findByUsername(username) {
    const rows = await query(`SELECT * FROM ${tableName} WHERE username = ? LIMIT 1`, [username]);
    return rows[0] || null;
  },

  async create({ username, mobileNo, passwordHash, token, flagSrc, sysId }) {
    await ensureTable();
    const result = await query(
      `INSERT INTO ${tableName} (username, mobile_no, password_hash, token, flag_src, sys_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        username || mobileNo,
        mobileNo || null,
        passwordHash || null,
        token || null,
        flagSrc || null,
        sysId || null
      ]
    );

    return {
      id: result.insertId,
      username: username || mobileNo,
      mobile_no: mobileNo || null,
      token: token || null
    };
  },

  async updatePasswordAndToken(id, { passwordHash, token }) {
    await query(
      `UPDATE ${tableName} SET password_hash = ?, token = ? WHERE id = ?`,
      [passwordHash, token || null, id]
    );
    return { id, token: token || null };
  },

  async updateToken(id, token) {
    await query(`UPDATE ${tableName} SET token = ? WHERE id = ?`, [token || null, id]);
    return { id, token: token || null };
  }
};
