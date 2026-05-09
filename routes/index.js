const upgrade = require('./upgrade.route');
const aihost = require('./aihost.route');

// 将所有路由统一导出，方便 app.js 挂载
module.exports = { upgrade, aihost };