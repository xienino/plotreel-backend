const mongoose = require('mongoose');
const config = require('./index');

module.exports = async function connectDB() {
  try {
    // 连接 MongoDB
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};