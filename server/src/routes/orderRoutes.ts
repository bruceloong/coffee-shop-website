import express from "express";
import * as orderController from "../controllers/orderController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// 保护所有订单路由，需要登录
router.use(authController.protect);

// 获取当前用户的订单
router.get("/my-orders", orderController.getMyOrders);

// 创建新订单
router.post("/", orderController.createOrder);

// 取消订单
router.patch("/:id/cancel", orderController.cancelOrder);

// 以下路由需要管理员权限
router.use(authController.restrictTo("admin"));

// 获取所有订单
router.get("/", orderController.getAllOrders);

// 获取单个订单
router.get("/:id", orderController.getOrder);

// 更新订单状态
router.patch("/:id/status", orderController.updateOrderStatus);

export default router;
