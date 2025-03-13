import express from "express";
import * as productController from "../controllers/productController.js";
import * as authController from "../controllers/authController.js";
import { UserRole } from "../models/userModel.js";

const router = express.Router();

// 公共路由
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);
router.get("/category/:category", productController.getProductsByCategory);

// 以下路由需要管理员权限
router.use(authController.protect);
router.use(authController.restrictTo(UserRole.ADMIN));

router.post("/", productController.createProduct);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.patch("/:id/stock", productController.updateProductStock);

export default router;
