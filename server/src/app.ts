import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

// 路由导入
import userRouter from "./routes/userRoutes";
import productRouter from "./routes/productRoutes";
import orderRouter from "./routes/orderRoutes";
import paymentRouter from "./routes/paymentRoutes";
import inventoryRouter from "./routes/inventoryRoutes";

// 创建 Express 应用
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 安全中间件
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

// 配置 CORS，允许前端域名访问
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// 请求限制中间件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  limit: 100, // 每个 IP 限制 100 个请求
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use("/api", limiter);

// 请求解析中间件
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// 日志中间件
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 静态文件服务
app.use(express.static(path.join(__dirname, "../public")));

// 健康检查路由
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "服务运行正常",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// 测试路由
app.get("/api/v1/test", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "测试路由正常",
    timestamp: new Date().toISOString(),
    inMemoryMode: global.useInMemoryMode || false,
  });
});

// API 路由
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/inventory", inventoryRouter);

// 404 处理
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `无法找到 ${req.originalUrl} 路径`,
  });
});

// 全局错误处理
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";

    res.status(statusCode).json({
      status,
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
);

export default app;
