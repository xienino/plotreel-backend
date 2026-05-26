const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const connectDB = require('./config/db');
const routes = require('./routes');
const responseMiddleware = require('./middlewares/response.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const authMiddleware = require('./middlewares/auth.middleware');

const app = express();

// 连接 MySQL 数据库
connectDB();

// 解析 JSON 请求体
app.use(express.json());
// 解析 application/x-www-form-urlencoded 请求体
app.use(express.urlencoded({ extended: true }));
// 记录请求日志，开发时方便排查
app.use(morgan('dev'));

// 允许跨域请求，前端默认运行在 http://localhost:3000
app.use(cors({
  origin: config.frontendOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// 统一响应格式中间件，所有 res.json() 都会走这里
app.use(responseMiddleware);

// 所有 /pnt/api 开头的接口都要经过 JWT 验证
// app.use('/pnt/api', authMiddleware);

// 路由挂载
app.use('/adm/api', routes.admin);
app.use('/pnt/api/user', routes.pntUser);
app.use('/pnt/api/upgrade', routes.upgrade);
app.use('/videomaker/aihost', routes.aihost);

// 错误处理中间件，放在最后
app.use(errorMiddleware);

module.exports = app;
