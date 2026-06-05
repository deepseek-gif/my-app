const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('../models/Food');

dotenv.config();

const seedFoods = [
  // ========== 早餐 (8道) ==========
  // 中餐 x3
  { name: '豆浆油条', category: '早餐', cuisine: '中餐', taste: ['清淡'], cookingTime: 15, difficulty: '简单', description: '经典中式早餐，豆浆配上刚炸好的油条' },
  { name: '小笼包', category: '早餐', cuisine: '中餐', taste: ['鲜香'], cookingTime: 30, difficulty: '中等', description: '皮薄汁多的上海小笼包' },
  { name: '葱油拌面', category: '早餐', cuisine: '中餐', taste: ['咸'], cookingTime: 15, difficulty: '简单', description: '简单快手的上海早餐面' },
  // 中餐 x5
  { name: '肉包子', category: '早餐', cuisine: '中餐', taste: ['鲜香'], cookingTime: 40, difficulty: '中等', description: '松软的面皮包着鲜美肉馅' },
  { name: '馄饨', category: '早餐', cuisine: '中餐', taste: ['鲜香'], cookingTime: 20, difficulty: '简单', description: '皮薄馅嫩，汤鲜味美' },
  { name: '水蒸蛋', category: '早餐', cuisine: '中餐', taste: ['清淡', '鲜香'], cookingTime: 15, difficulty: '简单', description: '嫩滑如豆腐的蒸蛋' },
  { name: '油条', category: '早餐', cuisine: '中餐', taste: ['咸'], cookingTime: 20, difficulty: '中等', description: '金黄酥脆的传统面食' },
  { name: '皮蛋瘦肉粥', category: '早餐', cuisine: '中餐', taste: ['鲜香', '咸'], cookingTime: 40, difficulty: '中等', description: '经典广式粥品，绵密鲜香' },
  // 西餐 x1
  { name: '煎蛋三明治', category: '早餐', cuisine: '西餐', taste: ['咸'], cookingTime: 10, difficulty: '简单', description: '快手早餐，面包夹煎蛋和蔬菜' },
  // 日料 x1
  { name: '日式饭团', category: '早餐', cuisine: '日料', taste: ['清淡', '鲜香'], cookingTime: 15, difficulty: '简单', description: '简单美味的日式饭团' },
  // 韩餐 x1
  { name: '韩式紫菜包饭', category: '早餐', cuisine: '韩餐', taste: ['清淡'], cookingTime: 20, difficulty: '简单', description: '米饭蔬菜卷入紫菜，方便携带' },

  // ========== 午餐 (24道) ==========
  // 中餐 x16
  { name: '番茄炒蛋', category: '午餐', cuisine: '中餐', taste: ['酸', '甜'], cookingTime: 15, difficulty: '简单', description: '家常菜经典，酸甜可口' },
  { name: '宫保鸡丁', category: '午餐', cuisine: '中餐', taste: ['辣', '鲜香'], cookingTime: 25, difficulty: '中等', description: '川菜经典，花生配鸡肉，酸甜微辣' },
  { name: '牛肉拉面', category: '午餐', cuisine: '中餐', taste: ['咸', '鲜香'], cookingTime: 40, difficulty: '困难', description: '兰州牛肉拉面，汤鲜面筋' },
  { name: '鱼香肉丝', category: '午餐', cuisine: '中餐', taste: ['辣', '酸'], cookingTime: 20, difficulty: '中等', description: '四川经典家常菜，酸甜微辣' },
  { name: '回锅肉', category: '午餐', cuisine: '中餐', taste: ['辣', '咸'], cookingTime: 25, difficulty: '中等', description: '川菜之首，肥而不腻' },
  { name: '糖醋里脊', category: '午餐', cuisine: '中餐', taste: ['酸', '甜'], cookingTime: 25, difficulty: '中等', description: '外酥里嫩，酸甜开胃' },
  { name: '麻婆豆腐', category: '午餐', cuisine: '中餐', taste: ['辣', '麻辣'], cookingTime: 15, difficulty: '简单', description: '麻辣鲜香，下饭神器' },
  { name: '红烧排骨', category: '午餐', cuisine: '中餐', taste: ['咸', '甜'], cookingTime: 40, difficulty: '中等', description: '色泽红亮，肉质酥烂' },
  { name: '干煸四季豆', category: '午餐', cuisine: '中餐', taste: ['辣', '咸'], cookingTime: 15, difficulty: '简单', description: '干香酥脆，下饭利器' },
  { name: '葱爆羊肉', category: '午餐', cuisine: '中餐', taste: ['鲜香'], cookingTime: 15, difficulty: '中等', description: '大火快炒，葱香四溢' },
  { name: '担担面', category: '午餐', cuisine: '中餐', taste: ['辣', '麻辣'], cookingTime: 20, difficulty: '中等', description: '四川经典面食，麻辣鲜香' },
  { name: '酸辣粉', category: '午餐', cuisine: '中餐', taste: ['辣', '酸'], cookingTime: 15, difficulty: '简单', description: '重庆特色小吃，酸辣开胃' },
  { name: '蛋炒饭', category: '午餐', cuisine: '中餐', taste: ['咸', '鲜香'], cookingTime: 10, difficulty: '简单', description: '粒粒分明的经典炒饭' },
  { name: '水煮鱼', category: '午餐', cuisine: '中餐', taste: ['辣', '麻辣'], cookingTime: 30, difficulty: '中等', description: '麻辣鲜嫩的重庆名菜' },
  { name: '京酱肉丝', category: '午餐', cuisine: '中餐', taste: ['甜', '咸'], cookingTime: 20, difficulty: '中等', description: '甜面酱炒肉丝配豆皮' },
  { name: '农家小炒肉', category: '午餐', cuisine: '中餐', taste: ['辣', '咸', '鲜香'], cookingTime: 15, difficulty: '简单', description: '辣椒炒肉，湖南家常菜' },
  // 西餐 x5
  { name: '意大利面', category: '午餐', cuisine: '西餐', taste: ['酸', '咸'], cookingTime: 20, difficulty: '简单', description: '番茄肉酱意大利面' },
  { name: '凯撒沙拉', category: '午餐', cuisine: '西餐', taste: ['清淡', '咸'], cookingTime: 10, difficulty: '简单', description: '经典西式沙拉，清爽健康' },
  { name: '培根芝士汉堡', category: '午餐', cuisine: '西餐', taste: ['咸'], cookingTime: 15, difficulty: '简单', description: '经典美式汉堡，肉香四溢' },
  { name: '奶油培根意面', category: '午餐', cuisine: '西餐', taste: ['咸'], cookingTime: 20, difficulty: '中等', description: '浓郁奶油酱配脆培根' },
  { name: '法式焗蜗牛', category: '午餐', cuisine: '西餐', taste: ['鲜香'], cookingTime: 30, difficulty: '困难', description: '法式经典，蒜香黄油焗蜗牛' },
  // 日料 x3
  { name: '日式咖喱饭', category: '午餐', cuisine: '日料', taste: ['甜', '辣'], cookingTime: 35, difficulty: '中等', description: '浓郁咖喱配上软糯米饭' },
  { name: '日式猪排饭', category: '午餐', cuisine: '日料', taste: ['咸'], cookingTime: 25, difficulty: '中等', description: '酥脆猪排配特制酱汁' },
  // 韩餐 x3
  { name: '韩式拌饭', category: '午餐', cuisine: '韩餐', taste: ['辣', '鲜香'], cookingTime: 30, difficulty: '中等', description: '石锅拌饭，蔬菜配辣酱' },
  { name: '韩式炸酱面', category: '午餐', cuisine: '韩餐', taste: ['咸'], cookingTime: 25, difficulty: '中等', description: '浓郁黑豆酱配劲道面条' },
  { name: '韩式冷面', category: '午餐', cuisine: '韩餐', taste: ['酸', '甜'], cookingTime: 15, difficulty: '简单', description: '酸甜清爽的荞麦冷面' },
  // 东南亚 x2
  { name: '泰式菠萝炒饭', category: '午餐', cuisine: '东南亚', taste: ['酸', '甜'], cookingTime: 20, difficulty: '中等', description: '酸甜开胃的泰式炒饭' },
  { name: '越南河粉', category: '午餐', cuisine: '东南亚', taste: ['清淡'], cookingTime: 30, difficulty: '中等', description: '清爽鲜美的越南牛肉粉' },

  // ========== 晚餐 (18道) ==========
  // 中餐 x9
  { name: '红烧肉', category: '晚餐', cuisine: '中餐', taste: ['甜', '咸'], cookingTime: 60, difficulty: '中等', description: '肥而不腻，入口即化' },
  { name: '清蒸鲈鱼', category: '晚餐', cuisine: '中餐', taste: ['清淡', '鲜香'], cookingTime: 25, difficulty: '中等', description: '鲜美嫩滑，原汁原味' },
  { name: '麻辣火锅', category: '晚餐', cuisine: '中餐', taste: ['辣', '麻辣'], cookingTime: 60, difficulty: '简单', description: '冬天必吃，热辣过瘾' },
  { name: '可乐鸡翅', category: '晚餐', cuisine: '中餐', taste: ['甜'], cookingTime: 30, difficulty: '简单', description: '甜咸适口，色泽诱人' },
  { name: '水煮牛肉', category: '晚餐', cuisine: '中餐', taste: ['辣', '麻辣'], cookingTime: 30, difficulty: '中等', description: '麻辣鲜嫩，川菜经典' },
  { name: '白切鸡', category: '晚餐', cuisine: '中餐', taste: ['清淡', '鲜香'], cookingTime: 40, difficulty: '中等', description: '皮爽肉滑，原汁原味' },
  { name: '蒜蓉粉丝蒸虾', category: '晚餐', cuisine: '中餐', taste: ['鲜香'], cookingTime: 20, difficulty: '中等', description: '蒜香浓郁，虾肉弹牙' },
  { name: '辣子鸡', category: '晚餐', cuisine: '中餐', taste: ['辣', '鲜香'], cookingTime: 25, difficulty: '中等', description: '辣椒与鸡肉的完美碰撞' },
  { name: '砂锅粥', category: '晚餐', cuisine: '中餐', taste: ['鲜香', '清淡'], cookingTime: 40, difficulty: '中等', description: '潮汕砂锅粥，鲜美绵密' },
  // 西餐 x4
  { name: '牛排', category: '晚餐', cuisine: '西餐', taste: ['咸'], cookingTime: 20, difficulty: '中等', description: '五分熟黑椒牛排' },
  { name: '奶油蘑菇汤', category: '晚餐', cuisine: '西餐', taste: ['鲜香', '清淡'], cookingTime: 25, difficulty: '中等', description: '浓郁丝滑的法式蘑菇汤' },
  { name: '烤羊排', category: '晚餐', cuisine: '西餐', taste: ['咸'], cookingTime: 40, difficulty: '困难', description: '外焦里嫩，香草腌制' },
  { name: '西班牙海鲜饭', category: '晚餐', cuisine: '西餐', taste: ['鲜香'], cookingTime: 45, difficulty: '困难', description: '藏红花海鲜烩饭' },
  // 日料 x3
  { name: '寿司拼盘', category: '晚餐', cuisine: '日料', taste: ['清淡', '鲜香'], cookingTime: 45, difficulty: '困难', description: '新鲜鱼生配醋饭' },
  { name: '日式烤鳗鱼', category: '晚餐', cuisine: '日料', taste: ['甜'], cookingTime: 35, difficulty: '困难', description: '蒲烧鳗鱼，甜咸鲜美' },
  { name: '天妇罗', category: '晚餐', cuisine: '日料', taste: ['鲜香', '清淡'], cookingTime: 25, difficulty: '中等', description: '酥脆轻薄的日式炸物' },
  // 韩餐 x1
  { name: '韩式烤肉', category: '晚餐', cuisine: '韩餐', taste: ['咸'], cookingTime: 30, difficulty: '中等', description: '炭火烤五花肉配生菜' },
  // 东南亚 x2
  { name: '冬阴功汤', category: '晚餐', cuisine: '东南亚', taste: ['酸', '辣'], cookingTime: 30, difficulty: '中等', description: '泰式酸辣虾汤' },
  { name: '泰式绿咖喱鸡', category: '晚餐', cuisine: '东南亚', taste: ['辣', '甜'], cookingTime: 25, difficulty: '中等', description: '椰香浓郁的绿咖喱' },

  // ========== 小吃 (8道) ==========
  // 中餐 x3
  { name: '烤红薯', category: '小吃', cuisine: '中餐', taste: ['甜'], cookingTime: 40, difficulty: '简单', description: '冬天的甜蜜味道' },
  { name: '春卷', category: '小吃', cuisine: '中餐', taste: ['咸'], cookingTime: 30, difficulty: '中等', description: '酥脆可口的炸春卷' },
  { name: '臭豆腐', category: '小吃', cuisine: '中餐', taste: ['辣'], cookingTime: 15, difficulty: '中等', description: '闻着臭吃着香的长沙名小吃' },
  // 西餐 x2
  { name: '炸鸡翅', category: '小吃', cuisine: '西餐', taste: ['咸'], cookingTime: 25, difficulty: '简单', description: '外酥里嫩的炸鸡翅' },
  { name: '芝士薯条', category: '小吃', cuisine: '西餐', taste: ['咸'], cookingTime: 15, difficulty: '简单', description: '酥脆薯条配浓郁芝士酱' },
  // 日料 x2
  { name: '章鱼小丸子', category: '小吃', cuisine: '日料', taste: ['咸'], cookingTime: 20, difficulty: '中等', description: '日式街头小吃' },
  { name: '日式煎饺', category: '小吃', cuisine: '日料', taste: ['咸'], cookingTime: 20, difficulty: '中等', description: '底部酥脆的锅贴饺子' },
  // 其他 x1
  { name: '墨西哥玉米片', category: '小吃', cuisine: '其他', taste: ['辣', '咸'], cookingTime: 10, difficulty: '简单', description: '配莎莎酱和酸奶油的经典小食' },

  // ========== 甜品 (7道) ==========
  // 中餐 x2
  { name: '双皮奶', category: '甜品', cuisine: '中餐', taste: ['甜'], cookingTime: 20, difficulty: '中等', description: '顺德双皮奶，细腻顺滑' },
  { name: '红豆沙', category: '甜品', cuisine: '中餐', taste: ['甜'], cookingTime: 40, difficulty: '简单', description: '绵密甜蜜的传统甜汤' },
  // 西餐 x2
  { name: '提拉米苏', category: '甜品', cuisine: '西餐', taste: ['甜'], cookingTime: 45, difficulty: '中等', description: '意式经典甜品' },
  { name: '巧克力熔岩蛋糕', category: '甜品', cuisine: '西餐', taste: ['甜'], cookingTime: 25, difficulty: '中等', description: '切开流出浓郁巧克力浆' },
  // 日料 x1
  { name: '铜锣烧', category: '甜品', cuisine: '日料', taste: ['甜'], cookingTime: 25, difficulty: '简单', description: '哆啦A梦最爱的点心' },
  // 东南亚 x1
  { name: '芒果糯米饭', category: '甜品', cuisine: '东南亚', taste: ['甜'], cookingTime: 30, difficulty: '简单', description: '泰式经典甜品' },
  // 其他 x1
  { name: '焦糖布丁', category: '甜品', cuisine: '其他', taste: ['甜'], cookingTime: 40, difficulty: '中等', description: '法式经典甜品，焦香浓郁' },

  // ========== 饮品 (7道) ==========
  // 中餐 x2
  { name: '杨枝甘露', category: '饮品', cuisine: '中餐', taste: ['甜', '酸'], cookingTime: 20, difficulty: '中等', description: '港式经典甜品饮品' },
  { name: '酸梅汤', category: '饮品', cuisine: '中餐', taste: ['酸', '甜'], cookingTime: 30, difficulty: '简单', description: '消暑解渴的传统饮品' },
  // 日料 x1
  { name: '抹茶拿铁', category: '饮品', cuisine: '日料', taste: ['甜', '清淡'], cookingTime: 10, difficulty: '简单', description: '日式抹茶配牛奶' },
  // 其他 x4
  { name: '珍珠奶茶', category: '饮品', cuisine: '其他', taste: ['甜', '酸'], cookingTime: 15, difficulty: '简单', description: '经典台式奶茶' },
  { name: '柠檬蜂蜜水', category: '饮品', cuisine: '其他', taste: ['酸', '甜'], cookingTime: 5, difficulty: '简单', description: '清爽解渴' },
  { name: '美式咖啡', category: '饮品', cuisine: '其他', taste: ['清淡'], cookingTime: 5, difficulty: '简单', description: '提神醒脑的黑咖啡' },
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
