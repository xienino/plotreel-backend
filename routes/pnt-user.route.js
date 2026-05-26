const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/autoLogin', authController.autoLogin);

module.exports = router;
