const dotenv = require('dotenv');

// 根据当前环境加载不同的 .env 文件，默认 dev
const env = process.env.NODE_ENV || 'dev';
dotenv.config({ path: `.env.${env}` });

module.exports = {
  port: process.env.PORT || 47845,
  nodeEnv: env,
  mysql: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '123456',
    database: process.env.MYSQL_DATABASE || 'web_user_db'
  },
  tokenSecret: process.env.TOKEN_SECRET,
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000'
};
