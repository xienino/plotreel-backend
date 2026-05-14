exports.checkLast = async (req, res, next) => {
  try {
    // 这里返回的示例数据和你需求里定义的一致
    const resData = {
      version: '1.0.0',
      packageUrl: '',
      remark: true,
      upgradeType: false
    };
    return res.json({ code: 200, resCode: 1, data: { resData }, resData, resMsg: ['success'] });
  } catch (error) {
    next(error);
  }
};
