const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Nutrition = require('../models/Nutrition');
const Food = require('../models/Food');

dotenv.config();

// 营养数据（每100克）
const nutritionData = [
  {
    foodName: '番茄炒蛋',
    per100g: {
      calories: 120,
      protein: 8.5,
      fat: 7.2,
      carbohydrates: 6.8,
      fiber: 1.2,
      sugar: 3.5,
      sodium: 350,
      cholesterol: 185
    },
    vitamins: {
      vitaminA: 120,
      vitaminC: 15,
      vitaminD: 0.5,
      vitaminE: 2.8,
      vitaminK: 8
    },
    minerals: {
      calcium: 45,
      iron: 1.8,
      potassium: 220,
      magnesium: 18,
      zinc: 1.2
    },
    healthRating: 4,
    healthTips: '番茄富含番茄红素，鸡蛋提供优质蛋白质，是营养均衡的家常菜。',
    suitableFor: ['一般人群', '儿童', '老人'],
    notSuitableFor: ['高胆固醇人群']
  },
  {
    foodName: '红烧肉',
    per100g: {
      calories: 380,
      protein: 15.2,
      fat: 32.5,
      carbohydrates: 8.5,
      fiber: 0.2,
      sugar: 4.2,
      sodium: 580,
      cholesterol: 95
    },
    vitamins: {
      vitaminA: 15,
      vitaminC: 1,
      vitaminD: 0.2,
      vitaminE: 1.5,
      vitaminK: 2
    },
    minerals: {
      calcium: 12,
      iron: 2.1,
      potassium: 180,
      magnesium: 15,
      zinc: 3.2
    },
    healthRating: 2,
    healthTips: '红烧肉脂肪含量较高，建议适量食用，搭配蔬菜一起吃更健康。',
    suitableFor: ['需要补充能量的人群'],
    notSuitableFor: ['高血压', '高血脂', '肥胖人群']
  },
  {
    foodName: '宫保鸡丁',
    per100g: {
      calories: 185,
      protein: 18.5,
      fat: 9.8,
      carbohydrates: 8.2,
      fiber: 1.5,
      sugar: 2.8,
      sodium: 620,
      cholesterol: 75
    },
    vitamins: {
      vitaminA: 25,
      vitaminC: 8,
      vitaminD: 0.1,
      vitaminE: 3.2,
      vitaminK: 5
    },
    minerals: {
      calcium: 28,
      iron: 1.5,
      potassium: 250,
      magnesium: 22,
      zinc: 1.8
    },
    healthRating: 3,
    healthTips: '鸡肉是优质蛋白质来源，花生米富含不饱和脂肪酸，但辣椒较多，胃不好的人少吃。',
    suitableFor: ['一般人群', '健身人群'],
    notSuitableFor: ['胃病患者', '痔疮患者']
  },
  {
    foodName: '清蒸鱼',
    per100g: {
      calories: 105,
      protein: 18.2,
      fat: 3.2,
      carbohydrates: 0.5,
      fiber: 0,
      sugar: 0.2,
      sodium: 280,
      cholesterol: 65
    },
    vitamins: {
      vitaminA: 35,
      vitaminC: 2,
      vitaminD: 4.5,
      vitaminE: 1.8,
      vitaminK: 0.5
    },
    minerals: {
      calcium: 45,
      iron: 0.8,
      potassium: 320,
      magnesium: 28,
      zinc: 0.5
    },
    healthRating: 5,
    healthTips: '清蒸鱼是低脂高蛋白的健康食品，富含Omega-3脂肪酸，适合所有人群。',
    suitableFor: ['所有人群', '减肥人群', '老人', '儿童'],
    notSuitableFor: ['鱼类过敏者']
  },
  {
    foodName: '酸辣土豆丝',
    per100g: {
      calories: 95,
      protein: 2.2,
      fat: 5.5,
      carbohydrates: 10.8,
      fiber: 1.8,
      sugar: 1.5,
      sodium: 420,
      cholesterol: 0
    },
    vitamins: {
      vitaminA: 5,
      vitaminC: 12,
      vitaminD: 0,
      vitaminE: 0.8,
      vitaminK: 2
    },
    minerals: {
      calcium: 15,
      iron: 0.6,
      potassium: 280,
      magnesium: 18,
      zinc: 0.3
    },
    healthRating: 3,
    healthTips: '土豆是优质碳水化合物来源，但酸辣口味刺激性较强，胃不好的人少吃。',
    suitableFor: ['一般人群'],
    notSuitableFor: ['胃病患者', '胃酸过多者']
  },
  {
    foodName: '宫保鸡丁',
    per100g: {
      calories: 185,
      protein: 18.5,
      fat: 9.8,
      carbohydrates: 8.2,
      fiber: 1.5,
      sugar: 2.8,
      sodium: 620,
      cholesterol: 75
    },
    vitamins: {
      vitaminA: 25,
      vitaminC: 8,
      vitaminD: 0.1,
      vitaminE: 3.2,
      vitaminK: 5
    },
    minerals: {
      calcium: 28,
      iron: 1.5,
      potassium: 250,
      magnesium: 22,
      zinc: 1.8
    },
    healthRating: 3,
    healthTips: '鸡肉是优质蛋白质来源，花生米富含不饱和脂肪酸，但辣椒较多，胃不好的人少吃。',
    suitableFor: ['一般人群', '健身人群'],
    notSuitableFor: ['胃病患者', '痔疮患者']
  }
];

async function seedNutrition() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meishi');
    console.log('数据库已连接');

    // 清空旧数据
    await Nutrition.deleteMany({});
    console.log('已清空旧营养数据');

    // 获取所有美食
    const foods = await Food.find({});
    console.log(`找到 ${foods.length} 个美食`);

    // 创建美食名称到ID的映射
    const foodMap = {};
    foods.forEach(food => {
      foodMap[food.name] = food._id;
    });

    // 插入营养数据
    let insertedCount = 0;
    const insertedFoods = new Set();
    for (const data of nutritionData) {
      // 避免重复插入同一美食的营养数据
      if (insertedFoods.has(data.foodName)) {
        continue;
      }

      const foodId = foodMap[data.foodName];
      if (!foodId) {
        console.log(`未找到美食: ${data.foodName}`);
        continue;
      }

      const nutrition = new Nutrition({
        food: foodId,
        per100g: data.per100g,
        vitamins: data.vitamins,
        minerals: data.minerals,
        healthRating: data.healthRating,
        healthTips: data.healthTips,
        suitableFor: data.suitableFor,
        notSuitableFor: data.notSuitableFor
      });

      await nutrition.save();
      insertedFoods.add(data.foodName);
      insertedCount++;
      console.log(`已添加营养数据: ${data.foodName}`);
    }

    console.log(`\n成功插入 ${insertedCount} 条营养数据`);

    // 关闭连接
    await mongoose.connection.close();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('插入营养数据失败:', error);
    process.exit(1);
  }
}

// 运行脚本
seedNutrition();
