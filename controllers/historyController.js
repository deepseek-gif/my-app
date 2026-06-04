const History = require('../models/History');

/**
 * 添加浏览历史
 * POST /api/history
 */
exports.addHistory = async (req, res) => {
  try {
    const { foodId } = req.body;
    const userId = req.userId;

    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: '请提供美食ID'
      });
    }

    // 检查是否已存在（最近24小时内）
    const existingHistory = await History.findOne({
      user: userId,
      food: foodId,
      viewedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (existingHistory) {
      // 更新浏览时间
      existingHistory.viewedAt = new Date();
      await existingHistory.save();

      return res.json({
        success: true,
        message: '浏览历史已更新',
        data: existingHistory
      });
    }

    // 创建新的浏览记录
    const history = new History({
      user: userId,
      food: foodId
    });

    await history.save();

    res.status(201).json({
      success: true,
      message: '浏览历史已记录',
      data: history
    });
  } catch (error) {
    console.error('添加浏览历史错误:', error);
    res.status(500).json({
      success: false,
      message: '添加浏览历史失败'
    });
  }
};

/**
 * 获取浏览历史
 * GET /api/history?page=1&limit=20
 */
exports.getHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // 查询总数
    const total = await History.countDocuments({ user: userId });

    // 查询历史记录
    const history = await History.find({ user: userId })
      .populate('food')
      .sort({ viewedAt: -1 })
      .skip(skip)
      .limit(limit);

    // 过滤掉已删除的美食
    const validHistory = history.filter(item => item.food !== null);

    res.json({
      success: true,
      data: {
        history: validHistory,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取浏览历史错误:', error);
    res.status(500).json({
      success: false,
      message: '获取浏览历史失败'
    });
  }
};

/**
 * 删除单条浏览历史
 * DELETE /api/history/:id
 */
exports.deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const history = await History.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: '浏览历史不存在'
      });
    }

    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除浏览历史错误:', error);
    res.status(500).json({
      success: false,
      message: '删除浏览历史失败'
    });
  }
};

/**
 * 清空浏览历史
 * DELETE /api/history
 */
exports.clearHistory = async (req, res) => {
  try {
    const userId = req.userId;

    await History.deleteMany({ user: userId });

    res.json({
      success: true,
      message: '浏览历史已清空'
    });
  } catch (error) {
    console.error('清空浏览历史错误:', error);
    res.status(500).json({
      success: false,
      message: '清空浏览历史失败'
    });
  }
};

/**
 * 获取浏览历史数量
 * GET /api/history/count
 */
exports.getHistoryCount = async (req, res) => {
  try {
    const userId = req.userId;
    const count = await History.countDocuments({ user: userId });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('获取浏览历史数量错误:', error);
    res.status(500).json({
      success: false,
      message: '获取浏览历史数量失败'
    });
  }
};
