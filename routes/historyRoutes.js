const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const auth = require('../middleware/auth');

/**
 * 历史记录路由
 *
 * 所有路由都需要登录
 */

// 获取浏览历史数量
router.get('/count', auth, historyController.getHistoryCount);

// 获取浏览历史
router.get('/', auth, historyController.getHistory);

// 添加浏览历史
router.post('/', auth, historyController.addHistory);

// 删除单条浏览历史
router.delete('/:id', auth, historyController.deleteHistory);

// 清空浏览历史
router.delete('/', auth, historyController.clearHistory);

module.exports = router;
