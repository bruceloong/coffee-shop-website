import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User, { UserRole } from "../models/userModel";
import memoryData from "../services/memoryDataService";

// 生成JWT令牌
const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
};

// 创建并发送令牌
const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "90") *
          24 *
          60 *
          60 *
          1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  // 发送JWT作为Cookie
  res.cookie("jwt", token, cookieOptions);

  // 从输出中删除密码
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// 注册新用户
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 检查是否已存在相同邮箱的用户
    const existingUser =
      process.env.USE_MEMORY_DB === "true"
        ? memoryData.getUserByEmail(req.body.email)
        : await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "该邮箱已被注册",
      });
    }

    // 创建新用户
    const newUser =
      process.env.USE_MEMORY_DB === "true"
        ? memoryData.createUser({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 12),
            passwordConfirm: undefined,
            role: req.body.role === "admin" ? UserRole.ADMIN : UserRole.USER,
            active: true,
          })
        : await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
          });

    createSendToken(newUser, 201, res);
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 用户登录
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // 检查是否提供了邮箱和密码
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "请提供邮箱和密码",
      });
    }

    // 查找用户
    let user;
    if (process.env.USE_MEMORY_DB === "true") {
      user = memoryData.getUserByEmail(email);
    } else {
      // 查找用户并选择密码字段
      user = await User.findOne({ email }).select("+password");
    }

    // 检查用户是否存在以及密码是否正确
    if (
      !user ||
      !(process.env.USE_MEMORY_DB === "true"
        ? await bcrypt.compare(password, user.password)
        : await user.correctPassword(password, user.password))
    ) {
      return res.status(401).json({
        status: "fail",
        message: "邮箱或密码不正确",
      });
    }

    // 发送令牌
    createSendToken(user, 200, res);
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 用户登出
export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

// 获取当前用户信息
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let user;
    if (process.env.USE_MEMORY_DB === "true") {
      user = memoryData.getUserById(req.user.id);
    } else {
      user = await User.findById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "未找到该用户",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 更新当前用户信息
export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 不允许更新密码
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "此路由不用于密码更新。请使用 /updatePassword",
      });
    }

    // 过滤掉不允许更新的字段
    const filteredBody: any = {};
    const allowedFields = ["name", "email", "phone", "address", "avatar"];
    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) {
        filteredBody[field] = req.body[field];
      }
    });

    // 更新用户
    let updatedUser;
    if (process.env.USE_MEMORY_DB === "true") {
      updatedUser = memoryData.updateUser(req.user.id, filteredBody);
    } else {
      updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 更新密码
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 获取用户
    let user;
    if (process.env.USE_MEMORY_DB === "true") {
      user = memoryData.getUserById(req.user.id);
    } else {
      user = await User.findById(req.user.id).select("+password");
    }

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "未找到该用户",
      });
    }

    // 检查当前密码是否正确
    const isPasswordCorrect =
      process.env.USE_MEMORY_DB === "true"
        ? await bcrypt.compare(req.body.currentPassword, user.password)
        : await user.correctPassword(req.body.currentPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "当前密码不正确",
      });
    }

    // 更新密码
    if (process.env.USE_MEMORY_DB === "true") {
      user = memoryData.updateUser(req.user.id, {
        password: await bcrypt.hash(req.body.newPassword, 12),
      });
    } else {
      user.password = req.body.newPassword;
      user.passwordConfirm = req.body.newPasswordConfirm;
      await user.save();
    }

    // 发送新令牌
    createSendToken(user, 200, res);
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 获取所有用户（仅管理员）
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users =
      process.env.USE_MEMORY_DB === "true"
        ? memoryData.getUsers()
        : await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 获取单个用户（仅管理员）
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user =
      process.env.USE_MEMORY_DB === "true"
        ? memoryData.getUserById(req.params.id)
        : await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "未找到该用户",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 更新用户（仅管理员）
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 过滤掉不允许更新的字段
    const filteredBody: any = {};
    const allowedFields = [
      "name",
      "email",
      "role",
      "active",
      "phone",
      "address",
      "avatar",
    ];
    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) {
        filteredBody[field] = req.body[field];
      }
    });

    // 更新用户
    let updatedUser;
    if (process.env.USE_MEMORY_DB === "true") {
      updatedUser = memoryData.updateUser(req.params.id, filteredBody);
      if (!updatedUser) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该用户",
        });
      }
    } else {
      updatedUser = await User.findByIdAndUpdate(req.params.id, filteredBody, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该用户",
        });
      }
    }

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 删除用户（仅管理员）
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (process.env.USE_MEMORY_DB === "true") {
      const deletedUser = memoryData.deleteUser(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该用户",
        });
      }
    } else {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该用户",
        });
      }
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
