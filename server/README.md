# 咖啡小店网站 - 后端服务

这是咖啡小店网站的后端服务，使用 Node.js、Express 和 TypeScript 构建。

## 特性

- 完整的 RESTful API
- JWT 身份验证和授权
- 用户、产品、订单、支付和库存管理
- 支持 MongoDB 数据库或内存数据模式
- TypeScript 类型安全

## 项目结构

```
server/
├── src/
│   ├── controllers/    # 控制器
│   ├── models/         # 数据模型
│   ├── routes/         # 路由
│   ├── middleware/     # 中间件
│   ├── services/       # 服务
│   ├── app.ts          # Express应用
│   └── index.ts        # 入口文件
├── .env                # 环境变量
└── package.json        # 依赖管理
```

## 安装

```bash
# 安装依赖
pnpm install
```

## 配置

创建 `.env` 文件并配置以下环境变量：

```
# 服务器配置
PORT=5000
NODE_ENV=development
USE_MEMORY_DB=true  # 使用内存数据模式，无需MongoDB

# 数据库配置（如果不使用内存数据模式）
MONGODB_URI=mongodb://localhost:27017/coffee-shop

# JWT配置
JWT_SECRET=your_super_secret_jwt_key_for_coffee_shop_app
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# 跨域配置
CORS_ORIGIN=http://localhost:3000
```

## 运行

```bash
# 开发模式
pnpm dev

# 构建
pnpm build

# 生产模式
pnpm start
```

## API 端点

### 用户 API

- `POST /api/v1/users/signup` - 注册新用户
- `POST /api/v1/users/login` - 用户登录
- `GET /api/v1/users/logout` - 用户登出
- `GET /api/v1/users/me` - 获取当前用户信息
- `PATCH /api/v1/users/updateMe` - 更新用户信息
- `PATCH /api/v1/users/updatePassword` - 更新密码
- `GET /api/v1/users` - 获取所有用户 (管理员)
- `GET /api/v1/users/:id` - 获取单个用户 (管理员)
- `PATCH /api/v1/users/:id` - 更新用户 (管理员)
- `DELETE /api/v1/users/:id` - 删除用户 (管理员)

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

## 内存数据模式

当 `USE_MEMORY_DB=true` 时，系统将使用内存数据而不是 MongoDB。这对于开发和测试非常有用。

内存数据模式预设了以下测试账户：

1. 管理员账户

   - 邮箱: admin@example.com
   - 密码: admin123

2. 普通用户账户
   - 邮箱: user@example.com
   - 密码: admin123

## 许可证

MIT
