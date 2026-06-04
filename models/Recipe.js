const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  title: {
    type: String,
    required: [true, '菜谱标题不能为空'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      default: ''
    }
  }],
  steps: [{
    step: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    duration: {
      type: Number, // 分钟
      default: 0
    }
  }],
  cookingTime: {
    type: Number, // 分钟
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['简单', '中等', '困难'],
    default: '中等'
  },
  servings: {
    type: Number,
    default: 1
  },
  tips: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新时自动更新 updatedAt
recipeSchema.pre('save', function() {
  this.updatedAt = new Date();
});

module.exports = mongoose.model('Recipe', recipeSchema);
