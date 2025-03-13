import { Request, Response, NextFunction } from "express";
import Order, { OrderStatus } from "../models/orderModel";
import Product from "../models/productModel";
import memoryData from "../services/memoryDataService";

// 创建订单
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { items, paymentMethod, contactInfo, note } = req.body;

    // 验证订单项
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "订单必须包含至少一个商品",
      });
    }

    // 验证联系信息
    if (!contactInfo || !contactInfo.name || !contactInfo.phone) {
      return res.status(400).json({
        status: "fail",
        message: "请提供联系人姓名和电话",
      });
    }

    // 计算总金额并验证商品
    let totalAmount = 0;
    const orderItems = [];

    if (process.env.USE_MEMORY_DB === "true") {
      // 内存数据模式
      for (const item of items) {
        const product = memoryData.getProductById(item.product);

        if (!product) {
          return res.status(404).json({
            status: "fail",
            message: `未找到ID为 ${item.product} 的商品`,
          });
        }

        if (!product.inStock || product.quantity < item.quantity) {
          return res.status(400).json({
            status: "fail",
            message: `商品 ${product.name} 库存不足`,
          });
        }

        // 计算商品价格（考虑折扣）
        const price = product.discount
          ? product.price * (1 - product.discount / 100)
          : product.price;

        totalAmount += price * item.quantity;

        orderItems.push({
          product: item.product,
          quantity: item.quantity,
          price: price,
        });

        // 更新库存
        memoryData.updateProduct(product._id, {
          quantity: product.quantity - item.quantity,
          inStock: product.quantity - item.quantity > 0,
        });
      }

      // 创建订单
      const newOrder = memoryData.createOrder({
        user: req.user.id,
        items: orderItems,
        totalAmount,
        status: OrderStatus.PENDING,
        paymentMethod,
        contactInfo,
        note,
      });

      res.status(201).json({
        status: "success",
        data: {
          order: newOrder,
        },
      });
    } else {
      // MongoDB模式
      for (const item of items) {
        const product = await Product.findById(item.product);

        if (!product) {
          return res.status(404).json({
            status: "fail",
            message: `未找到ID为 ${item.product} 的商品`,
          });
        }

        if (!product.inStock || product.quantity < item.quantity) {
          return res.status(400).json({
            status: "fail",
            message: `商品 ${product.name} 库存不足`,
          });
        }

        // 计算商品价格（考虑折扣）
        const price = product.discount
          ? product.price * (1 - product.discount / 100)
          : product.price;

        totalAmount += price * item.quantity;

        orderItems.push({
          product: item.product,
          quantity: item.quantity,
          price: price,
        });

        // 更新库存
        product.quantity -= item.quantity;
        product.inStock = product.quantity > 0;
        await product.save();
      }

      // 生成订单号
      const orderCount = await Order.countDocuments();
      const orderNumber = `ORD-${new Date().getFullYear()}-${(orderCount + 1)
        .toString()
        .padStart(4, "0")}`;

      // 创建订单
      const newOrder = await Order.create({
        orderNumber,
        user: req.user.id,
        items: orderItems,
        totalAmount,
        status: OrderStatus.PENDING,
        paymentMethod,
        contactInfo,
        note,
      });

      res.status(201).json({
        status: "success",
        data: {
          order: newOrder,
        },
      });
    }
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 获取当前用户的所有订单
export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let orders;

    if (process.env.USE_MEMORY_DB === "true") {
      orders = memoryData.getOrdersByUser(req.user.id);
    } else {
      orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    }

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: {
        orders,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 获取单个订单
export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let order;

    if (process.env.USE_MEMORY_DB === "true") {
      order = memoryData.getOrderById(req.params.id);

      // 检查订单是否存在
      if (!order) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该订单",
        });
      }

      // 检查用户是否有权限查看该订单
      if (order.user !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({
          status: "fail",
          message: "您无权查看该订单",
        });
      }
    } else {
      order = await Order.findById(req.params.id);

      // 检查订单是否存在
      if (!order) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该订单",
        });
      }

      // 检查用户是否有权限查看该订单
      if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({
          status: "fail",
          message: "您无权查看该订单",
        });
      }
    }

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 取消订单
export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let order;

    if (process.env.USE_MEMORY_DB === "true") {
      order = memoryData.getOrderById(req.params.id);

      // 检查订单是否存在
      if (!order) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该订单",
        });
      }

      // 检查用户是否有权限取消该订单
      if (order.user !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({
          status: "fail",
          message: "您无权取消该订单",
        });
      }

      // 检查订单状态是否可以取消
      if (
        order.status !== OrderStatus.PENDING &&
        order.status !== OrderStatus.PAID
      ) {
        return res.status(400).json({
          status: "fail",
          message: "该订单状态无法取消",
        });
      }

      // 更新订单状态
      order = memoryData.updateOrder(req.params.id, {
        status: OrderStatus.CANCELLED,
      });

      // 恢复库存
      for (const item of order.items) {
        const product = memoryData.getProductById(item.product);
        if (product) {
          memoryData.updateProduct(product._id, {
            quantity: product.quantity + item.quantity,
            inStock: true,
          });
        }
      }
    } else {
      order = await Order.findById(req.params.id);

      // 检查订单是否存在
      if (!order) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该订单",
        });
      }

      // 检查用户是否有权限取消该订单
      if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({
          status: "fail",
          message: "您无权取消该订单",
        });
      }

      // 检查订单状态是否可以取消
      if (
        order.status !== OrderStatus.PENDING &&
        order.status !== OrderStatus.PAID
      ) {
        return res.status(400).json({
          status: "fail",
          message: "该订单状态无法取消",
        });
      }

      // 更新订单状态
      order.status = OrderStatus.CANCELLED;
      await order.save();

      // 恢复库存
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.quantity += item.quantity;
          product.inStock = true;
          await product.save();
        }
      }
    }

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 更新订单状态（仅管理员）
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;

    // 验证状态
    if (!status || !Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "请提供有效的订单状态",
      });
    }

    let order;

    if (process.env.USE_MEMORY_DB === "true") {
      order = memoryData.getOrderById(req.params.id);

      // 检查订单是否存在
      if (!order) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该订单",
        });
      }

      // 更新订单状态
      order = memoryData.updateOrder(req.params.id, { status });
    } else {
      order = await Order.findById(req.params.id);

      // 检查订单是否存在
      if (!order) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该订单",
        });
      }

      // 更新订单状态
      order.status = status;
      await order.save();
    }

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 获取所有订单（仅管理员）
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 构建查询
    let query: any = {};

    // 过滤
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.user) {
      query.user = req.query.user;
    }

    // 日期范围
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(String(req.query.startDate));
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(String(req.query.endDate));
      }
    }

    // 排序
    let sortBy = {};
    if (req.query.sort) {
      const sortFields = String(req.query.sort).split(",");
      sortFields.forEach((field) => {
        const [fieldName, order] = field.split(":");
        sortBy[fieldName] = order === "desc" ? -1 : 1;
      });
    } else {
      sortBy = { createdAt: -1 };
    }

    // 分页
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 执行查询
    let orders;
    let total;

    if (process.env.USE_MEMORY_DB === "true") {
      // 内存数据模式
      let filteredOrders = memoryData.getOrders();

      // 应用过滤器
      if (query.status) {
        filteredOrders = filteredOrders.filter(
          (o) => o.status === query.status
        );
      }

      if (query.user) {
        filteredOrders = filteredOrders.filter((o) => o.user === query.user);
      }

      if (query.createdAt) {
        if (query.createdAt.$gte) {
          filteredOrders = filteredOrders.filter(
            (o) => new Date(o.createdAt) >= query.createdAt.$gte
          );
        }
        if (query.createdAt.$lte) {
          filteredOrders = filteredOrders.filter(
            (o) => new Date(o.createdAt) <= query.createdAt.$lte
          );
        }
      }

      // 应用排序
      if (Object.keys(sortBy).length > 0) {
        const [sortField, sortOrder] = Object.entries(sortBy)[0];
        filteredOrders.sort((a, b) => {
          if (a[sortField] < b[sortField]) return -1 * sortOrder;
          if (a[sortField] > b[sortField]) return 1 * sortOrder;
          return 0;
        });
      }

      total = filteredOrders.length;

      // 应用分页
      orders = filteredOrders.slice(skip, skip + limit);
    } else {
      // MongoDB模式
      total = await Order.countDocuments(query);
      orders = await Order.find(query).sort(sortBy).skip(skip).limit(limit);
    }

    res.status(200).json({
      status: "success",
      results: orders.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: {
        orders,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 获取订单统计信息（仅管理员）
export const getOrderStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let stats;

    if (process.env.USE_MEMORY_DB === "true") {
      // 内存数据模式
      const orders = memoryData.getOrders();

      // 计算总订单数
      const totalOrders = orders.length;

      // 计算总销售额
      const totalSales = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );

      // 按状态分组
      const ordersByStatus = {};
      Object.values(OrderStatus).forEach((status) => {
        ordersByStatus[status] = orders.filter(
          (order) => order.status === status
        ).length;
      });

      // 计算今日订单数和销售额
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrders = orders.filter(
        (order) => new Date(order.createdAt) >= today
      );
      const todayOrderCount = todayOrders.length;
      const todaySales = todayOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );

      stats = {
        totalOrders,
        totalSales,
        ordersByStatus,
        todayOrderCount,
        todaySales,
      };
    } else {
      // MongoDB模式
      // 按状态分组
      const ordersByStatus = await Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      // 转换为对象格式
      const statusStats = {};
      ordersByStatus.forEach((item) => {
        statusStats[item._id] = item.count;
      });

      // 计算总销售额
      const salesResult = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$totalAmount" },
            count: { $sum: 1 },
          },
        },
      ]);

      // 计算今日订单数和销售额
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayStats = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: today },
          },
        },
        {
          $group: {
            _id: null,
            todaySales: { $sum: "$totalAmount" },
            todayOrderCount: { $sum: 1 },
          },
        },
      ]);

      stats = {
        totalOrders: salesResult.length > 0 ? salesResult[0].count : 0,
        totalSales: salesResult.length > 0 ? salesResult[0].totalSales : 0,
        ordersByStatus: statusStats,
        todayOrderCount:
          todayStats.length > 0 ? todayStats[0].todayOrderCount : 0,
        todaySales: todayStats.length > 0 ? todayStats[0].todaySales : 0,
      };
    }

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
