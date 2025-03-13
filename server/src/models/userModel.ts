import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// 用户角色枚举
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

// 用户接口
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  // 方法
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}

// 用户 Schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "请提供用户名"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "请提供邮箱"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "请提供有效的邮箱地址",
      ],
    },
    password: {
      type: String,
      required: [true, "请提供密码"],
      minlength: [8, "密码长度至少为8个字符"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "请确认密码"],
      validate: {
        // 这个验证器只在CREATE和SAVE操作时有效
        validator: function (this: IUser, el: string) {
          return el === this.password;
        },
        message: "密码不匹配",
      },
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    avatar: String,
    phone: String,
    address: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// 索引
userSchema.index({ email: 1 }, { unique: true });

// 保存前中间件 - 加密密码
userSchema.pre("save", async function (next) {
  // 只有在密码被修改时才运行
  if (!this.isModified("password")) return next();

  // 加密密码
  this.password = await bcrypt.hash(this.password, 12);

  // 删除passwordConfirm字段
  this.passwordConfirm = undefined;
  next();
});

// 保存前中间件 - 更新密码修改时间
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  // 设置密码修改时间
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

// 查询中间件 - 过滤已停用的用户
userSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.find({ active: { $ne: false } });
  next();
});

// 实例方法 - 验证密码
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// 实例方法 - 检查密码是否在令牌签发后更改
userSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number
): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// 实例方法 - 创建密码重置令牌
userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 令牌10分钟内有效
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
