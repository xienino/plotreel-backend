const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  token: { type: String }
}, { timestamps: true });

// User 模型，可用于演示权限验证或用户信息存储
module.exports = mongoose.model('User', userSchema);