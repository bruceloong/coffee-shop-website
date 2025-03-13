import express from "express";
import * as productController from "../controllers/productController";
import * as authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// 公共路由
router.get("/", productController.getAllProducts);
router.get("/categories", productController.getProductCategories);
router.get("/:id", productController.getProduct);
router.get("/:id/reviews", productController.getProductReviews);

// 保护的路由 - 需要登录
router.use(authMiddleware.protect);

// 添加产品评论
router.post("/:id/reviews", productController.addProductReview);

// 管理员路由 - 需要管理员权限
router.use(authMiddleware.restrictTo("admin"));

router.route("/").post(productController.createProduct);

router
  .route("/:id")
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;
