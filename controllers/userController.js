const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * 生成 JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * 用户注册
 * POST /api/users/register
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('注册请求:', { username, email, password: '***' });

    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '请填写所有必填字段'
      });
    }

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: '用户名已被占用'
      });
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }

    // 创建新用户
    const user = new User({ username, email, password });
    await user.save();

    console.log('用户创建成功:', user._id);

    // 生成 Token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    console.error('注册错误详情:', error);
    console.error('错误名称:', error.name);
    console.error('错误消息:', error.message);

    // 处理验证错误
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    // 处理重复键错误
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field === 'username' ? '用户名' : '邮箱'}已被占用`
      });
    }

    res.status(500).json({
      success: false,
      message: '注册失败，请稍后重试',
      error: error.message // 临时添加，用于调试
    });
  }
};

/**
 * 用户登录
 * POST /api/users/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '请输入邮箱和密码'
      });
    }

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 生成 Token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '登录失败，请稍后重试'
    });
  }
};

/**
 * 获取当前用户信息
 * GET /api/users/profile
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    });
  }
};

/**
 * 更新用户信息
 * PUT /api/users/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { username, avatar, preferences } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 更新用户名（需要检查是否已被占用）
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: '用户名已被占用'
        });
      }
      user.username = username;
    }

    // 更新头像
    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    // 更新偏好设置
    if (preferences) {
      user.preferences = {
        ...user.preferences.toObject(),
        ...preferences
      };
    }

    await user.save();

    res.json({
      success: true,
      message: '更新成功',
      data: user
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: '更新失败，请稍后重试'
    });
  }
};

/**
 * 修改密码
 * PUT /api/users/password
 */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '请输入旧密码和新密码'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: '新密码至少6个字符'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 验证旧密码
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: '旧密码错误'
      });
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({
      success: false,
      message: '修改密码失败，请稍后重试'
    });
  }
};

/**
 * 退出登录（客户端处理，这里只是示例）
 * POST /api/users/logout
 */
exports.logout = async (req, res) => {
  try {
    // 实际上 JWT 是无状态的，退出登录主要在客户端处理
    // 这里可以添加 Token 黑名单逻辑（可选）
    res.json({
      success: true,
      message: '退出登录成功'
    });
  } catch (error) {
    console.error('退出登录错误:', error);
    res.status(500).json({
      success: false,
      message: '退出登录失败'
    });
  }
};
