const upgrade = require('./upgrade.route');
const aihost = require('./aihost.route');
const admin = require('./admin.route');
const pntUser = require('./pnt-user.route');

// 将所有路由统一导出，方便 app.js 挂载
module.exports = { upgrade, aihost, admin, pntUser };
