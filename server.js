const app = require('./app');
const config = require('./config');

// 启动服务器，监听 127.0.0.1:47845
app.listen(config.port, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${config.port} in ${config.nodeEnv} mode`);
});