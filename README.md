# 咖啡小店网站

这是一个完整的咖啡小店电子商务网站，包含前端和后端实现。

## 项目结构

```
coffee-shop-website/
├── server/             # 后端服务
│   ├── src/            # 源代码
│   │   ├── controllers/  # 控制器
│   │   ├── models/       # 数据模型
│   │   ├── routes/       # 路由
│   │   ├── middleware/   # 中间件
│   │   ├── services/     # 服务
│   │   ├── app.ts        # Express应用
│   │   └── index.ts      # 入口文件
│   ├── .env            # 环境变量
│   └── package.json    # 依赖管理
└── src/                # 前端源代码
    ├── app/            # Next.js应用
    │   ├── (pages)/      # 页面
    │   ├── (admin)/      # 管理员页面
    │   ├── api/          # API路由
    │   └── components/   # 组件
    ├── .env.local      # 前端环境变量
    └── package.json    # 依赖管理
```

## 功能特性

### 用户功能

- 用户注册和登录
- 用户个人资料管理
- 产品浏览和搜索
- 产品评论和评分
- 购物车管理
- 订单创建和管理
- 支付处理

### 管理员功能

- 产品管理（添加、编辑、删除）
- 订单管理
- 用户管理
- 库存管理
- 销售统计和报表

## 技术栈

### 前端

- Next.js 14 (App Router)
- React
- TypeScript
- Tailwind CSS
- Framer Motion (动画)

### 后端

- Node.js
- Express
- TypeScript
- MongoDB (可选，支持内存数据模式)
- JWT 认证

## 开始使用

### 安装依赖

```bash
# 安装后端依赖
cd server
pnpm install

# 安装前端依赖
cd ..
pnpm install
```

### 配置环境变量

1. 后端配置 (server/.env)

```
PORT=5000
NODE_ENV=development
USE_MEMORY_DB=true  # 使用内存数据模式，无需MongoDB
JWT_SECRET=your_secret_key
```

2. 前端配置 (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 启动服务

```bash
# 启动后端服务
cd server
pnpm dev

# 启动前端服务
cd ..
pnpm dev
```

## API 文档

### 用户 API

- `POST /api/v1/users/signup` - 注册新用户
- `POST /api/v1/users/login` - 用户登录
- `GET /api/v1/users/logout` - 用户登出
- `GET /api/v1/users/me` - 获取当前用户信息
- `PATCH /api/v1/users/updateMe` - 更新用户信息
- `PATCH /api/v1/users/updatePassword` - 更新密码

### 产品 API

- `GET /api/v1/products` - 获取所有产品
- `GET /api/v1/products/:id` - 获取单个产品
- `POST /api/v1/products` - 创建产品 (管理员)
- `PATCH /api/v1/products/:id` - 更新产品 (管理员)
- `DELETE /api/v1/products/:id` - 删除产品 (管理员)
- `GET /api/v1/products/categories` - 获取产品分类
- `GET /api/v1/products/:id/reviews` - 获取产品评论
- `POST /api/v1/products/:id/reviews` - 添加产品评论

### 订单 API

- `POST /api/v1/orders` - 创建订单
- `GET /api/v1/orders/my` - 获取当前用户的订单
- `GET /api/v1/orders/:id` - 获取单个订单
- `PATCH /api/v1/orders/:id/cancel` - 取消订单
- `GET /api/v1/orders` - 获取所有订单 (管理员)
- `GET /api/v1/orders/stats` - 获取订单统计 (管理员)
- `PATCH /api/v1/orders/:id/status` - 更新订单状态 (管理员)

### 支付 API

- `POST /api/v1/payments/create` - 创建支付
- `POST /api/v1/payments/webhook` - 支付回调
- `GET /api/v1/payments/verify/:paymentId` - 验证支付状态
- `GET /api/v1/payments/methods` - 获取支付方式

### 库存 API (管理员)

- `GET /api/v1/inventory` - 获取库存概览
- `GET /api/v1/inventory/low-stock` - 获取低库存产品
- `GET /api/v1/inventory/out-of-stock` - 获取缺货产品
- `PATCH /api/v1/inventory/:id` - 更新产品库存

## 测试账户

在内存数据模式下，系统预设了以下测试账户：

1. 管理员账户

   - 邮箱: admin@example.com
   - 密码: admin123

2. 普通用户账户
   - 邮箱: user@example.com
   - 密码: admin123

## 许可证

MIT
