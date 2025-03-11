const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// 配置
const GITHUB_USERNAME = "bruceloong"; // 替换为您的GitHub用户名
const REPO_NAME = "coffee-shop-website"; // 替换为您的仓库名称
const BRANCH_NAME = "gh-pages"; // GitHub Pages分支名称

// 颜色输出
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

// 日志函数
const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
};

// 执行命令并打印输出
function exec(command) {
  try {
    log.info(`执行: ${command}`);
    execSync(command, { stdio: "inherit" });
    return true;
  } catch (error) {
    log.error(`命令执行失败: ${command}`);
    log.error(error.message);
    return false;
  }
}

// 主函数
async function deploy() {
  try {
    // 检查是否有未提交的更改
    log.info("检查工作区状态...");
    const status = execSync("git status --porcelain").toString().trim();

    if (status) {
      log.warning("您有未提交的更改。建议先提交或暂存这些更改。");
      const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise((resolve) => {
        readline.question("是否继续部署? (y/n): ", resolve);
      });

      readline.close();

      if (answer.toLowerCase() !== "y") {
        log.info("部署已取消");
        return;
      }
    }

    // 1. 构建项目
    log.info("开始构建项目...");
    if (!exec("npm run build")) {
      return;
    }
    log.success("项目构建完成");

    // 2. 为GitHub Pages创建next.config.js的备份
    log.info("配置Next.js以支持GitHub Pages...");
    const nextConfigPath = path.join(__dirname, "../next.config.ts");
    let nextConfigContent = "";

    if (fs.existsSync(nextConfigPath)) {
      nextConfigContent = fs.readFileSync(nextConfigPath, "utf8");
      fs.writeFileSync(`${nextConfigPath}.backup`, nextConfigContent, "utf8");
      log.success("已创建next.config.ts的备份");
    }

    // 3. 修改next.config.js以支持GitHub Pages
    const ghPagesConfig = `
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/${REPO_NAME}',
  assetPrefix: '/${REPO_NAME}/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
`;

    fs.writeFileSync(nextConfigPath, ghPagesConfig, "utf8");
    log.success("已更新next.config.ts以支持GitHub Pages");

    // 4. 重新构建项目
    log.info("使用GitHub Pages配置重新构建项目...");
    if (!exec("npm run build")) {
      // 恢复备份
      if (nextConfigContent) {
        fs.writeFileSync(nextConfigPath, nextConfigContent, "utf8");
        log.info("已恢复next.config.ts");
      }
      return;
    }
    log.success("项目重新构建完成");

    // 5. 创建.nojekyll文件（防止GitHub Pages使用Jekyll处理）
    const outDir = path.join(__dirname, "../out");
    fs.writeFileSync(path.join(outDir, ".nojekyll"), "");
    log.success("已创建.nojekyll文件");

    // 6. 部署到GitHub Pages
    log.info(`开始部署到GitHub Pages (${BRANCH_NAME}分支)...`);

    // 初始化新的git仓库
    const commands = [
      `cd ${outDir}`,
      "git init",
      "git add -A",
      `git commit -m "Deploy to GitHub Pages"`,
      `git push -f git@github.com:${GITHUB_USERNAME}/${REPO_NAME}.git main:${BRANCH_NAME}`,
    ];

    const deployCommand = commands.join(" && ");
    if (!exec(deployCommand)) {
      log.error("部署失败");
      return;
    }

    log.success("部署成功!");
    log.info(
      `您的网站已部署到: https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/`
    );

    // 7. 恢复next.config.js
    if (nextConfigContent) {
      fs.writeFileSync(nextConfigPath, nextConfigContent, "utf8");
      fs.unlinkSync(`${nextConfigPath}.backup`);
      log.success("已恢复原始next.config.ts");
    }
  } catch (error) {
    log.error("部署过程中发生错误:");
    log.error(error.message);
  }
}

// 执行部署
deploy();
