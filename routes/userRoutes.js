const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

/**
 * 用户路由
 *
 * 公开路由（无需登录）：
 * - POST /api/users/register - 用户注册
 * - POST /api/users/login - 用户登录
 *
 * 需要登录的路由：
 * - GET /api/users/profile - 获取用户信息
 * - PUT /api/users/profile - 更新用户信息
 * - PUT /api/users/password - 修改密码
 * - POST /api/users/logout - 退出登录
 */

// 公开路由
router.post('/register', userController.register);
router.post('/login', userController.login);

// 需要登录的路由
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.put('/password', auth, userController.changePassword);
router.post('/logout', auth, userController.logout);

module.exports = router;
