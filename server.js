const app = require('./app');
const config = require('./config');

// 启动服务器，监听 127.0.0.1:47845
const server = app.listen(config.port, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${config.port} in ${config.nodeEnv} mode`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Server start failed: 127.0.0.1:${config.port} is already in use.`);
    return;
  }

  if (err.code === 'EACCES' || err.code === 'EPERM') {
    console.error(`Server start failed: no permission to listen on 127.0.0.1:${config.port}.`);
    return;
  }

  console.error('Server start failed:', err);
});
