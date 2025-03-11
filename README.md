# Brew Haven 咖啡店网站

这是一个使用 Next.js 和 TailwindCSS 构建的现代咖啡店网站，具有响应式设计和流畅的动画效果。

## 功能特点

- 🎨 现代化 UI 设计，响应式布局
- ✨ 使用 Framer Motion 和 GSAP 实现流畅动画
- 📱 移动端友好的导航菜单
- 🌓 支持亮色/暗色模式
- 📝 完整的咖啡菜单展示
- 📞 联系表单功能
- 📖 关于我们页面，展示品牌故事和团队

## 技术栈

- [Next.js 15](https://nextjs.org/) - React 框架
- [React 19](https://react.dev/) - 用户界面库
- [TailwindCSS 4](https://tailwindcss.com/) - CSS 框架
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [GSAP](https://greensock.com/gsap/) - 高级动画库
- [EmailJS](https://www.emailjs.com/) - 客户端邮件发送

## 开始使用

### 前提条件

- Node.js 18.0.0 或更高版本
- npm 或 yarn 或 pnpm 或 bun

### 安装

1. 克隆仓库

```bash
git clone https://github.com/yourusername/coffee-shop-website.git
cd coffee-shop-website
```

2. 安装依赖

```bash
npm install
# 或
yarn
# 或
pnpm install
# 或
bun install
```

3. 下载示例图片

```bash
node scripts/download-images.js
```

4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
coffee-shop-website/
├── public/             # 静态资源
├── src/                # 源代码
│   ├── app/            # Next.js App Router
│   │   ├── (pages)/    # 页面路由
│   │   │   ├── about/  # 关于我们页面
│   │   │   ├── contact/# 联系我们页面
│   │   │   └── menu/   # 菜单页面
│   │   ├── globals.css # 全局样式
│   │   ├── layout.tsx  # 根布局
│   │   └── page.tsx    # 首页
│   ├── components/     # 可复用组件
│   ├── lib/            # 工具函数和库
│   └── styles/         # 样式文件
├── scripts/            # 脚本文件
└── ...配置文件
```

## 自定义

### 修改颜色主题

编辑 `src/app/globals.css` 文件中的 `:root` 部分来更改网站的颜色主题。

### 添加新页面

在 `src/app/(pages)` 目录下创建新的目录和 `page.tsx` 文件。

### 修改菜单项

编辑 `src/app/(pages)/menu/page.tsx` 文件中的 `menuItems` 数组来更新菜单项。

## 部署

### 部署到 Vercel 或 Netlify

该项目可以部署到任何支持 Next.js 的平台，如 Vercel、Netlify 或自托管服务器。

```bash
# 构建生产版本
npm run build
# 或
yarn build
# 或
pnpm build
# 或
bun build
```

### 部署到 GitHub Pages

1. 首先，在 GitHub 上创建一个仓库

2. 将您的代码推送到该仓库

3. 修改 `scripts/deploy-gh-pages.js` 文件中的配置：

   - 将 `GITHUB_USERNAME` 更改为您的 GitHub 用户名
   - 将 `REPO_NAME` 更改为您的仓库名称

4. 运行部署命令：

```bash
npm run deploy
```

5. 部署完成后，您的网站将可以通过以下 URL 访问：
   `https://[你的GitHub用户名].github.io/[仓库名称]/`

6. 在 GitHub 仓库设置中，确保 GitHub Pages 的源设置为`gh-pages`分支

## 贡献

欢迎提交问题和拉取请求。对于重大更改，请先开启一个问题讨论您想要更改的内容。

## 许可证

[MIT](LICENSE)
