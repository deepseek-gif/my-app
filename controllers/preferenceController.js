const UserPreference = require('../models/UserPreference');

// 获取用户偏好
exports.getPreference = async (req, res) => {
  try {
    const preference = await UserPreference.findOne({ userId: req.params.userId });
    if (!preference) {
      return res.json({
        success: true,
        data: {
          favoriteCuisines: [],
          favoriteTastes: [],
          dislikedIngredients: [],
          dietaryRestrictions: ['无']
        }
      });
    }
    res.json({ success: true, data: preference });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 更新用户偏好
exports.updatePreference = async (req, res) => {
  try {
    const preference = await UserPreference.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: preference });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
