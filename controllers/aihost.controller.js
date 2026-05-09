exports.getMtk = async (req, res, next) => {
  try {
    // 示例返回数据
    const data = {
      resData: {
        password: 'example-password',
        account: 'example-account',
        mtk: '1111example-mtk'
      }
    };
    return res.json({ code: 200, data, resMsg: ['success'] });
  } catch (error) {
    next(error);
  }
};