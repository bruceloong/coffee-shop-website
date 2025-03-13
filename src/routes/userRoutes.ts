import express from "express";
import * as userController from "../controllers/userController";
import * as authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// 公共路由
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/logout", userController.logout);

// 保护的路由 - 需要登录
router.use(authMiddleware.protect);

router.get("/me", userController.getMe);
router.patch("/updateMe", userController.updateMe);
router.patch("/updatePassword", userController.updatePassword);

// 管理员路由 - 需要管理员权限
router.use(authMiddleware.restrictTo("admin"));

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
