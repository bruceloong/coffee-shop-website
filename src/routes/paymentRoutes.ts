import express from "express";
import * as paymentController from "../controllers/paymentController";
import * as authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// 公共路由
router.post("/webhook", paymentController.handlePaymentWebhook);
router.get("/methods", paymentController.getPaymentMethods);

// 保护的路由 - 需要登录
router.use(authMiddleware.protect);

router.post("/create", paymentController.createPayment);
router.get("/verify/:paymentId", paymentController.verifyPayment);

export default router;
