import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

// 加载环境变量
dotenv.config();

// 处理未捕获的异常
process.on("uncaughtException", (err) => {
  console.error("未捕获的异常！正在关闭...");
  console.error(err.name, err.message);
  process.exit(1);
});

// 连接数据库
const connectDB = async () => {
  try {
    const DB_URI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/coffee-shop";

    if (
      process.env.NODE_ENV === "test" ||
      process.env.USE_MEMORY_DB === "true"
    ) {
      console.log("使用内存数据模式，跳过MongoDB连接");
    } else {
      await mongoose.connect(DB_URI);
      console.log("数据库连接成功");
    }
  } catch (error) {
    console.error("数据库连接失败:", error);
    if (process.env.NODE_ENV !== "production") {
      console.log("使用内存数据模式继续运行");
    } else {
      // 生产环境下数据库连接失败则退出
      process.exit(1);
    }
  }
};

// 启动服务器
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
  });

  // 处理未处理的Promise拒绝
  process.on("unhandledRejection", (err: Error) => {
    console.error("未处理的Promise拒绝！正在关闭...");
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
