const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth');

/**
 * 图片上传路由
 *
 * 需要登录的路由：
 * - POST /api/upload/:type - 上传单个图片
 * - POST /api/upload/:type/multiple - 上传多个图片
 * - DELETE /api/upload/:type/:filename - 删除图片
 *
 * type: avatars（头像） 或 foods（美食图片）
 */

// 需要登录的路由
router.post('/:type', auth, uploadController.uploadSingle);
router.post('/:type/multiple', auth, uploadController.uploadMultiple);
router.delete('/:type/:filename', auth, uploadController.deleteImage);

module.exports = router;
