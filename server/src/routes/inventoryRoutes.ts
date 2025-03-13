import express from "express";
import * as inventoryController from "../controllers/inventoryController.js";
import * as authController from "../controllers/authController.js";
import { UserRole } from "../models/userModel.js";

const router = express.Router();

// 所有路由都需要认证和管理员权限
router.use(authController.protect);
router.use(authController.restrictTo(UserRole.ADMIN));

// 库存记录路由
router.get("/", inventoryController.getAllInventoryRecords);
router.get("/:id", inventoryController.getInventoryRecord);
router.get(
  "/product/:productId",
  inventoryController.getProductInventoryRecords
);

// 库存操作路由
router.post("/product/:productId/add", inventoryController.addInventory);
router.post("/product/:productId/remove", inventoryController.removeInventory);
router.post("/product/:productId/adjust", inventoryController.adjustInventory);

export default router;
