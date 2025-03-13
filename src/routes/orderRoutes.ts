import express from "express";
import * as orderController from "../controllers/orderController";
import * as authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// 保护的路由 - 需要登录
router.use(authMiddleware.protect);

// 用户订单路由
router.get("/my", orderController.getMyOrders);
router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrder);
router.patch("/:id/cancel", orderController.cancelOrder);

// 管理员路由 - 需要管理员权限
router.use(authMiddleware.restrictTo("admin"));

router.get("/", orderController.getAllOrders);
router.get("/stats", orderController.getOrderStats);
router.patch("/:id/status", orderController.updateOrderStatus);

export default router;
