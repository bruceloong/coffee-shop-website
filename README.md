# Brew Haven 咖啡店网站

一个使用 Next.js 15 App Router 与 TailwindCSS 4 构建的精品咖啡店网站：Server/Client 组件混合渲染、品牌化设计系统、完整购物车与结算流程。

## 功能特点

- 🎨 品牌化设计系统：奶油米白 × 深焙咖 × 金铜色板（CSS 设计 token）+ Fraunces / Noto Sans SC 字体
- ✨ Framer Motion 微交互：Hero 视差、页面过渡、数字滚动、跑马灯、支付成功画勾动画
- 🛒 购物车：Context + useMemo 派生、localStorage 持久化（防刷新复活）、sonner Toast 反馈
- 📦 数据单源：菜单数据集中在 `src/data/menu.ts`，跨页面按 id 引用保证一致
- 🌓 亮色 / 暗色模式（`prefers-color-scheme`）
- 🔍 SEO：每页 metadata、Open Graph、JSON-LD 结构化数据、sitemap、robots
- 🧪 Vitest + Testing Library 单元测试（购物车核心逻辑）
- 📱 移动端友好：汉堡菜单（滚动锁定 / Esc 关闭 / 路由变化自动收起）、blur 占位图

## 技术栈

- [Next.js 15](https://nextjs.org/)（App Router，静态导出）
- [React 19](https://react.dev/)
- [TailwindCSS 4](https://tailwindcss.com/)（`@theme` 设计 token）
- [Framer Motion 12](https://www.framer.com/motion/) - 动画库
- [sonner](https://sonner.emilkowal.ski/) - Toast 通知
- [EmailJS](https://www.emailjs.com/) - 联系表单（可选，见环境变量）
- [Vitest 3](https://vitest.dev/) + Testing Library - 单元测试
- [pnpm 8](https://pnpm.io/) - 包管理器

## 开始使用

### 前提条件

- Node.js 18.18 或更高版本
- pnpm 8（`npm i -g pnpm@8`）

### 安装与启动

```bash
pnpm install
node scripts/download-images.js   # 首次克隆时补齐示例图片（已有可跳过）
pnpm dev                          # http://localhost:3000
```

### 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 本地开发（Turbopack） |
| `pnpm build` | 生产构建 + lint + 类型检查 |
| `pnpm lint` | ESLint 检查 |
| `pnpm test` | 运行单元测试（vitest run） |
| `pnpm test:watch` | 测试 watch 模式 |
| `pnpm deploy` | 构建并部署到 GitHub Pages |

## 环境变量

部署配置全部通过环境变量注入（见 `next.config.ts`），本地与 CI 共用同一套配置，不再构建时改写文件：

| 变量 | 说明 | 默认 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 站点地址（canonical / sitemap / JSON-LD） | `https://coffee.mengyadiary.com` |
| `NEXT_PUBLIC_BASE_PATH` | GitHub Pages 项目页前缀（存在 `public/CNAME` 时留空） | 无 |
| `NEXT_OUTPUT` | 设为 `export` 启用静态导出（GitHub Pages） | 无 |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS 服务 ID（联系表单真实发送） | 无 |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS 模板 ID | 无 |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS 公钥 | 无 |

> EmailJS 三项均未配置时，联系表单自动进入演示模式（模拟发送，不真实发信）。

## 项目结构

```
coffee-shop-website/
├── public/                  # 静态资源（含 CNAME 自定义域名）
├── scripts/                 # 部署 / 图片下载脚本
├── src/
│   ├── app/
│   │   ├── (pages)/         # 路由页面：menu / cart / checkout / about / contact
│   │   ├── layout.tsx       # 根布局：字体、metadata、JSON-LD、Toaster
│   │   ├── page.tsx         # 首页（server component，组合各 section）
│   │   ├── template.tsx     # 路由切换过渡动画
│   │   ├── loading.tsx / error.tsx / not-found.tsx
│   │   ├── sitemap.ts / robots.ts
│   │   └── globals.css      # 设计 token（@theme）+ 组件类 + 动画
│   ├── assets/images/       # 图片（next/image 静态导入 + blur 占位）
│   ├── components/          # Navbar / Footer / ProductCard / PageHero
│   │   └── home/            # 首页 section：Hero / Marquee / Featured / About / Stats / Testimonials
│   ├── context/             # CartContext（含单元测试）
│   ├── data/menu.ts         # 菜单数据单源（20 项）
│   ├── lib/format.ts        # formatPrice / isValidPhone / generateOrderNumber
│   └── types/               # 全局类型
└── vitest.config.ts / vitest.setup.ts
```

## 自定义

- **颜色主题**：编辑 `src/app/globals.css` 的 `:root`（亮色）与 `prefers-color-scheme`（暗色）块。
- **菜单**：编辑 `src/data/menu.ts`；首页精选通过 `featuredProductIds` 按 id 引用。
- **页面**：在 `src/app/(pages)/` 下新建目录与 `page.tsx`。

## 部署

### GitHub Pages（当前使用）

- **自动**：push 到 `main` 触发 `.github/workflows/deploy.yml`（自动识别 `public/CNAME` 决定是否加 basePath）。
- **本地**：`pnpm deploy`（脚本逻辑与 CI 一致，通过环境变量注入配置）。
- 自定义域名：`public/CNAME` 内容为 `coffee.mengyadiary.com`。

### Vercel / Netlify

直接导入仓库即可，无需任何配置改写；若不需要静态导出，可不设置 `NEXT_OUTPUT`。

## 许可证

[MIT](LICENSE)
