const Nutrition = require('../models/Nutrition');

/**
 * 获取营养数据列表
 * GET /api/nutrition?page=1&limit=20&foodId=xxx
 */
exports.getNutritionList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { foodId } = req.query;

    // 构建查询条件
    const query = {};
    if (foodId) query.food = foodId;

    // 查询总数
    const total = await Nutrition.countDocuments(query);

    // 查询营养数据
    const nutritionList = await Nutrition.find(query)
      .populate('food')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: {
        nutrition: nutritionList,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取营养数据列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取营养数据列表失败'
    });
  }
};

/**
 * 获取单个营养数据
 * GET /api/nutrition/:id
 */
exports.getNutrition = async (req, res) => {
  try {
    const { id } = req.params;

    const nutrition = await Nutrition.findById(id).populate('food');

    if (!nutrition) {
      return res.status(404).json({
        success: false,
        message: '营养数据不存在'
      });
    }

    res.json({
      success: true,
      data: nutrition
    });
  } catch (error) {
    console.error('获取营养数据错误:', error);
    res.status(500).json({
      success: false,
      message: '获取营养数据失败'
    });
  }
};

/**
 * 根据美食ID获取营养数据
 * GET /api/nutrition/food/:foodId
 */
exports.getNutritionByFood = async (req, res) => {
  try {
    const { foodId } = req.params;

    const nutrition = await Nutrition.findOne({ food: foodId }).populate('food');

    if (!nutrition) {
      return res.status(404).json({
        success: false,
        message: '该美食的营养数据不存在'
      });
    }

    res.json({
      success: true,
      data: nutrition
    });
  } catch (error) {
    console.error('获取营养数据错误:', error);
    res.status(500).json({
      success: false,
      message: '获取营养数据失败'
    });
  }
};

/**
 * 创建营养数据
 * POST /api/nutrition
 */
exports.createNutrition = async (req, res) => {
  try {
    const nutritionData = req.body;

    // 检查是否已存在
    const existingNutrition = await Nutrition.findOne({ food: nutritionData.food });
    if (existingNutrition) {
      return res.status(400).json({
        success: false,
        message: '该美食的营养数据已存在'
      });
    }

    const nutrition = new Nutrition(nutritionData);
    await nutrition.save();

    res.status(201).json({
      success: true,
      message: '营养数据创建成功',
      data: nutrition
    });
  } catch (error) {
    console.error('创建营养数据错误:', error);
    res.status(500).json({
      success: false,
      message: '创建营养数据失败'
    });
  }
};

/**
 * 更新营养数据
 * PUT /api/nutrition/:id
 */
exports.updateNutrition = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const nutrition = await Nutrition.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!nutrition) {
      return res.status(404).json({
        success: false,
        message: '营养数据不存在'
      });
    }

    res.json({
      success: true,
      message: '营养数据更新成功',
      data: nutrition
    });
  } catch (error) {
    console.error('更新营养数据错误:', error);
    res.status(500).json({
      success: false,
      message: '更新营养数据失败'
    });
  }
};

/**
 * 删除营养数据
 * DELETE /api/nutrition/:id
 */
exports.deleteNutrition = async (req, res) => {
  try {
    const { id } = req.params;

    const nutrition = await Nutrition.findByIdAndDelete(id);

    if (!nutrition) {
      return res.status(404).json({
        success: false,
        message: '营养数据不存在'
      });
    }

    res.json({
      success: true,
      message: '营养数据删除成功'
    });
  } catch (error) {
    console.error('删除营养数据错误:', error);
    res.status(500).json({
      success: false,
      message: '删除营养数据失败'
    });
  }
};

/**
 * 获取营养分析报告
 * GET /api/nutrition/analysis/:foodId
 */
exports.getNutritionAnalysis = async (req, res) => {
  try {
    const { foodId } = req.params;

    const nutrition = await Nutrition.findOne({ food: foodId }).populate('food');

    if (!nutrition) {
      return res.status(404).json({
        success: false,
        message: '该美食的营养数据不存在'
      });
    }

    // 生成营养分析报告
    const analysis = generateAnalysis(nutrition);

    res.json({
      success: true,
      data: {
        nutrition,
        analysis
      }
    });
  } catch (error) {
    console.error('获取营养分析错误:', error);
    res.status(500).json({
      success: false,
      message: '获取营养分析失败'
    });
  }
};

/**
 * 生成营养分析报告
 */
function generateAnalysis(nutrition) {
  const { per100g, vitamins, minerals, healthRating } = nutrition;

  // 计算营养占比
  const totalMacro = per100g.protein + per100g.fat + per100g.carbohydrates;
  const proteinRatio = totalMacro > 0 ? (per100g.protein / totalMacro * 100).toFixed(1) : 0;
  const fatRatio = totalMacro > 0 ? (per100g.fat / totalMacro * 100).toFixed(1) : 0;
  const carbRatio = totalMacro > 0 ? (per100g.carbohydrates / totalMacro * 100).toFixed(1) : 0;

  // 生成建议
  const suggestions = [];

  if (per100g.calories > 300) {
    suggestions.push('热量较高，建议适量食用');
  } else if (per100g.calories < 100) {
    suggestions.push('热量较低，适合减肥期间食用');
  }

  if (per100g.protein > 20) {
    suggestions.push('蛋白质丰富，适合健身人群');
  }

  if (per100g.fiber > 5) {
    suggestions.push('膳食纤维丰富，有助于消化');
  }

  if (per100g.sodium > 500) {
    suggestions.push('钠含量较高，高血压人群需注意');
  }

  if (per100g.sugar > 15) {
    suggestions.push('糖分较高，糖尿病人群需注意');
  }

  // 生成营养等级
  let nutritionLevel = '中等';
  if (healthRating >= 4) {
    nutritionLevel = '优秀';
  } else if (healthRating >= 3) {
    nutritionLevel = '良好';
  } else if (healthRating <= 2) {
    nutritionLevel = '一般';
  }

  return {
    macroRatio: {
      protein: proteinRatio,
      fat: fatRatio,
      carbohydrates: carbRatio
    },
    nutritionLevel,
    suggestions,
    summary: `该食物每100克含${per100g.calories}千卡热量，${per100g.protein}克蛋白质，${per100g.fat}克脂肪，${per100g.carbohydrates}克碳水化合物。`
  };
}
