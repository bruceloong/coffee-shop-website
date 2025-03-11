import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 项目根目录
const rootDir = path.join(__dirname, "..");
// 源代码目录
const srcDir = path.join(rootDir, "src");
// 图片目录
const imagesDir = path.join(rootDir, "public/images");

console.log("检查图片引用...");

// 检查图片目录是否存在
if (!fs.existsSync(imagesDir)) {
  console.error("错误: public/images目录不存在!");
  process.exit(1);
}

// 获取所有图片文件
const imageFiles = fs
  .readdirSync(imagesDir)
  .filter((file) => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file));

console.log(`找到 ${imageFiles.length} 个图片文件:`);
imageFiles.forEach((file) => {
  console.log(`- ${file}`);
});

// 递归获取所有.tsx和.jsx文件
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (/\.(tsx|jsx)$/i.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

const componentFiles = getAllFiles(srcDir);
console.log(`\n找到 ${componentFiles.length} 个组件文件`);

// 检查图片引用
const imageRegex = /src=["'](\/[^"']*\.(jpg|jpeg|png|gif|svg|webp))["']/g;
const nextImageRegex = /<Image[^>]*src=["']([^"']*)["'][^>]*>/g;
const optimizedImageRegex = /<OptimizedImage[^>]*src=["']([^"']*)["'][^>]*>/g;

let totalImageRefs = 0;
let directImageRefs = 0;
let nextImageRefs = 0;
let optimizedImageRefs = 0;
let potentialIssues = [];

componentFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  const relativePath = path.relative(rootDir, file);

  // 检查直接图片引用
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    totalImageRefs++;
    directImageRefs++;
    const imagePath = match[1];

    // 检查图片是否存在
    const imageFile = path.basename(imagePath);
    if (!imageFiles.includes(imageFile)) {
      potentialIssues.push({
        file: relativePath,
        type: "直接引用",
        path: imagePath,
        issue: "图片文件不存在",
      });
    }
  }

  // 检查Next.js Image组件
  while ((match = nextImageRegex.exec(content)) !== null) {
    totalImageRefs++;
    nextImageRefs++;
    const imagePath = match[1];

    // 检查是否使用了getImageUrl
    if (
      !content.includes("getImageUrl") &&
      !imagePath.startsWith("{getImageUrl")
    ) {
      potentialIssues.push({
        file: relativePath,
        type: "Next.js Image",
        path: imagePath,
        issue: "未使用getImageUrl函数",
      });
    }
  }

  // 检查OptimizedImage组件
  while ((match = optimizedImageRegex.exec(content)) !== null) {
    totalImageRefs++;
    optimizedImageRefs++;
    // OptimizedImage组件已经处理了路径，不需要额外检查
  }
});

console.log(`\n图片引用统计:`);
console.log(`- 总引用数: ${totalImageRefs}`);
console.log(`- 直接引用: ${directImageRefs}`);
console.log(`- Next.js Image组件: ${nextImageRefs}`);
console.log(`- OptimizedImage组件: ${optimizedImageRefs}`);

if (potentialIssues.length > 0) {
  console.log(`\n发现 ${potentialIssues.length} 个潜在问题:`);
  potentialIssues.forEach((issue, index) => {
    console.log(`${index + 1}. 文件: ${issue.file}`);
    console.log(`   类型: ${issue.type}`);
    console.log(`   路径: ${issue.path}`);
    console.log(`   问题: ${issue.issue}`);
    console.log("");
  });

  console.log("建议修复方法:");
  console.log("1. 对于Next.js Image组件，使用OptimizedImage组件替换");
  console.log("2. 或者确保使用getImageUrl函数处理图片路径");
} else {
  console.log("\n未发现潜在问题，所有图片引用看起来都很好!");
}

console.log("\n检查完成!");
