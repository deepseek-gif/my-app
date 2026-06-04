const Food = require('../models/Food');

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
