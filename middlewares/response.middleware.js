// 统一响应格式中间件
// 将所有响应统一格式化为 { code, data, resMsg } 结构，方便前端处理
// code: 200 表示成功，其他值表示错误
// data: 具体的响应数据
// resMsg: 错误信息数组，成功时为空数组
module.exports = (req, res, next) => {
  const originalJson = res.json.bind(res);

  // 覆盖 res.json，统一返回格式
  res.json = (payload = {}) => {
    const code = payload.code ?? (payload.resCode === 1 ? 200 : payload.resCode) ?? 200;
    const resCode = payload.resCode ?? (code === 200 ? 1 : 0);
    const data = payload.data ?? (payload.resData !== undefined ? { resData: payload.resData } : {});
    const resData = payload.resData ?? data.resData ?? data;
    const {
      code: _code,
      resCode: _resCode,
      data: _data,
      resData: _resData,
      resMsg: _resMsg,
      ...extra
    } = payload;
    const response = {
      ...extra,
      code,
      resCode,
      data,
      resData,
      resMsg: payload.resMsg ?? []
    };
    // 待改为：{
    //   "code": 200,          // 业务状态码：自定义的业务逻辑结果（非HTTP状态码）
    //   "data": { ... },      // 数据体：真正需要的数据，可以是对象、数组或null
    //   "message": "success", // 描述信息：提示说明，如错误信息、成功提示
    //   "timestamp": 1678888888 // 响应时间戳 可有可无
    // }
    return originalJson(response);
  };

  next();
};
