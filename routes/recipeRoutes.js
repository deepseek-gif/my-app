const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');

/**
 * 菜谱路由
 *
 * 公开路由：
 * - GET /api/recipes - 获取菜谱列表
 * - GET /api/recipes/:id - 获取单个菜谱
 * - GET /api/recipes/food/:foodId - 根据美食ID获取菜谱
 *
 * 需要登录的路由：
 * - POST /api/recipes - 创建菜谱
 * - PUT /api/recipes/:id - 更新菜谱
 * - DELETE /api/recipes/:id - 删除菜谱
 */

// 公开路由
router.get('/', recipeController.getRecipes);
router.get('/food/:foodId', recipeController.getRecipesByFood);
router.get('/:id', recipeController.getRecipe);

// 需要登录的路由
router.post('/', auth, recipeController.createRecipe);
router.put('/:id', auth, recipeController.updateRecipe);
router.delete('/:id', auth, recipeController.deleteRecipe);

module.exports = router;
