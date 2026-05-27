const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user.model');

const successMsg = [{ msgCode: '10001', msgText: '操作成功' }];
const verifyCodeStore = new Map();

const ok = (res, resData = {}, extra = {}) => res.json({
  ...extra,
  code: 200,
  resCode: 1,
  data: { resData },
  resData,
  resMsg: successMsg
});

const fail = (res, msgText, msgCode = '10002', code = 200) => res.status(code).json({
  code,
  resCode: 0,
  data: {},
  resData: null,
  resMsg: [{ msgCode, msgText }]
});

const asyncHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (error) {
    next(error);
  }
};

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, passwordHash) => {
  if (!password || !passwordHash || !passwordHash.includes(':')) return false;
  const [salt] = passwordHash.split(':');
  return hashPassword(password, salt) === passwordHash;
};

const createMtk = (user) => jwt.sign(
  {
    userId: user.id,
    account: user.mobile_no || user.username,
    sysId: user.sys_id || 'pnt'
  },
  config.tokenSecret || 'plotreel_dev_secret',
  { expiresIn: '30d' }
);

const normalizeMobile = (value) => String(value || '').trim();

const getVerifyRecord = ({ uuid, mobileNo, scene }) => {
  const record = verifyCodeStore.get(uuid);
  if (!record) return null;
  if (record.expiresAt < Date.now()) {
    verifyCodeStore.delete(uuid);
    return null;
  }
  if (record.mobileNo !== mobileNo) return null;
  if (scene && record.scene !== scene) return null;
  return record;
};

const getVerifyRecordByMobile = ({ mobileNo, scene }) => {
  for (const [uuid, record] of verifyCodeStore.entries()) {
    if (record.expiresAt < Date.now()) {
      verifyCodeStore.delete(uuid);
      continue;
    }
    if (record.mobileNo !== mobileNo) continue;
    if (scene && record.scene !== scene) continue;
    return { uuid, record };
  }
  return null;
};

exports.sendVerifyCode = asyncHandler(async (req, res) => {
  const mobileNo = normalizeMobile(req.body?.mobileNo);
  const scene = req.body?.scene || 'login';

  if (!mobileNo) return fail(res, '请输入手机号', '10004');

  const uuid = crypto.randomUUID();
  const verifyCode = '123456';
  verifyCodeStore.set(uuid, {
    mobileNo,
    scene,
    verifyCode,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  return ok(res, {
    uuid,
    // 开发联调用；真实短信接入后删除该字段。
    verifyCode
  });
});

exports.autoLogin = asyncHandler(async (req, res) => {
  const mobileNo = normalizeMobile(req.body?.mobileNo);
  const loginPwd = req.body?.loginPwd;
  const flagSrc = req.body?.flagSrc || '0';

  if (!mobileNo) return fail(res, '请输入手机号', '10004');
  if (!loginPwd) return fail(res, '请输入密码', '10004');

  await User.ensureTable();

  let user = await User.findByMobile(mobileNo);
  const passwordHash = hashPassword(loginPwd);

  if (!user) {
    user = await User.create({
      username: mobileNo,
      mobileNo,
      passwordHash,
      flagSrc,
      sysId: 'pnt'
    });
  } else if (!verifyPassword(loginPwd, user.password_hash)) {
    return fail(res, '用户已存在，请使用密码登录', '10002');
  }

  const mtk = createMtk(user);
  await User.updatePasswordAndToken(user.id, { passwordHash, token: mtk });

  return ok(res, {
    mtk,
    account: mobileNo,
    userId: user.id
  });
});

exports.doLogin = asyncHandler(async (req, res) => {
  const account = normalizeMobile(req.body?.account);
  const pwd = req.body?.pwd;

  if (!account) return fail(res, '请输入账号', '10004');
  if (!pwd) return fail(res, '请输入密码', '10004');

  await User.ensureTable();
  const user = await User.findByAccount(account);
  if (!user) {
    return ok(res, { autoLogin: true });
  }

  if (!verifyPassword(pwd, user.password_hash)) {
    return fail(res, '账号或密码错误', '10002');
  }

  const mtk = createMtk(user);
  await User.updateToken(user.id, mtk);

  return ok(res, {
    mtk,
    account,
    userId: user.id
  });
});

exports.loginByVcode = asyncHandler(async (req, res) => {
  const account = normalizeMobile(req.body?.account);
  const uuid = req.body?.uuid;
  const vcode = req.body?.vcode;

  if (!account) return fail(res, '请输入手机号', '10004');
  if (!uuid || !vcode) return fail(res, '请输入验证码', '10004');

  const verifyRecord = getVerifyRecord({ uuid, mobileNo: account, scene: 'login' });
  if (!verifyRecord || verifyRecord.verifyCode !== String(vcode)) {
    return fail(res, '验证码错误或已过期', '10004');
  }

  await User.ensureTable();
  const user = await User.findByMobile(account);
  if (!user) {
    return ok(res, { autoLogin: true });
  }

  const mtk = createMtk(user);
  await User.updateToken(user.id, mtk);
  verifyCodeStore.delete(uuid);

  return ok(res, {
    mtk,
    account,
    userId: user.id
  });
});

exports.resetPwd = asyncHandler(async (req, res) => {
  const mobileNo = normalizeMobile(req.body?.mobileNo);
  const verifyCode = req.body?.verifyCode;
  const pwd = req.body?.pwd;

  if (!mobileNo) return fail(res, '请输入手机号', '10004');
  if (!verifyCode) return fail(res, '请输入验证码', '10004');
  if (!pwd) return fail(res, '请输入新密码', '10004');

  const verifyRecord = getVerifyRecordByMobile({ mobileNo, scene: 'reset' });
  if (!verifyRecord || verifyRecord.record.verifyCode !== String(verifyCode)) {
    return fail(res, '验证码错误或已过期', '10004');
  }

  await User.ensureTable();
  const user = await User.findByMobile(mobileNo);
  if (!user) return fail(res, '用户不存在', '10002');

  const mtk = createMtk(user);
  await User.updatePasswordAndToken(user.id, {
    passwordHash: hashPassword(pwd),
    token: mtk
  });
  verifyCodeStore.delete(verifyRecord.uuid);

  return ok(res, {
    mtk,
    account: mobileNo,
    userId: user.id
  });
});

exports.getUser = asyncHandler(async (req, res) => {
  const account = normalizeMobile(req.body?.account || req.user?.account);
  if (!account) return fail(res, '请输入账号', '10004');

  await User.ensureTable();
  const user = await User.findByAccount(account);
  if (!user) return fail(res, '用户不存在', '10002');

  return ok(res, {
    id: user.id,
    account: user.mobile_no || user.username
  });
});

exports.doLogout = asyncHandler(async (req, res) => ok(res));
