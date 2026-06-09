const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Food = require('../models/Food');

async function cleanDuplicates() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ 已连接到数据库');

    // 获取所有食物
    const foods = await Food.find({});
    console.log(`📊 共有 ${foods.length} 条记录`);

    // 按名称分组，找出重复的
    const foodMap = new Map();
    const duplicates = [];

    foods.forEach(food => {
      if (foodMap.has(food.name)) {
        duplicates.push(food._id);
      } else {
        foodMap.set(food.name, food._id);
      }
    });

    console.log(`🔍 发现 ${duplicates.length} 条重复记录`);

    if (duplicates.length > 0) {
      // 删除重复记录
      await Food.deleteMany({ _id: { $in: duplicates } });
      console.log('✅ 已删除重复记录');
    }

    // 验证结果
    const remaining = await Food.countDocuments();
    console.log(`📊 清理后剩余 ${remaining} 条记录`);

    await mongoose.disconnect();
    console.log('✅ 完成！');
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

cleanDuplicates();
