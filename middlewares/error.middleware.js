module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    code: err.code || 500,
    data: {},
    resMsg: [err.message || 'Internal Server Error']
  });
};