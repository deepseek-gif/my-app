const Recipe = require('../models/Recipe');

/**
 * 获取菜谱列表
 * GET /api/recipes?page=1&limit=20&foodId=xxx
 */
exports.getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { foodId, difficulty } = req.query;

    // 构建查询条件
    const query = {};
    if (foodId) query.food = foodId;
    if (difficulty) query.difficulty = difficulty;

    // 查询总数
    const total = await Recipe.countDocuments(query);

    // 查询菜谱
    const recipes = await Recipe.find(query)
      .populate('food')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: {
        recipes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取菜谱列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取菜谱列表失败'
    });
  }
};

/**
 * 获取单个菜谱
 * GET /api/recipes/:id
 */
exports.getRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id).populate('food');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: '菜谱不存在'
      });
    }

    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('获取菜谱错误:', error);
    res.status(500).json({
      success: false,
      message: '获取菜谱失败'
    });
  }
};

/**
 * 创建菜谱
 * POST /api/recipes
 */
exports.createRecipe = async (req, res) => {
  try {
    const recipeData = req.body;

    const recipe = new Recipe(recipeData);
    await recipe.save();

    res.status(201).json({
      success: true,
      message: '菜谱创建成功',
      data: recipe
    });
  } catch (error) {
    console.error('创建菜谱错误:', error);
    res.status(500).json({
      success: false,
      message: '创建菜谱失败'
    });
  }
};

/**
 * 更新菜谱
 * PUT /api/recipes/:id
 */
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const recipe = await Recipe.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: '菜谱不存在'
      });
    }

    res.json({
      success: true,
      message: '菜谱更新成功',
      data: recipe
    });
  } catch (error) {
    console.error('更新菜谱错误:', error);
    res.status(500).json({
      success: false,
      message: '更新菜谱失败'
    });
  }
};

/**
 * 删除菜谱
 * DELETE /api/recipes/:id
 */
exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: '菜谱不存在'
      });
    }

    res.json({
      success: true,
      message: '菜谱删除成功'
    });
  } catch (error) {
    console.error('删除菜谱错误:', error);
    res.status(500).json({
      success: false,
      message: '删除菜谱失败'
    });
  }
};

/**
 * 根据美食ID获取菜谱
 * GET /api/recipes/food/:foodId
 */
exports.getRecipesByFood = async (req, res) => {
  try {
    const { foodId } = req.params;

    const recipes = await Recipe.find({ food: foodId })
      .populate('food')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: recipes
    });
  } catch (error) {
    console.error('获取菜谱错误:', error);
    res.status(500).json({
      success: false,
      message: '获取菜谱失败'
    });
  }
};
