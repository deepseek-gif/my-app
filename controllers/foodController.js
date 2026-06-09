const Food = require('../models/Food');

// 最近推荐的分类记录（用于多样性计算）
const recentCategories = [];
const MAX_RECENT_CATEGORIES = 5;

// 获取所有食物
exports.getAllFoods = async (req, res) => {
  try {
    const { category, cuisine, taste, difficulty, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (cuisine) filter.cuisine = cuisine;
    if (taste) filter.taste = { $in: taste.split(',') };
    if (difficulty) filter.difficulty = difficulty;

    const foods = await Food.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Food.countDocuments(filter);

    res.json({
      success: true,
      data: foods,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 随机推荐食物
exports.getRandomFood = async (req, res) => {
  try {
    const { category, cuisine, taste } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (cuisine) filter.cuisine = cuisine;
    if (taste) filter.taste = { $in: taste.split(',') };

    const count = await Food.countDocuments(filter);
    if (count === 0) {
      return res.json({ success: true, data: null, message: '没有符合条件的食物' });
    }

    const random = Math.floor(Math.random() * count);
    const food = await Food.findOne(filter).skip(random);

    res.json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// AI智能随机推荐
exports.getAIRandomFood = async (req, res) => {
  try {
    const { category, cuisine } = req.query;

    // 构建筛选条件
    const filter = {};
    if (category && category !== '不限') filter.category = category;
    if (cuisine && cuisine !== '不限') filter.cuisine = cuisine;

    // 获取符合条件的食物总数
    const count = await Food.countDocuments(filter);

    if (count === 0) {
      return res.json({
        success: true,
        data: null,
        message: '没有符合条件的食物'
      });
    }

    // 随机选择一个食物
    const random = Math.floor(Math.random() * count);
    const food = await Food.findOne(filter).skip(random);

    if (!food) {
      return res.json({
        success: true,
        data: null,
        message: '没有符合条件的食物'
      });
    }

    // 生成简单的AI推荐理由
    const hour = new Date().getHours();
    let timeReason = '现在';
    if (hour >= 6 && hour < 10) timeReason = '早上';
    else if (hour >= 10 && hour < 14) timeReason = '中午';
    else if (hour >= 17 && hour < 21) timeReason = '晚上';

    const aiReason = `根据${timeReason}的时间，推荐这道${food.category}，口味${food.taste.join('、')}，${food.cookingTime}分钟即可完成`;

    res.json({
      success: true,
      data: {
        ...food.toObject(),
        aiReason
      }
    });
  } catch (error) {
    console.error('AI随机推荐错误:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 计算AI推荐得分
function calculateAIScore(food) {
  let score = 0;

  // 时间匹配（50%）
  score += getTimeMatchScore(food) * 0.5;

  // 多样性（30%）
  score += getDiversityScore(food) * 0.3;

  // 随机性（20%）
  score += Math.random() * 0.2;

  return score;
}

// 时间匹配得分
function getTimeMatchScore(food) {
  const hour = new Date().getHours();

  // 早餐时间：6-10点
  if (hour >= 6 && hour < 10) {
    return food.category === '早餐' ? 1 : 0.3;
  }

  // 午餐时间：10-14点
  if (hour >= 10 && hour < 14) {
    return food.category === '午餐' ? 1 : 0.3;
  }

  // 晚餐时间：17-21点
  if (hour >= 17 && hour < 21) {
    return food.category === '晚餐' ? 1 : 0.3;
  }

  // 其他时间：小吃、甜品、饮品
  return ['小吃', '甜品', '饮品'].includes(food.category) ? 1 : 0.5;
}

// 多样性得分：避免连续推荐相同分类的食物
function getDiversityScore(food) {
  if (recentCategories.length === 0) {
    return 0.8; // 没有历史记录时给较高分
  }

  // 如果该分类在最近推荐中出现过，降低分数
  const recentIndex = recentCategories.lastIndexOf(food.category);
  if (recentIndex !== -1) {
    // 越近的推荐惩罚越重：最近一次0.2，更早的0.4
    return recentIndex === recentCategories.length - 1 ? 0.2 : 0.4;
  }

  // 该分类未在最近推荐中出现，给高分
  return 0.8;
}

// 生成AI推荐理由
function generateAIReason(food) {
  const hour = new Date().getHours();
  let timeReason = '';

  if (hour >= 6 && hour < 10) {
    timeReason = '早上';
  } else if (hour >= 10 && hour < 14) {
    timeReason = '中午';
  } else if (hour >= 17 && hour < 21) {
    timeReason = '晚上';
  } else {
    timeReason = '现在';
  }

  let reason = `根据${timeReason}的时间，`;

  if (food.category === '早餐') {
    reason += '推荐这道营养丰富的早餐';
  } else if (food.category === '午餐') {
    reason += '推荐这道美味的午餐';
  } else if (food.category === '晚餐') {
    reason += '推荐这道丰盛的晚餐';
  } else {
    reason += `推荐这道${food.category}`;
  }

  if (food.taste.length > 0) {
    reason += `，口味${food.taste.join('、')}`;
  }

  reason += `，${food.cookingTime}分钟即可完成`;

  return reason;
}

// 获取单个食物
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: '食物不存在' });
    }
    res.json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 添加食物
exports.createFood = async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json({ success: true, data: food });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 更新食物
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!food) {
      return res.status(404).json({ success: false, message: '食物不存在' });
    }
    res.json({ success: true, data: food });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 删除食物
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: '食物不存在' });
    }
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 切换收藏状态
exports.toggleFavorite = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: '食物不存在' });
    }
    food.isFavorite = !food.isFavorite;
    await food.save();
    res.json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 获取收藏列表
exports.getFavorites = async (req, res) => {
  try {
    const foods = await Food.find({ isFavorite: true }).sort({ updatedAt: -1 });
    res.json({ success: true, data: foods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
