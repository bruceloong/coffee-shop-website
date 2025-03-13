import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 从authController.ts导入mockUsers
import { mockUsers } from "./authController.js";

// 过滤对象，只保留允许的字段
const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// 生成JWT令牌
const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
};

// 创建并发送令牌
const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);

  // 设置cookie
  const cookieOptions: any = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "90") *
          24 *
          60 *
          60 *
          1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // 移除密码
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// 获取当前用户信息
export const getMe = (req: Request, res: Response, next: NextFunction) => {
  // 在内存模式下，用户对象的ID字段是_id
  if (global.useInMemoryMode) {
    req.params.id = (req as any).user._id;
  } else {
    req.params.id = (req as any).user.id;
  }
  next();
};

// 更新当前用户信息
export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 如果用户尝试更新密码，返回错误
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError("此路由不用于密码更新。请使用 /updateMyPassword", 400)
      );
    }

    // 过滤掉不允许更新的字段
    const filteredBody = filterObj(
      req.body,
      "name",
      "email",
      "phone",
      "address"
    );

    // 如果是内存模式
    if (global.useInMemoryMode) {
      // 查找用户
      const userIndex = mockUsers.findIndex(
        (user) => user._id === (req as any).user.id
      );

      if (userIndex === -1) {
        return next(new AppError("未找到用户", 404));
      }

      // 更新用户信息
      const updatedUser = {
        ...mockUsers[userIndex],
        ...filteredBody,
        updatedAt: new Date().toISOString(),
      };
      mockUsers[userIndex] = updatedUser;

      // 返回更新后的用户信息
      res.status(200).json({
        status: "success",
        data: {
          user: updatedUser,
        },
      });
      return;
    }

    // 数据库模式
    // 更新用户文档
    const updatedUser = await User.findByIdAndUpdate(
      (req as any).user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

// 删除当前用户（设置为非活跃）
export const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 如果是内存模式
    if (global.useInMemoryMode) {
      // 查找用户
      const userIndex = mockUsers.findIndex(
        (user) => user._id === (req as any).user.id
      );

      if (userIndex === -1) {
        return next(new AppError("未找到用户", 404));
      }

      // 设置用户为非活跃
      mockUsers[userIndex].active = false;

      // 返回成功信息
      res.status(204).json({
        status: "success",
        data: null,
      });
      return;
    }

    // 数据库模式
    await User.findByIdAndUpdate((req as any).user.id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

// 获取所有用户（仅管理员）
export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 如果是内存模式
    if (global.useInMemoryMode) {
      // 返回所有活跃用户
      const users = mockUsers.filter((user) => user.active !== false);

      // 返回用户列表
      res.status(200).json({
        status: "success",
        results: users.length,
        data: {
          users,
        },
      });
      return;
    }

    // 数据库模式
    const users = await User.find();

    // 返回用户列表
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  }
);

// 获取单个用户（仅管理员）
export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 如果是内存模式
    if (global.useInMemoryMode) {
      // 查找用户
      const user = mockUsers.find((user) => user._id === req.params.id);

      if (!user) {
        return next(new AppError("未找到该ID的用户", 404));
      }

      // 创建用户对象的副本，并移除密码
      const userResponse = { ...user };
      delete userResponse.password;

      // 返回用户信息
      res.status(200).json({
        status: "success",
        data: {
          user: userResponse,
        },
      });
      return;
    }

    // 数据库模式
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError("未找到该ID的用户", 404));
    }

    // 移除密码字段
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      status: "success",
      data: {
        user: userObj,
      },
    });
  }
);

// 创建用户（仅管理员）
export const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "此路由未定义！请使用 /signup 代替",
  });
};

// 更新用户（仅管理员）
export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 如果是内存模式
    if (global.useInMemoryMode) {
      // 查找用户
      const userIndex = mockUsers.findIndex(
        (user) => user._id === req.params.id
      );

      if (userIndex === -1) {
        return next(new AppError("未找到该ID的用户", 404));
      }

      // 过滤掉不允许更新的字段
      const filteredBody = filterObj(
        req.body,
        "name",
        "email",
        "role",
        "phone",
        "address"
      );

      // 更新用户信息
      const updatedUser = {
        ...mockUsers[userIndex],
        ...filteredBody,
        updatedAt: new Date().toISOString(),
      };
      mockUsers[userIndex] = updatedUser;

      // 返回更新后的用户信息
      res.status(200).json({
        status: "success",
        data: {
          user: updatedUser,
        },
      });
      return;
    }

    // 数据库模式
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new AppError("未找到该ID的用户", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

// 删除用户（仅管理员）
export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 如果是内存模式
    if (global.useInMemoryMode) {
      // 查找用户
      const userIndex = mockUsers.findIndex(
        (user) => user._id === req.params.id
      );

      if (userIndex === -1) {
        return next(new AppError("未找到该ID的用户", 404));
      }

      // 从数组中删除用户
      mockUsers.splice(userIndex, 1);

      // 返回成功信息
      res.status(204).json({
        status: "success",
        data: null,
      });
      return;
    }

    // 数据库模式
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new AppError("未找到该ID的用户", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
