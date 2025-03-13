import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User, { IUser, UserRole } from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcryptjs";

// 内存模式的模拟数据
export const mockUsers = [
  {
    _id: "1",
    name: "管理员",
    email: "admin@example.com",
    password: "password123", // 使用明文密码用于测试
    role: "admin",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "测试用户",
    email: "user@example.com",
    password: "password123", // 使用明文密码用于测试
    role: "user",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "测试账户",
    email: "test@example.com",
    password: "password123", // 使用明文密码用于测试
    role: "user",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 测试密码是否正确
export async function testPassword() {
  const plainPassword = "password123";
  // 使用新生成的密码哈希
  const hashedPassword =
    "$2a$10$n5OQH0v0bwJpWn.rBxiEbOYgQT.jC5w.jmUZtxPQeMCOQC2/5XE0K";
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log("密码测试:", isMatch ? "匹配" : "不匹配");

  // 生成一个新的哈希用于参考
  const newHash = await bcrypt.hash(plainPassword, 10);
  console.log("新生成的哈希:", newHash);
}

// 为mockUsers添加方法
mockUsers.forEach((user) => {
  user.correctPassword = async function (candidatePassword, userPassword) {
    console.log("验证密码:", candidatePassword, "存储密码:", userPassword);
    // 在内存模式下直接比较明文密码
    return candidatePassword === userPassword;
  };

  user.changedPasswordAfter = function (timestamp) {
    return false;
  };

  user.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10分钟后过期
    return resetToken;
  };
});

// 生成JWT
const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// 发送 JWT Token
const createSendToken = (
  user: any,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "7") * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  // 设置 Cookie
  res.cookie("jwt", token, cookieOptions);

  // 创建用户对象的副本，并移除密码
  let userResponse = { ...user };
  if (typeof userResponse.toObject === "function") {
    // 如果是Mongoose文档，使用toObject方法
    userResponse = userResponse.toObject();
  }
  delete userResponse.password;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: userResponse,
    },
  });
};

// 注册用户
export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm, phone, address } = req.body;

    // 如果是内存模式
    if (global.useInMemoryMode) {
      // 检查邮箱是否已存在
      const existingUser = mockUsers.find((user) => user.email === email);
      if (existingUser) {
        return next(new AppError("该邮箱已被注册", 400));
      }

      // 检查密码确认
      if (password !== passwordConfirm) {
        return next(new AppError("密码不匹配", 400));
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 12);

      // 创建新用户
      const newUser = {
        _id: (mockUsers.length + 1).toString(),
        name,
        email,
        password: hashedPassword,
        role: "user" as UserRole,
        phone: phone || "",
        address: address || "",
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        correctPassword: async function (
          candidatePassword: string,
          userPassword: string
        ) {
          return await bcrypt.compare(candidatePassword, userPassword);
        },
        changedPasswordAfter: function (timestamp: number) {
          return false;
        },
        createPasswordResetToken: function () {
          const resetToken = crypto.randomBytes(32).toString("hex");
          this.passwordResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
          this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10分钟后过期
          return resetToken;
        },
      };

      // 添加到模拟用户列表
      mockUsers.push(newUser);

      // 发送 JWT
      createSendToken(newUser, 201, req, res);
      return;
    }

    // 数据库模式
    // 创建新用户
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      phone,
      address,
      role: UserRole.USER, // 确保普通注册用户只能是 USER 角色
    });

    // 发送 JWT
    createSendToken(newUser, 201, req, res);
  }
);

// 登录用户
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 检查是否提供了邮箱和密码
    if (!email || !password) {
      return next(new AppError("请提供邮箱和密码", 400));
    }

    console.log("登录尝试:", email, "内存模式:", global.useInMemoryMode);

    // 如果是内存模式
    if (global.useInMemoryMode) {
      // 查找用户
      const user = mockUsers.find((user) => user.email === email);
      console.log("找到用户:", user ? "是" : "否");

      if (user) {
        const passwordCorrect = await user.correctPassword(
          password,
          user.password
        );
        console.log("密码正确:", passwordCorrect ? "是" : "否");
      }

      // 检查用户是否存在以及密码是否正确
      if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("邮箱或密码不正确", 401));
      }

      // 发送 JWT
      createSendToken(user, 200, req, res);
      return;
    }

    // 数据库模式
    // 查找用户并选择密码字段
    const user = await User.findOne({ email }).select("+password");

    // 检查用户是否存在以及密码是否正确
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("邮箱或密码不正确", 401));
    }

    // 发送 JWT
    createSendToken(user, 200, req, res);
  }
);

// 登出用户
export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

// 保护路由中间件
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 获取 Token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError("您未登录，请先登录以获取访问权限", 401));
    }

    // 验证 Token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { id: string; iat: number };

    // 如果是内存模式
    if (global.useInMemoryMode) {
      // 检查用户是否仍然存在
      const currentUser = mockUsers.find((user) => user._id === decoded.id);
      if (!currentUser) {
        return next(new AppError("此令牌对应的用户不再存在", 401));
      }

      // 检查用户是否在令牌签发后更改了密码
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("用户最近更改了密码，请重新登录", 401));
      }

      // 将用户信息添加到请求对象
      (req as any).user = currentUser;
      next();
      return;
    }

    // 数据库模式
    // 检查用户是否仍然存在
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError("此令牌对应的用户不再存在", 401));
    }

    // 检查用户是否在令牌签发后更改了密码
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError("用户最近更改了密码，请重新登录", 401));
    }

    // 将用户信息添加到请求对象
    (req as any).user = currentUser;
    next();
  }
);

// 限制角色访问
export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return next(new AppError("您没有执行此操作的权限", 403));
    }
    next();
  };
};

// 忘记密码
export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 如果是内存模式
    if (global.useInMemoryMode) {
      // 根据提供的邮箱查找用户
      const user = mockUsers.find((user) => user.email === req.body.email);
      if (!user) {
        return next(new AppError("没有找到使用该邮箱的用户", 404));
      }

      // 生成随机重置令牌
      const resetToken = user.createPasswordResetToken();

      try {
        // 在实际应用中，这里应该发送重置密码邮件
        // 但在此示例中，我们只返回重置令牌
        res.status(200).json({
          status: "success",
          message: "重置令牌已发送到您的邮箱",
          resetToken, // 注意：在生产环境中不应该直接返回令牌
        });
      } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        return next(new AppError("发送邮件时出错，请稍后再试", 500));
      }
      return;
    }

    // 数据库模式
    // 根据提供的邮箱查找用户
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("没有找到使用该邮箱的用户", 404));
    }

    // 生成随机重置令牌
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      // 在实际应用中，这里应该发送重置密码邮件
      // 但在此示例中，我们只返回重置令牌
      res.status(200).json({
        status: "success",
        message: "重置令牌已发送到您的邮箱",
        resetToken, // 注意：在生产环境中不应该直接返回令牌
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new AppError("发送邮件时出错，请稍后再试", 500));
    }
  }
);

// 重置密码
export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 获取用户基于令牌
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // 如果是内存模式
    if (global.useInMemoryMode) {
      const user = mockUsers.find(
        (user) =>
          user.passwordResetToken === hashedToken &&
          user.passwordResetExpires &&
          new Date(user.passwordResetExpires).getTime() > Date.now()
      );

      // 检查令牌是否有效
      if (!user) {
        return next(new AppError("令牌无效或已过期", 400));
      }

      // 更新密码
      user.password = await bcrypt.hash(req.body.password, 12);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      // 登录用户，发送 JWT
      createSendToken(user, 200, req, res);
      return;
    }

    // 数据库模式
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 检查令牌是否有效
    if (!user) {
      return next(new AppError("令牌无效或已过期", 400));
    }

    // 更新密码
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 登录用户，发送 JWT
    createSendToken(user, 200, req, res);
  }
);

// 更新密码
export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 如果是内存模式
    if (global.useInMemoryMode) {
      // 获取用户
      const user = mockUsers.find((user) => user._id === (req as any).user.id);

      if (!user) {
        return next(new AppError("用户不存在", 404));
      }

      // 检查当前密码是否正确
      if (
        !(await user.correctPassword(req.body.passwordCurrent, user.password))
      ) {
        return next(new AppError("您的当前密码不正确", 401));
      }

      // 更新密码
      user.password = await bcrypt.hash(req.body.password, 12);

      // 登录用户，发送 JWT
      createSendToken(user, 200, req, res);
      return;
    }

    // 数据库模式
    // 获取用户
    const user = await User.findById((req as any).user.id).select("+password");

    if (!user) {
      return next(new AppError("用户不存在", 404));
    }

    // 检查当前密码是否正确
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("您的当前密码不正确", 401));
    }

    // 更新密码
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 登录用户，发送 JWT
    createSendToken(user, 200, req, res);
  }
);
