import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

// 导入路由
import userRouter from "./routes/userRoutes";
import productRouter from "./routes/productRoutes";
import orderRouter from "./routes/orderRoutes";
import paymentRouter from "./routes/paymentRoutes";
import inventoryRouter from "./routes/inventoryRoutes";

// 创建Express应用
const app = express();

// 全局中间件
// 实现CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// 开发日志
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 解析请求体
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 解析Cookie
app.use(cookieParser());

// 静态文件
const uploadsDir = process.env.UPLOAD_DIR || "uploads";
app.use(
  `/${uploadsDir}`,
  express.static(path.join(__dirname, "..", uploadsDir))
);

// API路由
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/inventory", inventoryRouter);

// 健康检查
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "服务器运行正常",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// 处理未找到的路由
app.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `找不到路径: ${req.originalUrl}`,
  });
});

// 全局错误处理中间件
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
