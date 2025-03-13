import express from "express";
import { protect } from "../middleware/authMiddleware";
import * as paymentController from "../controllers/paymentController";

const router = express.Router();

// 创建支付
router.post("/create", protect, paymentController.createPayment);

// 处理支付回调
router.post("/webhook", paymentController.handlePaymentWebhook);

// 验证支付状态
router.get("/verify/:paymentId", protect, paymentController.verifyPayment);

// 获取支付方式列表
router.get("/methods", paymentController.getPaymentMethods);

export default router;
