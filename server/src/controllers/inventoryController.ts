import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import InventoryRecord, {
  InventoryOperationType,
} from "../models/inventoryModel.js";
import Product from "../models/productModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// 获取所有库存记录
export const getAllInventoryRecords = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 构建查询
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 高级过滤
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = InventoryRecord.find(JSON.parse(queryStr));

    // 排序
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // 字段限制
    if (req.query.fields) {
      const fields = (req.query.fields as string).split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // 分页
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // 执行查询
    const records = await query;

    // 发送响应
    res.status(200).json({
      status: "success",
      results: records.length,
      data: {
        records,
      },
    });
  }
);

// 获取单个库存记录
export const getInventoryRecord = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const record = await InventoryRecord.findById(req.params.id);

    if (!record) {
      return next(new AppError("没有找到该ID的库存记录", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        record,
      },
    });
  }
);

// 获取产品的库存记录
export const getProductInventoryRecords = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;

    // 验证产品ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new AppError("无效的产品ID", 400));
    }

    // 检查产品是否存在
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError("没有找到该ID的产品", 404));
    }

    // 获取该产品的所有库存记录
    const records = await InventoryRecord.find({ product: productId }).sort(
      "-createdAt"
    );

    res.status(200).json({
      status: "success",
      results: records.length,
      data: {
        records,
      },
    });
  }
);

// 添加库存
export const addInventory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const { quantity, note } = req.body;
    const operatorId = (req as any).user.id;

    // 验证输入
    if (!quantity || quantity <= 0) {
      return next(new AppError("请提供有效的数量", 400));
    }

    // 验证产品ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new AppError("无效的产品ID", 400));
    }

    // 开始事务
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 获取产品
      const product = await Product.findById(productId).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return next(new AppError("没有找到该ID的产品", 404));
      }

      // 记录之前的库存
      const previousStock = product.stock;

      // 更新产品库存
      const newStock = previousStock + quantity;
      product.stock = newStock;
      await product.save({ session });

      // 创建库存记录
      const record = await InventoryRecord.create(
        [
          {
            product: productId,
            operationType: InventoryOperationType.ADD,
            quantity,
            previousStock,
            currentStock: newStock,
            note,
            operator: operatorId,
          },
        ],
        { session }
      );

      // 提交事务
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        status: "success",
        data: {
          record: record[0],
        },
      });
    } catch (error) {
      // 回滚事务
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("添加库存失败", 500));
    }
  }
);

// 减少库存
export const removeInventory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const { quantity, note } = req.body;
    const operatorId = (req as any).user.id;

    // 验证输入
    if (!quantity || quantity <= 0) {
      return next(new AppError("请提供有效的数量", 400));
    }

    // 验证产品ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new AppError("无效的产品ID", 400));
    }

    // 开始事务
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 获取产品
      const product = await Product.findById(productId).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return next(new AppError("没有找到该ID的产品", 404));
      }

      // 检查库存是否足够
      if (product.stock < quantity) {
        await session.abortTransaction();
        session.endSession();
        return next(new AppError("库存不足", 400));
      }

      // 记录之前的库存
      const previousStock = product.stock;

      // 更新产品库存
      const newStock = previousStock - quantity;
      product.stock = newStock;
      await product.save({ session });

      // 创建库存记录
      const record = await InventoryRecord.create(
        [
          {
            product: productId,
            operationType: InventoryOperationType.REMOVE,
            quantity,
            previousStock,
            currentStock: newStock,
            note,
            operator: operatorId,
          },
        ],
        { session }
      );

      // 提交事务
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        status: "success",
        data: {
          record: record[0],
        },
      });
    } catch (error) {
      // 回滚事务
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("减少库存失败", 500));
    }
  }
);

// 调整库存
export const adjustInventory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const { newStock, note } = req.body;
    const operatorId = (req as any).user.id;

    // 验证输入
    if (newStock === undefined || newStock < 0) {
      return next(new AppError("请提供有效的新库存数量", 400));
    }

    // 验证产品ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new AppError("无效的产品ID", 400));
    }

    // 开始事务
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 获取产品
      const product = await Product.findById(productId).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return next(new AppError("没有找到该ID的产品", 404));
      }

      // 记录之前的库存
      const previousStock = product.stock;

      // 计算调整数量
      const adjustQuantity = Math.abs(newStock - previousStock);

      // 更新产品库存
      product.stock = newStock;
      await product.save({ session });

      // 创建库存记录
      const record = await InventoryRecord.create(
        [
          {
            product: productId,
            operationType: InventoryOperationType.ADJUST,
            quantity: adjustQuantity,
            previousStock,
            currentStock: newStock,
            note,
            operator: operatorId,
          },
        ],
        { session }
      );

      // 提交事务
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        status: "success",
        data: {
          record: record[0],
        },
      });
    } catch (error) {
      // 回滚事务
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("调整库存失败", 500));
    }
  }
);
