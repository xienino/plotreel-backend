const dotenv = require('dotenv');

// 根据当前环境加载不同的 .env 文件，默认 dev
const env = process.env.NODE_ENV || 'dev';
dotenv.config({ path: `.env.${env}` });

module.exports = {
  port: process.env.PORT || 47845,
  nodeEnv: env,
  mongoUri: process.env.MONGO_URI,
  tokenSecret: process.env.TOKEN_SECRET,
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000'
};