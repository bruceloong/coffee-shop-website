/**
 * 本地一键部署到 GitHub Pages。
 *
 * 与 CI（.github/workflows/deploy.yml）保持一致：通过环境变量注入配置，
 * 不再在构建时改写 next.config.ts。
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const GITHUB_USERNAME = "bruceloong";
const REPO_NAME = "coffee-shop-website";
const BRANCH_NAME = "gh-pages";
const SITE_URL = "https://coffee.mengyadiary.com";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
};

function exec(command, options = {}) {
  log.info(`执行: ${command}`);
  execSync(command, { stdio: "inherit", ...options });
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function deploy() {
  try {
    // 1. 确认工作区状态（插值均为上方硬编码常量，无 shell 注入风险）
    const status = execSync("git status --porcelain").toString().trim();
    if (status) {
      log.warning("工作区有未提交的更改，建议先提交或暂存。");
      const answer = await ask("是否继续部署? (y/n): ");
      if (answer !== "y") {
        log.info("部署已取消");
        return;
      }
    }

    // 2. 组装环境变量（与 next.config.ts / CI 对齐）
    const rootDir = path.join(__dirname, "..");
    const hasCNAME = fs.existsSync(path.join(rootDir, "public", "CNAME"));
    const env = {
      ...process.env,
      NEXT_OUTPUT: "export",
      NEXT_PUBLIC_SITE_URL: SITE_URL,
      NEXT_PUBLIC_BASE_PATH: hasCNAME ? "" : `/${REPO_NAME}`,
    };

    if (hasCNAME) {
      log.info(`检测到自定义域名: ${fs.readFileSync(path.join(rootDir, "public", "CNAME"), "utf8").trim()}`);
    }

    // 3. 构建
    log.info("开始构建项目...");
    exec("pnpm run build", { cwd: rootDir, env });
    log.success("项目构建完成");

    // 4. .nojekyll + CNAME
    const outDir = path.join(rootDir, "out");
    fs.writeFileSync(path.join(outDir, ".nojekyll"), "");
    if (hasCNAME) {
      fs.copyFileSync(path.join(rootDir, "public", "CNAME"), path.join(outDir, "CNAME"));
      log.success("已复制 CNAME 文件到 out 目录");
    }

    // 5. 推送到 gh-pages 分支
    log.info(`开始部署到 GitHub Pages (${BRANCH_NAME} 分支)...`);
    exec(
      `git init && git add -A && git commit -m "Deploy to GitHub Pages" && git push -f git@github.com:${GITHUB_USERNAME}/${REPO_NAME}.git main:${BRANCH_NAME}`,
      { cwd: outDir }
    );

    log.success("部署成功!");
    log.info(
      hasCNAME
        ? `您的网站已部署到: https://${fs.readFileSync(path.join(rootDir, "public", "CNAME"), "utf8").trim()}/`
        : `您的网站已部署到: https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/`
    );
  } catch (error) {
    log.error("部署过程中发生错误:");
    log.error(error.message);
    process.exitCode = 1;
  }
}

deploy();
