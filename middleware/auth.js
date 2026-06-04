const jwt = require('jsonwebtoken');

/**
 * JWT 鉴权中间件
 * 验证请求中的 Token，并将用户 ID 添加到 req.userId
 */
const auth = async (req, res, next) => {
  try {
    // 从请求头获取 Token
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未登录，请先登录'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未登录，请先登录'
      });
    }

    // 验证 Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 将用户 ID 添加到请求对象
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token 无效，请重新登录'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token 已过期，请重新登录'
      });
    }

    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

module.exports = auth;
