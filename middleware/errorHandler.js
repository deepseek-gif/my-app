const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Mongoose 重复键错误
  if (err.code === 11000) {
    statusCode = 400;
    message = '数据已存在';
  }

  // Mongoose 无效ID
  if (err.name === 'CastError') {
    statusCode = 400;
    message = '无效的ID格式';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
