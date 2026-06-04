const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  favoriteCuisines: {
    type: [String],
    enum: ['中餐', '西餐', '日料', '韩餐', '东南亚', '其他'],
    default: []
  },
  favoriteTastes: {
    type: [String],
    enum: ['辣', '甜', '酸', '咸', '清淡', '麻辣', '鲜香'],
    default: []
  },
  dislikedIngredients: {
    type: [String],
    default: []
  },
  dietaryRestrictions: {
    type: [String],
    enum: ['无', '素食', '清真', '无麸质', '低卡'],
    default: ['无']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);
