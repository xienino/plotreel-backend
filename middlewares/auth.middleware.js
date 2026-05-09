// auth.middleware.js - 验证 JWT token 的中间件
// 这个中间件会在需要认证的路由前使用，确保请求携带有效的 token
// 例如，在 app.js 中使用：
// const authMiddleware = require('./middlewares/auth.middleware');
// app.use('/pnt/api/upgrade', authMiddleware, upgradeRoute);
// app.use('/videomaker/aihost', authMiddleware, aihostRoute);

// 该中间件用于保护路由, 如果 token 缺失或无效，返回 401
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  // 读取 Authorization: Bearer <token>
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ code: 401, data: {}, resMsg: ['Token required'] });
  }

  try {
    // 验证 token 是否有效
    const decoded = jwt.verify(token, config.tokenSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ code: 401, data: {}, resMsg: ['Invalid token'] });
  }
};