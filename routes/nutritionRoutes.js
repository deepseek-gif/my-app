const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');
const auth = require('../middleware/auth');

/**
 * 营养分析路由
 *
 * 公开路由：
 * - GET /api/nutrition - 获取营养数据列表
 * - GET /api/nutrition/:id - 获取单个营养数据
 * - GET /api/nutrition/food/:foodId - 根据美食ID获取营养数据
 * - GET /api/nutrition/analysis/:foodId - 获取营养分析报告
 *
 * 需要登录的路由：
 * - POST /api/nutrition - 创建营养数据
 * - PUT /api/nutrition/:id - 更新营养数据
 * - DELETE /api/nutrition/:id - 删除营养数据
 */

// 公开路由
router.get('/', nutritionController.getNutritionList);
router.get('/food/:foodId', nutritionController.getNutritionByFood);
router.get('/analysis/:foodId', nutritionController.getNutritionAnalysis);
router.get('/:id', nutritionController.getNutrition);

// 需要登录的路由
router.post('/', auth, nutritionController.createNutrition);
router.put('/:id', auth, nutritionController.updateNutrition);
router.delete('/:id', auth, nutritionController.deleteNutrition);

module.exports = router;
