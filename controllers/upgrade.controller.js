exports.checkLast = async (req, res, next) => {
  try {
    // 这里返回的示例数据和你需求里定义的一致
    const data = {
      resData: {
        remark: true,
        upgradeType: false
      }
    };
    debugger
    return res.json({ code: 200, data, resMsg: ['success'] });
  } catch (error) {
    next(error);
  }
};