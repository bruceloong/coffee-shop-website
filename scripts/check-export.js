const fs = require("fs");
const path = require("path");

// 检查out目录
const outDir = path.join(__dirname, "../out");

console.log("检查导出目录...");

// 检查out目录是否存在
if (!fs.existsSync(outDir)) {
  console.error("错误: out目录不存在!");
  process.exit(1);
}

// 检查index.html是否存在
const indexPath = path.join(outDir, "index.html");
if (!fs.existsSync(indexPath)) {
  console.error("错误: index.html文件不存在!");

  // 列出out目录中的文件
  console.log("out目录内容:");
  const files = fs.readdirSync(outDir);
  files.forEach((file) => {
    const stats = fs.statSync(path.join(outDir, file));
    if (stats.isDirectory()) {
      console.log(`[目录] ${file}`);
    } else {
      console.log(`[文件] ${file} (${stats.size} 字节)`);
    }
  });

  process.exit(1);
}

// 检查index.html的内容
const indexContent = fs.readFileSync(indexPath, "utf8");
if (!indexContent.includes("<html") || !indexContent.includes("<body")) {
  console.error("警告: index.html可能不是有效的HTML文件!");
  console.log("index.html前100个字符:");
  console.log(indexContent.substring(0, 100) + "...");
}

// 检查是否有README.md文件
const readmePath = path.join(outDir, "README.md");
if (fs.existsSync(readmePath)) {
  console.warn(
    "警告: out目录中存在README.md文件，这可能会导致GitHub Pages显示README而不是网站!"
  );
  console.log("正在删除README.md文件...");
  fs.unlinkSync(readmePath);
}

// 确保.nojekyll文件存在
const nojekyllPath = path.join(outDir, ".nojekyll");
if (!fs.existsSync(nojekyllPath)) {
  console.log("创建.nojekyll文件...");
  fs.writeFileSync(nojekyllPath, "");
}

console.log("检查完成! 导出目录看起来没有问题。");
