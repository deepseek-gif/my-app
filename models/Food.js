const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '请输入菜品名称'],
    trim: true,
    maxlength: [50, '名称不能超过50个字符']
  },
  category: {
    type: String,
    required: [true, '请选择分类'],
    enum: ['早餐', '午餐', '晚餐', '小吃', '甜品', '饮品']
  },
  cuisine: {
    type: String,
    required: [true, '请选择菜系'],
    enum: ['中餐', '西餐', '日料', '韩餐', '东南亚', '其他']
  },
  taste: {
    type: [String],
    enum: ['辣', '甜', '酸', '咸', '清淡', '麻辣', '鲜香']
  },
  ingredients: {
    type: [String],
    default: []
  },
  cookingTime: {
    type: Number, // 分钟
    default: 30
  },
  difficulty: {
    type: String,
    enum: ['简单', '中等', '困难'],
    default: '中等'
  },
  description: {
    type: String,
    maxlength: [500, '描述不能超过500个字符']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  }
}, {
  timestamps: true
});

// 索引优化
foodSchema.index({ category: 1, cuisine: 1 });
foodSchema.index({ name: 'text' });

module.exports = mongoose.model('Food', foodSchema);
