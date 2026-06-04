const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('../models/Food');

dotenv.config();

const seedFoods = [
  // 早餐
  { name: '豆浆油条', category: '早餐', cuisine: '中餐', taste: ['清淡'], cookingTime: 15, difficulty: '简单', description: '经典中式早餐，豆浆配上刚炸好的油条' },
  { name: '煎蛋三明治', category: '早餐', cuisine: '西餐', taste: ['咸'], cookingTime: 10, difficulty: '简单', description: '快手早餐，面包夹煎蛋和蔬菜' },
  { name: '小笼包', category: '早餐', cuisine: '中餐', taste: ['鲜香'], cookingTime: 30, difficulty: '中等', description: '皮薄汁多的上海小笼包' },
  { name: '日式饭团', category: '早餐', cuisine: '日料', taste: ['清淡', '鲜香'], cookingTime: 15, difficulty: '简单', description: '简单美味的日式饭团' },

  // 午餐
  { name: '番茄炒蛋', category: '午餐', cuisine: '中餐', taste: ['酸', '甜'], cookingTime: 15, difficulty: '简单', description: '家常菜经典，酸甜可口' },
  { name: '宫保鸡丁', category: '午餐', cuisine: '中餐', taste: ['辣', '鲜香'], cookingTime: 25, difficulty: '中等', description: '川菜经典，花生配鸡肉' },
  { name: '意大利面', category: '午餐', cuisine: '西餐', taste: ['酸', '咸'], cookingTime: 20, difficulty: '简单', description: '番茄肉酱意大利面' },
  { name: '牛肉拉面', category: '午餐', cuisine: '中餐', taste: ['咸', '鲜香'], cookingTime: 40, difficulty: '困难', description: '兰州牛肉拉面，汤鲜面筋' },
  { name: '日式咖喱饭', category: '午餐', cuisine: '日料', taste: ['甜', '辣'], cookingTime: 35, difficulty: '中等', description: '浓郁咖喱配上软糯米饭' },
  { name: '韩式拌饭', category: '午餐', cuisine: '韩餐', taste: ['辣', '鲜香'], cookingTime: 30, difficulty: '中等', description: '石锅拌饭，蔬菜配辣酱' },

  // 晚餐
  { name: '红烧肉', category: '晚餐', cuisine: '中餐', taste: ['甜', '咸', '鲜香'], cookingTime: 60, difficulty: '中等', description: '肥而不腻，入口即化' },
  { name: '清蒸鲈鱼', category: '晚餐', cuisine: '中餐', taste: ['清淡', '鲜香'], cookingTime: 25, difficulty: '中等', description: '鲜美嫩滑，原汁原味' },
  { name: '牛排', category: '晚餐', cuisine: '西餐', taste: ['咸', '鲜香'], cookingTime: 20, difficulty: '中等', description: '五分熟黑椒牛排' },
  { name: '寿司拼盘', category: '晚餐', cuisine: '日料', taste: ['清淡', '鲜香'], cookingTime: 45, difficulty: '困难', description: '新鲜鱼生配醋饭' },
  { name: '麻辣火锅', category: '晚餐', cuisine: '中餐', taste: ['辣', '麻辣'], cookingTime: 60, difficulty: '简单', description: '冬天必吃，热辣过瘾' },
  { name: '冬阴功汤', category: '晚餐', cuisine: '东南亚', taste: ['酸', '辣'], cookingTime: 30, difficulty: '中等', description: '泰式酸辣虾汤' },

  // 小吃
  { name: '炸鸡翅', category: '小吃', cuisine: '西餐', taste: ['咸', '鲜香'], cookingTime: 25, difficulty: '简单', description: '外酥里嫩的炸鸡翅' },
  { name: '章鱼小丸子', category: '小吃', cuisine: '日料', taste: ['咸', '鲜香'], cookingTime: 20, difficulty: '中等', description: '日式街头小吃' },
  { name: '烤红薯', category: '小吃', cuisine: '中餐', taste: ['甜'], cookingTime: 40, difficulty: '简单', description: '冬天的甜蜜味道' },
  { name: '春卷', category: '小吃', cuisine: '中餐', taste: ['咸', '鲜香'], cookingTime: 30, difficulty: '中等', description: '酥脆可口的炸春卷' },

  // 甜品
  { name: '芒果糯米饭', category: '甜品', cuisine: '东南亚', taste: ['甜'], cookingTime: 30, difficulty: '简单', description: '泰式经典甜品' },
  { name: '提拉米苏', category: '甜品', cuisine: '西餐', taste: ['甜'], cookingTime: 45, difficulty: '中等', description: '意式经典甜品' },
  { name: '双皮奶', category: '甜品', cuisine: '中餐', taste: ['甜'], cookingTime: 20, difficulty: '中等', description: '顺德双皮奶，细腻顺滑' },
  { name: '铜锣烧', category: '甜品', cuisine: '日料', taste: ['甜'], cookingTime: 25, difficulty: '简单', description: '哆啦A梦最爱的点心' },

  // 饮品
  { name: '珍珠奶茶', category: '饮品', cuisine: '其他', taste: ['甜'], cookingTime: 15, difficulty: '简单', description: '经典台式奶茶' },
  { name: '柠檬蜂蜜水', category: '饮品', cuisine: '其他', taste: ['酸', '甜'], cookingTime: 5, difficulty: '简单', description: '清爽解渴' },
  { name: '抹茶拿铁', category: '饮品', cuisine: '日料', taste: ['甜', '清淡'], cookingTime: 10, difficulty: '简单', description: '日式抹茶配牛奶' },
  { name: '杨枝甘露', category: '饮品', cuisine: '中餐', taste: ['甜', '酸'], cookingTime: 20, difficulty: '中等', description: '港式经典甜品饮品' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('数据库已连接');

    // 清空现有数据
    await Food.deleteMany({});
    console.log('已清空旧数据');

    // 插入种子数据
    const result = await Food.insertMany(seedFoods);
    console.log(`成功插入 ${result.length} 条食物数据`);

    await mongoose.connection.close();
    console.log('数据库连接已关闭');
    process.exit(0);
  } catch (error) {
    console.error('种子数据插入失败:', error);
    process.exit(1);
  }
}

seed();
