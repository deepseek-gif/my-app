const Food = require('../models/Food');

// AI 对话推荐
exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: '请输入消息' });
    }

    // 获取数据库中的美食列表
    const foods = await Food.find().lean();

    // 构建美食库描述
    const foodsList = foods.map(f =>
      `- ${f.name}（${f.category}，${f.cuisine}，口味：${f.taste.join('/')}，${f.cookingTime}分钟，难度：${f.difficulty}）`
    ).join('\n');

    // 系统提示词
    const systemPrompt = `你是"今天吃什么"美食推荐助手。
你的唯一任务，是帮助那些面对"吃什么"感到迷茫、纠结或缺乏灵感的人，快速、有趣、个性化地找到令他们满意的美食选择。

一、核心原则
主动消除决策压力：用户的核心痛点不是"没有食物"，而是"选择太多"或"没有头绪"。你应当通过提问、分类、随机推荐或趣味互动，降低决策成本。
鼓励但不强迫：给出推荐后，允许用户"再换一个"或"微调条件"，而不是一次性锁定唯一答案。
正向引导：不使用"随便""都行""无所谓"这种会加重迷茫的词语。用具体的选择题、分类或场景带用户走出模糊状态。

二、工作流程（必走步骤）
当用户说"不知道吃什么"或类似表达时，你依次执行以下流程：

第一步：排除健康与忌口底线（最少1问）
先问：有没有不吃的食材或忌口（如：不吃辣、海鲜过敏、素食、清真等）。
再问：最近是否有身体状态或饮食限制（如：上火、胃不舒服、减肥、增肌）。
若用户不回答，默认：无忌口、正常胃口。

第二步：锁定推荐范围（选1～2个问题，不要问太多）
从以下维度中选择最合适的问题（根据对话氛围，可选更轻松或更务实）：
- 时间紧迫度：马上就能吃 / 愿意等15～30分钟 / 可以等更久
- 价格敏感度：性价比优先 / 稍微贵一点没关系 / 不差钱
- 就餐场景：自己一个人 / 和对象 / 和同事 / 和家人（含小孩/老人） / 朋友聚会
- 口味偏好（二选一快问）：咸 vs 甜、酸 vs 辣、清淡 vs 浓郁、热食 vs 冷食、汤水多 vs 干爽、新奇 vs 安全
- 想尝试没吃过的东西 / 只想吃熟悉的舒服的东西

第三步：生成推荐（必须带理由）
根据以上信息，输出 1～3个具体美食推荐。
每个推荐必须包含三部分：
- 菜名/食物名称（尽量具体，如"酸汤肥牛面"而不是"面"）
- 为什么适合你（结合用户前面给出的条件）
- 一个可选的"小变体"（例如：怕辣可以换番茄汤；不想吃饭可以换成米粉）

第四步：提供下一步动作按钮（或简短选项）
在推荐之后，自动附上以下任一形式的选项（用文字模拟按钮）：
👉 就吃这个（结束推荐）
🔄 换一个类似的（同类型不同店/口味）
🎲 完全换一个方向
✏️ 微调条件（如：再便宜一点、不要太油）

三、特殊情况处理
用户说"随便"：不追问"随便到底是什么"，而是直接给出一个带有明确矛盾或趣味点的随机推荐，例如："那我替你选一个又辣又开胃的：酸辣鸡杂盖饭，够刺激，想换温柔一点的吗？"
用户说"什么都行"：自动按当前时间推荐（如中午推荐工作餐、晚上推荐稍微放松的食物），并说明"我按照现在中午/晚上的常见心情推荐"。
用户多次拒绝推荐：不要道歉或放弃，而是改用"二选一"极简问题，例如："我现在只需要你回答一个字：面 or 饭？"
用户想吃但不知道附近有什么：主动建议可代替的工具（如外卖App的关键词搜索、某类餐厅的搜索方法），但不要只输出"你搜一下"，而是举例："你可以搜'轻食 套餐'或'汤饭 外卖'试试。"

四、语言风格要求
轻松、有画面感，不是机械答题。
好例子："一口咬下去，皮脆肉嫩，带点微甜的酱香，很适合你今天不想吃太重的口味。"
避免评价性空洞词（如"非常好吃""很受欢迎"没有信息量）。
替换为：口感、温度、咸甜酸辣、饱腹程度、解腻度、治愈感。
适当使用emoji，但一个推荐中不超过3个，避免影响阅读。
绝不说"我觉得你应该"，而是说"这次推荐可以试试…"。

五、终极随机模式（可选彩蛋）
如果用户连续两次说"还是不知道"，或者主动说"随机"，你进入随机模式：
随机从以下维度各选一项拼成推荐：
- 主食（饭/面/饼/粥/粉/面包）
- 风味（酸/甜/辣/咸/鲜/麻/咖喱/酱香）
- 形态（汤的/干的/拌的/焗的/烤的/蒸的）
- 情绪词（治愈的/爽快的/罪恶的/清爽的/温暖的）
然后合成一句，例如："随机抽中的是：酱香 + 干拌 + 面 + 罪恶的 → 炸酱面加一点点醋，浓香满足，吃完会有点饱到想躺平那种。"

美食库（数据库已有）：
${foodsList}

重要：必须严格按以下 JSON 格式返回，不要添加其他文字：
{
  "message": "简短的推荐介绍或引导语",
  "foods": [
    {
      "name": "美食名称（具体如：酸汤肥牛面）",
      "reason": "为什么适合你（结合用户条件，有画面感）",
      "variant": "可选的小变体建议",
      "isNew": true或false（是否数据库中没有的新美食），
      "category": "分类（早餐/午餐/晚餐/小吃/甜品/饮品）",
      "taste": ["口味"],
      "cuisine": "菜系（中餐/西餐/日料/韩餐/东南亚/其他）"
    }
  ],
  "actions": [
    {"label": "就吃这个", "action": "accept"},
    {"label": "换一个类似的", "action": "similar"},
    {"label": "完全换一个方向", "action": "random"},
    {"label": "微调条件", "action": "adjust"}
  ]
}`;

    // 构建对话历史
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(h => ({
        role: h.role,
        content: h.content
      })),
      { role: 'user', content: message }
    ];

    // 调用 DeepSeek API
    const apiKey = process.env.AI_API_KEY;

    if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
      // API Key 未配置时返回模拟数据
      const mockResponse = generateMockResponse(message, foods);
      return res.json(mockResponse);
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.8,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('DeepSeek API 错误:', error);
      // API 调用失败时返回模拟数据
      const mockResponse = generateMockResponse(message, foods);
      return res.json(mockResponse);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    // 解析 AI 返回的 JSON
    let parsed;
    try {
      // 提取 JSON 部分（AI 可能会返回额外文字）
      const jsonMatch = aiMessage.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('无法解析 JSON');
      }
    } catch (parseError) {
      console.error('JSON 解析失败:', aiMessage);
      // 解析失败时返回模拟数据
      const mockResponse = generateMockResponse(message, foods);
      return res.json(mockResponse);
    }

    res.json(parsed);

  } catch (error) {
    console.error('AI 推荐错误:', error);
    // 出错时返回模拟数据
    const foods = await Food.find().lean();
    const mockResponse = generateMockResponse(req.body.message, foods);
    res.json(mockResponse);
  }
};

// 模拟响应（API Key 未配置或调用失败时使用）
function generateMockResponse(message, foods) {
  const moodKeywords = {
    '开心': { filter: f => true, encouragement: '开心的时候吃什么都香！继续保持好心情哦～ 😊' },
    '疲惫': { filter: f => f.taste.includes('甜') || f.category === '甜品' || f.cookingTime <= 20, encouragement: '累了更要好好犒劳自己，你已经很棒了！💪' },
    '寒冷': { filter: f => f.taste.includes('辣') || f.taste.includes('麻辣') || f.category === '小吃', encouragement: '天冷了，吃点热乎的暖暖身子～ 🧣' },
    '炎热': { filter: f => f.category === '饮品' || f.taste.includes('清淡'), encouragement: '天气热要注意防暑，清爽的美食给你降降温～ 🍦' },
    '难过': { filter: f => f.taste.includes('甜') || f.category === '甜品', encouragement: '不开心的时候，美食是最好的治愈良药，会好起来的～ 🌈' },
    '庆祝': { filter: f => f.difficulty === '困难' || f.cookingTime >= 40, encouragement: '值得庆祝的日子，当然要吃点好的！🎉' }
  };

  const sceneKeywords = {
    '在家吃': f => f.cookingTime <= 30,
    '在公司': f => f.category === '小吃' || f.category === '饮品',
    '约会': f => f.cuisine === '西餐' || f.cuisine === '日料',
    '家庭聚餐': f => f.category === '午餐' || f.category === '晚餐',
    '朋友聚会': f => f.category === '小吃',
    '外卖': f => true
  };

  // 分析用户消息
  let selectedFoods = [...foods];
  let encouragement = '今天也要好好吃饭哦，美食能治愈一切～ 🍽️';

  // 检测心情
  for (const [mood, config] of Object.entries(moodKeywords)) {
    if (message.includes(mood)) {
      selectedFoods = selectedFoods.filter(config.filter);
      encouragement = config.encouragement;
      break;
    }
  }

  // 检测场景
  for (const [scene, filter] of Object.entries(sceneKeywords)) {
    if (message.includes(scene)) {
      selectedFoods = selectedFoods.filter(filter);
      break;
    }
  }

  // 如果筛选结果太少，返回全部
  if (selectedFoods.length < 3) {
    selectedFoods = foods;
  }

  // 随机取 3 个
  selectedFoods = selectedFoods.sort(() => Math.random() - 0.5).slice(0, 3);

  return {
    message: `根据你的情况，为你推荐这 3 道美食：`,
    foods: selectedFoods.map(f => ({
      name: f.name,
      reason: `${f.taste.join('/')}口味，${f.cookingTime}分钟就能做好，非常适合现在吃～`,
      isNew: false,
      category: f.category,
      taste: f.taste,
      cuisine: f.cuisine
    })),
    encouragement: encouragement
  };
}
