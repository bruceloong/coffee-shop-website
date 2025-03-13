import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
import { testPassword } from "./controllers/authController";

// 加载环境变量
dotenv.config();

// 设置全局变量，表示是否使用内存模式
global.useInMemoryMode = process.env.USE_MEMORY_DB === "true";

// 如果使用内存模式，测试密码
if (global.useInMemoryMode) {
  testPassword().catch(console.error);
}

// 如果不是内存模式，则连接数据库
if (!global.useInMemoryMode) {
  // 连接数据库
  const DB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/coffee-shop";

  mongoose
    .connect(DB_URI)
    .then(() => console.log("数据库连接成功"))
    .catch((err) => {
      console.error("数据库连接失败:", err);
      console.log("切换到内存模式运行");
      global.useInMemoryMode = true;
    });
} else {
  console.log("使用内存模式运行，不连接数据库");
}

// 启动服务器
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(
    `运行模式: ${global.useInMemoryMode ? "内存模式" : "数据库模式"}`
  );
});

// 处理未捕获的异常
process.on("uncaughtException", (err) => {
  console.error("未捕获的异常:", err);
  process.exit(1);
});

// 处理未处理的 Promise 拒绝
process.on("unhandledRejection", (err) => {
  console.error("未处理的 Promise 拒绝:", err);
  server.close(() => {
    process.exit(1);
  });
});

export default app;
