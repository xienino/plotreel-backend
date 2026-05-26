const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/user/login/doLogin', authController.doLogin);
router.post('/user/resetPwd', authController.resetPwd);
router.post('/user/loginByVcode', authController.loginByVcode);
router.post('/vcode/sendVerifyCode', authController.sendVerifyCode);
router.post('/user/login/doLogout', authController.doLogout);
router.post('/user/getUser', authController.getUser);

module.exports = router;
