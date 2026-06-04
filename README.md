# 今天吃什么 - 后端 API

## 📋 项目简介

今天吃什么 - 美食推荐 App 后端 API

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 启动生产服务器
npm start
```

### 数据库初始化

```bash
# 初始化美食数据
npm run seed

# 初始化菜谱数据
npm run seed:recipes

# 初始化营养数据
npm run seed:nutrition
```

## 🌐 Railway 部署

### 1. Fork 或克隆本仓库

### 2. 在 Railway 创建项目
1. 访问 https://railway.app
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择 "Deploy from GitHub repo"
5. 选择本仓库

### 3. 添加 MongoDB 数据库
1. 在项目页面点击 "New"
2. 选择 "Database" → "MongoDB"
3. Railway 会自动创建数据库并设置 `MONGODB_URI` 环境变量

### 4. 设置环境变量
在 Railway 项目的 "Variables" 选项卡中添加：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `PORT` | 服务端口 | `8080` |
| `NODE_ENV` | 运行环境 | `production` |
| `JWT_SECRET` | JWT 密钥 | `your_jwt_secret_here` |
| `AI_API_KEY` | DeepSeek API Key | `sk-xxx` |

### 5. 初始化数据库
部署成功后，在 Railway 的 "Settings" → "Deploy" 中添加部署后命令：

```bash
npm run seed && npm run seed:recipes && npm run seed:nutrition
```

### 6. 获取域名
1. 在项目页面点击 "Settings"
2. 找到 "Networking"
3. 点击 "Generate Domain"
4. 获得固定域名（如 `https://meishi-backend.up.railway.app`）

## 📚 API 文档

### 用户 API
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/users/register` | 用户注册 |
| POST | `/api/users/login` | 用户登录 |
| GET | `/api/users/profile` | 获取用户信息 |
| PUT | `/api/users/profile` | 更新用户信息 |
| PUT | `/api/users/password` | 修改密码 |

### 美食 API
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/foods` | 获取美食列表 |
| GET | `/api/foods/:id` | 获取单个美食 |
| POST | `/api/foods` | 创建美食 |
| PUT | `/api/foods/:id` | 更新美食 |
| DELETE | `/api/foods/:id` | 删除美食 |

### 菜谱 API
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/recipes` | 获取菜谱列表 |
| GET | `/api/recipes/:id` | 获取单个菜谱 |
| GET | `/api/recipes/food/:foodId` | 根据美食ID获取菜谱 |
| POST | `/api/recipes` | 创建菜谱 |
| PUT | `/api/recipes/:id` | 更新菜谱 |
| DELETE | `/api/recipes/:id` | 删除菜谱 |

### 营养分析 API
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/nutrition` | 获取营养数据列表 |
| GET | `/api/nutrition/:id` | 获取单个营养数据 |
| GET | `/api/nutrition/food/:foodId` | 根据美食ID获取营养数据 |
| GET | `/api/nutrition/analysis/:foodId` | 获取营养分析报告 |
| POST | `/api/nutrition` | 创建营养数据 |
| PUT | `/api/nutrition/:id` | 更新营养数据 |
| DELETE | `/api/nutrition/:id` | 删除营养数据 |

### 历史记录 API
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/history` | 获取浏览历史 |
| GET | `/api/history/count` | 获取浏览历史数量 |
| POST | `/api/history` | 添加浏览历史 |
| DELETE | `/api/history/:id` | 删除单条浏览历史 |
| DELETE | `/api/history` | 清空浏览历史 |

### 图片上传 API
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/upload/:type` | 上传单个图片 |
| POST | `/api/upload/:type/multiple` | 上传多个图片 |
| DELETE | `/api/upload/:type/:filename` | 删除图片 |

### AI 推荐 API
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/ai/recommend` | AI 推荐美食 |

## 🔧 环境变量

| 变量名 | 必填 | 说明 | 默认值 |
|--------|------|------|--------|
| `PORT` | 否 | 服务端口 | `3000` |
| `NODE_ENV` | 否 | 运行环境 | `development` |
| `MONGODB_URI` | 是 | MongoDB 连接字符串 | `mongodb://localhost:27017/meishi` |
| `JWT_SECRET` | 是 | JWT 密钥 | - |
| `AI_API_KEY` | 否 | DeepSeek API Key | - |

## 📁 项目结构

```
backend/
├── config/          # 配置文件
│   └── db.js        # 数据库连接配置
├── controllers/     # 控制器
│   ├── aiController.js
│   ├── foodController.js
│   ├── historyController.js
│   ├── nutritionController.js
│   ├── preferenceController.js
│   ├── recipeController.js
│   ├── uploadController.js
│   └── userController.js
├── middleware/      # 中间件
│   ├── auth.js
│   └── errorHandler.js
├── models/          # 数据模型
│   ├── Food.js
│   ├── History.js
│   ├── Nutrition.js
│   ├── Recipe.js
│   ├── User.js
│   └── UserPreference.js
├── routes/          # 路由
│   ├── aiRoutes.js
│   ├── foodRoutes.js
│   ├── historyRoutes.js
│   ├── nutritionRoutes.js
│   ├── preferenceRoutes.js
│   ├── recipeRoutes.js
│   ├── uploadRoutes.js
│   └── userRoutes.js
├── scripts/         # 脚本
│   ├── seed.js
│   ├── seedNutrition.js
│   └── seedRecipes.js
├── uploads/         # 上传文件目录
├── .env             # 环境变量
├── .gitignore       # Git 忽略文件
├── package.json     # 项目配置
├── Procfile         # Railway 进程配置
├── README.md        # 项目说明
└── server.js        # 服务器入口
```

## 🛠️ 技术栈

- **运行时：** Node.js
- **框架：** Express.js
- **数据库：** MongoDB (Mongoose)
- **认证：** JWT (jsonwebtoken)
- **密码加密：** bcryptjs
- **文件上传：** multer
- **AI 推荐：** DeepSeek API

## 📝 许可证

ISC
