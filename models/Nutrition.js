const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  // 每100克的营养成分
  per100g: {
    calories: {
      type: Number, // 千卡
      default: 0
    },
    protein: {
      type: Number, // 克
      default: 0
    },
    fat: {
      type: Number, // 克
      default: 0
    },
    carbohydrates: {
      type: Number, // 克
      default: 0
    },
    fiber: {
      type: Number, // 克
      default: 0
    },
    sugar: {
      type: Number, // 克
      default: 0
    },
    sodium: {
      type: Number, // 毫克
      default: 0
    },
    cholesterol: {
      type: Number, // 毫克
      default: 0
    }
  },
  // 维生素
  vitamins: {
    vitaminA: {
      type: Number, // 微克
      default: 0
    },
    vitaminC: {
      type: Number, // 毫克
      default: 0
    },
    vitaminD: {
      type: Number, // 微克
      default: 0
    },
    vitaminE: {
      type: Number, // 毫克
      default: 0
    },
    vitaminK: {
      type: Number, // 微克
      default: 0
    }
  },
  // 矿物质
  minerals: {
    calcium: {
      type: Number, // 毫克
      default: 0
    },
    iron: {
      type: Number, // 毫克
      default: 0
    },
    potassium: {
      type: Number, // 毫克
      default: 0
    },
    magnesium: {
      type: Number, // 毫克
      default: 0
    },
    zinc: {
      type: Number, // 毫克
      default: 0
    }
  },
  // 健康评级
  healthRating: {
    type: Number, // 1-5星
    min: 1,
    max: 5,
    default: 3
  },
  // 健康建议
  healthTips: {
    type: String,
    default: ''
  },
  // 适合人群
  suitableFor: [{
    type: String
  }],
  // 不适合人群
  notSuitableFor: [{
    type: String
  }],
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
nutritionSchema.pre('save', function() {
  this.updatedAt = new Date();
});

module.exports = mongoose.model('Nutrition', nutritionSchema);
