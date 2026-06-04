const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('../models/Recipe');
const Food = require('../models/Food');

dotenv.config();

// 菜谱数据
const recipeData = [
  {
    foodName: '番茄炒蛋',
    title: '经典番茄炒蛋',
    description: '简单快手的家常菜，营养丰富，老少皆宜。',
    ingredients: [
      { name: '番茄', amount: '2个' },
      { name: '鸡蛋', amount: '3个' },
      { name: '葱', amount: '适量' },
      { name: '盐', amount: '适量' },
      { name: '糖', amount: '少许' },
      { name: '食用油', amount: '适量' }
    ],
    steps: [
      { step: 1, description: '番茄洗净切块，鸡蛋打散备用。', duration: 5 },
      { step: 2, description: '锅中倒油，油热后倒入蛋液，炒至凝固盛出。', duration: 3 },
      { step: 3, description: '锅中再倒少许油，放入番茄块翻炒。', duration: 5 },
      { step: 4, description: '加入适量盐和糖调味。', duration: 2 },
      { step: 5, description: '倒入炒好的鸡蛋，翻炒均匀。', duration: 2 },
      { step: 6, description: '撒上葱花，出锅装盘。', duration: 1 }
    ],
    cookingTime: 20,
    difficulty: '简单',
    servings: 2,
    tips: '番茄要炒出汁才好吃，鸡蛋不要炒太老。'
  },
  {
    foodName: '红烧肉',
    title: '经典红烧肉',
    description: '肥而不腻，入口即化的经典家常菜。',
    ingredients: [
      { name: '五花肉', amount: '500克' },
      { name: '葱', amount: '2根' },
      { name: '姜', amount: '1块' },
      { name: '八角', amount: '2个' },
      { name: '桂皮', amount: '1小块' },
      { name: '冰糖', amount: '30克' },
      { name: '生抽', amount: '2勺' },
      { name: '老抽', amount: '1勺' },
      { name: '料酒', amount: '2勺' }
    ],
    steps: [
      { step: 1, description: '五花肉切块，冷水下锅焯水。', duration: 10 },
      { step: 2, description: '锅中放油，放入冰糖炒至融化。', duration: 5 },
      { step: 3, description: '放入五花肉翻炒上色。', duration: 5 },
      { step: 4, description: '加入葱姜、八角、桂皮炒香。', duration: 3 },
      { step: 5, description: '加入生抽、老抽、料酒调味。', duration: 2 },
      { step: 6, description: '加入适量热水，大火烧开后转小火炖1小时。', duration: 60 },
      { step: 7, description: '大火收汁，出锅装盘。', duration: 10 }
    ],
    cookingTime: 90,
    difficulty: '中等',
    servings: 4,
    tips: '五花肉要选三层的，炖的时候要用小火。'
  },
  {
    foodName: '宫保鸡丁',
    title: '经典宫保鸡丁',
    description: '麻辣鲜香，鸡肉嫩滑的经典川菜。',
    ingredients: [
      { name: '鸡胸肉', amount: '300克' },
      { name: '花生米', amount: '50克' },
      { name: '干辣椒', amount: '10个' },
      { name: '花椒', amount: '1小把' },
      { name: '葱', amount: '2根' },
      { name: '姜', amount: '1块' },
      { name: '蒜', amount: '3瓣' },
      { name: '生抽', amount: '2勺' },
      { name: '醋', amount: '1勺' },
      { name: '糖', amount: '1勺' },
      { name: '淀粉', amount: '适量' }
    ],
    steps: [
      { step: 1, description: '鸡胸肉切丁，用料酒、淀粉腌制15分钟。', duration: 15 },
      { step: 2, description: '花生米炒熟备用。', duration: 5 },
      { step: 3, description: '锅中倒油，放入干辣椒和花椒炒香。', duration: 3 },
      { step: 4, description: '放入鸡丁翻炒至变色。', duration: 5 },
      { step: 5, description: '加入葱姜蒜炒香。', duration: 2 },
      { step: 6, description: '加入生抽、醋、糖调味。', duration: 2 },
      { step: 7, description: '放入花生米翻炒均匀。', duration: 2 },
      { step: 8, description: '出锅装盘。', duration: 1 }
    ],
    cookingTime: 30,
    difficulty: '中等',
    servings: 3,
    tips: '鸡肉要腌制才嫩滑，花生米最后放才脆。'
  },
  {
    foodName: '清蒸鱼',
    title: '清蒸鲈鱼',
    description: '鲜嫩可口，营养丰富的清淡菜品。',
    ingredients: [
      { name: '鲈鱼', amount: '1条' },
      { name: '葱', amount: '2根' },
      { name: '姜', amount: '1块' },
      { name: '红椒', amount: '1个' },
      { name: '蒸鱼豉油', amount: '2勺' },
      { name: '料酒', amount: '1勺' },
      { name: '食用油', amount: '适量' }
    ],
    steps: [
      { step: 1, description: '鲈鱼处理干净，两面划几刀。', duration: 5 },
      { step: 2, description: '用料酒和姜片腌制10分钟。', duration: 10 },
      { step: 3, description: '盘中放葱姜，放入鱼。', duration: 2 },
      { step: 4, description: '水开后上锅蒸8-10分钟。', duration: 10 },
      { step: 5, description: '倒掉蒸出的汤汁，放上新的葱姜丝。', duration: 2 },
      { step: 6, description: '淋上蒸鱼豉油，浇上热油。', duration: 2 }
    ],
    cookingTime: 30,
    difficulty: '简单',
    servings: 2,
    tips: '鱼要新鲜，蒸的时间不要太长。'
  },
  {
    foodName: '酸辣土豆丝',
    title: '酸辣土豆丝',
    description: '酸辣可口，开胃下饭的家常菜。',
    ingredients: [
      { name: '土豆', amount: '2个' },
      { name: '干辣椒', amount: '5个' },
      { name: '花椒', amount: '1小把' },
      { name: '葱', amount: '1根' },
      { name: '蒜', amount: '3瓣' },
      { name: '醋', amount: '2勺' },
      { name: '盐', amount: '适量' },
      { name: '食用油', amount: '适量' }
    ],
    steps: [
      { step: 1, description: '土豆去皮切丝，泡水去淀粉。', duration: 5 },
      { step: 2, description: '锅中倒油，放入干辣椒和花椒炒香。', duration: 3 },
      { step: 3, description: '放入土豆丝大火翻炒。', duration: 5 },
      { step: 4, description: '加入醋和盐调味。', duration: 2 },
      { step: 5, description: '加入葱蒜翻炒均匀。', duration: 2 },
      { step: 6, description: '出锅装盘。', duration: 1 }
    ],
    cookingTime: 15,
    difficulty: '简单',
    servings: 2,
    tips: '土豆丝要泡水去淀粉，炒的时候要大火快炒。'
  }
];

async function seedRecipes() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meishi');
    console.log('数据库已连接');

    // 清空旧数据
    await Recipe.deleteMany({});
    console.log('已清空旧菜谱数据');

    // 获取所有美食
    const foods = await Food.find({});
    console.log(`找到 ${foods.length} 个美食`);

    // 创建美食名称到ID的映射
    const foodMap = {};
    foods.forEach(food => {
      foodMap[food.name] = food._id;
    });

    // 插入菜谱数据
    let insertedCount = 0;
    for (const data of recipeData) {
      const foodId = foodMap[data.foodName];
      if (!foodId) {
        console.log(`未找到美食: ${data.foodName}`);
        continue;
      }

      const recipe = new Recipe({
        food: foodId,
        title: data.title,
        description: data.description,
        ingredients: data.ingredients,
        steps: data.steps,
        cookingTime: data.cookingTime,
        difficulty: data.difficulty,
        servings: data.servings,
        tips: data.tips
      });

      await recipe.save();
      insertedCount++;
      console.log(`已添加菜谱: ${data.title}`);
    }

    console.log(`\n成功插入 ${insertedCount} 条菜谱数据`);

    // 关闭连接
    await mongoose.connection.close();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('插入菜谱数据失败:', error);
    process.exit(1);
  }
}

// 运行脚本
seedRecipes();
