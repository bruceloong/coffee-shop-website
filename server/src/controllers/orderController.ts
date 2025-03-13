import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Order, { OrderStatus } from "../models/orderModel.js";
import Product from "../models/productModel.js";
import InventoryRecord, {
  InventoryOperationType,
} from "../models/inventoryModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { mockUsers } from "./authController.js";
import { mockProducts } from "./productController.js";

// 内存模式的模拟数据
const mockOrders = [];
const mockInventoryRecords = [];

// 生成订单号
const generateOrderNumber = (): string => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `BH${timestamp}${random}`;
};

// 获取所有订单
export const getAllOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 如果是内存模式
    if (global.useInMemoryMode) {
      // 简单的过滤和分页
      let filteredOrders = [...mockOrders];

      // 排序
      if (req.query.sort) {
        const sortBy = req.query.sort as string;
        if (sortBy === "createdAt") {
          filteredOrders.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        } else if (sortBy === "-createdAt") {
          filteredOrders.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      } else {
        // 默认按创建时间降序排序
        filteredOrders.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      // 分页
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

      return res.status(200).json({
        status: "success",
        results: paginatedOrders.length,
        data: {
          orders: paginatedOrders,
        },
      });
    }

    // 数据库模式
    // 构建查询
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 高级过滤
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Order.find(JSON.parse(queryStr));

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
    const orders = await query;

    // 发送响应
    res.status(200).json({
      status: "success",
      results: orders.length,
      data: {
        orders,
      },
    });
  }
);

// 获取当前用户的订单
export const getMyOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    // 如果是内存模式
    if (global.useInMemoryMode) {
      // 查询用户的所有订单
      const orders = mockOrders
        .filter((order) => order.user === userId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      return res.status(200).json({
        status: "success",
        results: orders.length,
        data: {
          orders,
        },
      });
    }

    // 数据库模式
    // 查询用户的所有订单
    const orders = await Order.find({ user: userId }).sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: {
        orders,
      },
    });
  }
);

// 获取单个订单
export const getOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 如果是内存模式
    if (global.useInMemoryMode) {
      const order = mockOrders.find((order) => order._id === req.params.id);

      if (!order) {
        return next(new AppError("没有找到该ID的订单", 404));
      }

      // 检查是否是当前用户的订单或管理员
      if (
        order.user !== (req as any).user.id &&
        (req as any).user.role !== "admin"
      ) {
        return next(new AppError("您没有权限访问此订单", 403));
      }

      return res.status(200).json({
        status: "success",
        data: {
          order,
        },
      });
    }

    // 数据库模式
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError("没有找到该ID的订单", 404));
    }

    // 检查是否是当前用户的订单或管理员
    if (
      order.user.id !== (req as any).user.id &&
      (req as any).user.role !== "admin"
    ) {
      return next(new AppError("您没有权限访问此订单", 403));
    }

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  }
);

// 创建订单
export const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { items, paymentMethod, contactInfo, note } = req.body;
    const userId = (req as any).user.id;

    // 验证输入
    if (!items || !items.length) {
      return next(new AppError("订单必须包含商品", 400));
    }

    if (!contactInfo || !contactInfo.name || !contactInfo.phone) {
      return next(new AppError("请提供联系人信息", 400));
    }

    // 如果是内存模式
    if (global.useInMemoryMode) {
      try {
        // 计算总金额并验证商品
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
          const { productId, quantity } = item;

          // 获取产品
          const product = mockProducts.find((p) => p._id === productId);
          if (!product) {
            return next(new AppError(`没有找到ID为 ${productId} 的产品`, 404));
          }

          // 检查库存
          if (product.quantity < quantity) {
            return next(new AppError(`产品 ${product.name} 库存不足`, 400));
          }

          // 减少库存
          const previousStock = product.quantity;
          const newStock = previousStock - quantity;
          product.quantity = newStock;
          product.updatedAt = new Date().toISOString();

          // 创建库存记录
          const inventoryRecord = {
            _id: (mockInventoryRecords.length + 1).toString(),
            product: productId,
            operationType: InventoryOperationType.REMOVE,
            quantity,
            previousStock,
            currentStock: newStock,
            note: `订单消耗: ${generateOrderNumber()}`,
            operator: userId,
            createdAt: new Date().toISOString(),
          };
          mockInventoryRecords.push(inventoryRecord);

          // 添加到订单项
          orderItems.push({
            product: productId,
            name: product.name,
            price: product.price,
            quantity,
          });

          // 计算总金额
          totalAmount += product.price * quantity;
        }

        // 创建订单
        const orderNumber = generateOrderNumber();
        const newOrder = {
          _id: (mockOrders.length + 1).toString(),
          orderNumber,
          user: userId,
          items: orderItems,
          totalAmount,
          paymentMethod,
          contactInfo,
          note,
          status: OrderStatus.PENDING,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        mockOrders.push(newOrder);

        res.status(201).json({
          status: "success",
          data: {
            order: newOrder,
          },
        });
      } catch (error) {
        return next(new AppError("创建订单失败", 500));
      }
      return;
    }

    // 数据库模式
    // 开始事务
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 计算总金额并验证商品
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const { productId, quantity } = item;

        // 验证产品ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
          await session.abortTransaction();
          session.endSession();
          return next(new AppError("无效的产品ID", 400));
        }

        // 获取产品
        const product = await Product.findById(productId).session(session);
        if (!product) {
          await session.abortTransaction();
          session.endSession();
          return next(new AppError(`没有找到ID为 ${productId} 的产品`, 404));
        }

        // 检查库存
        if (product.stock < quantity) {
          await session.abortTransaction();
          session.endSession();
          return next(new AppError(`产品 ${product.name} 库存不足`, 400));
        }

        // 减少库存
        const previousStock = product.stock;
        const newStock = previousStock - quantity;
        product.stock = newStock;
        await product.save({ session });

        // 创建库存记录
        await InventoryRecord.create(
          [
            {
              product: productId,
              operationType: InventoryOperationType.REMOVE,
              quantity,
              previousStock,
              currentStock: newStock,
              note: `订单消耗: ${generateOrderNumber()}`,
              operator: userId,
            },
          ],
          { session }
        );

        // 添加到订单项
        orderItems.push({
          product: productId,
          name: product.name,
          price: product.price,
          quantity,
        });

        // 计算总金额
        totalAmount += product.price * quantity;
      }

      // 创建订单
      const orderNumber = generateOrderNumber();
      const newOrder = await Order.create(
        [
          {
            orderNumber,
            user: userId,
            items: orderItems,
            totalAmount,
            paymentMethod,
            contactInfo,
            note,
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
          order: newOrder[0],
        },
      });
    } catch (error) {
      // 回滚事务
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("创建订单失败", 500));
    }
  }
);

// 更新订单状态
export const updateOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    // 验证状态是否有效
    if (!Object.values(OrderStatus).includes(status)) {
      return next(new AppError("无效的订单状态", 400));
    }

    // 如果是内存模式
    if (global.useInMemoryMode) {
      // 获取订单
      const orderIndex = mockOrders.findIndex((order) => order._id === id);
      if (orderIndex === -1) {
        return next(new AppError("没有找到该ID的订单", 404));
      }

      // 更新状态和相应的时间戳
      mockOrders[orderIndex].status = status;
      mockOrders[orderIndex].updatedAt = new Date().toISOString();

      if (status === OrderStatus.PAID) {
        mockOrders[orderIndex].paidAt = new Date().toISOString();
      } else if (status === OrderStatus.COMPLETED) {
        mockOrders[orderIndex].completedAt = new Date().toISOString();
      } else if (status === OrderStatus.CANCELLED) {
        mockOrders[orderIndex].cancelledAt = new Date().toISOString();
      } else if (status === OrderStatus.REFUNDED) {
        mockOrders[orderIndex].refundedAt = new Date().toISOString();
      }

      return res.status(200).json({
        status: "success",
        data: {
          order: mockOrders[orderIndex],
        },
      });
    }

    // 数据库模式
    // 获取订单
    const order = await Order.findById(id);
    if (!order) {
      return next(new AppError("没有找到该ID的订单", 404));
    }

    // 更新状态和相应的时间戳
    order.status = status;
    if (status === OrderStatus.PAID) {
      order.paidAt = new Date();
    } else if (status === OrderStatus.COMPLETED) {
      order.completedAt = new Date();
    } else if (status === OrderStatus.CANCELLED) {
      order.cancelledAt = new Date();
    } else if (status === OrderStatus.REFUNDED) {
      order.refundedAt = new Date();
    }

    await order.save();

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  }
);

// 取消订单
export const cancelOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // 如果是内存模式
    if (global.useInMemoryMode) {
      try {
        // 获取订单
        const orderIndex = mockOrders.findIndex((order) => order._id === id);
        if (orderIndex === -1) {
          return next(new AppError("没有找到该ID的订单", 404));
        }

        const order = mockOrders[orderIndex];

        // 检查是否是当前用户的订单或管理员
        if (order.user !== userId && (req as any).user.role !== "admin") {
          return next(new AppError("您没有权限取消此订单", 403));
        }

        // 检查订单状态是否可以取消
        if (
          order.status !== OrderStatus.PENDING &&
          order.status !== OrderStatus.PAID
        ) {
          return next(new AppError("只有待支付或已支付的订单可以取消", 400));
        }

        // 恢复库存
        for (const item of order.items) {
          const productIndex = mockProducts.findIndex(
            (p) => p._id === item.product
          );
          if (productIndex !== -1) {
            const product = mockProducts[productIndex];
            const previousStock = product.quantity;
            const newStock = previousStock + item.quantity;
            product.quantity = newStock;
            product.updatedAt = new Date().toISOString();

            // 创建库存记录
            const inventoryRecord = {
              _id: (mockInventoryRecords.length + 1).toString(),
              product: item.product,
              operationType: InventoryOperationType.ADD,
              quantity: item.quantity,
              previousStock,
              currentStock: newStock,
              note: `订单取消恢复: ${order.orderNumber}`,
              operator: userId,
              createdAt: new Date().toISOString(),
            };
            mockInventoryRecords.push(inventoryRecord);
          }
        }

        // 更新订单状态
        order.status = OrderStatus.CANCELLED;
        order.cancelledAt = new Date().toISOString();
        order.updatedAt = new Date().toISOString();

        return res.status(200).json({
          status: "success",
          data: {
            order,
          },
        });
      } catch (error) {
        return next(new AppError("取消订单失败", 500));
      }
      return;
    }

    // 数据库模式
    // 开始事务
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 获取订单
      const order = await Order.findById(id).session(session);
      if (!order) {
        await session.abortTransaction();
        session.endSession();
        return next(new AppError("没有找到该ID的订单", 404));
      }

      // 检查是否是当前用户的订单或管理员
      if (order.user.id !== userId && (req as any).user.role !== "admin") {
        await session.abortTransaction();
        session.endSession();
        return next(new AppError("您没有权限取消此订单", 403));
      }

      // 检查订单状态是否可以取消
      if (
        order.status !== OrderStatus.PENDING &&
        order.status !== OrderStatus.PAID
      ) {
        await session.abortTransaction();
        session.endSession();
        return next(new AppError("只有待支付或已支付的订单可以取消", 400));
      }

      // 恢复库存
      for (const item of order.items) {
        const product = await Product.findById(item.product).session(session);
        if (product) {
          const previousStock = product.stock;
          const newStock = previousStock + item.quantity;
          product.stock = newStock;
          await product.save({ session });

          // 创建库存记录
          await InventoryRecord.create(
            [
              {
                product: item.product,
                operationType: InventoryOperationType.ADD,
                quantity: item.quantity,
                previousStock,
                currentStock: newStock,
                note: `订单取消恢复: ${order.orderNumber}`,
                operator: userId,
              },
            ],
            { session }
          );
        }
      }

      // 更新订单状态
      order.status = OrderStatus.CANCELLED;
      order.cancelledAt = new Date();
      await order.save({ session });

      // 提交事务
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        status: "success",
        data: {
          order,
        },
      });
    } catch (error) {
      // 回滚事务
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("取消订单失败", 500));
    }
  }
);
