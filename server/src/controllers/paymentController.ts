import { Request, Response } from "express";
import Order from "../models/orderModel";

// 创建支付
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, paymentMethod } = req.body;

    if (!orderId || !paymentMethod) {
      return res.status(400).json({
        status: "error",
        message: "订单ID和支付方式是必需的",
      });
    }

    // 模拟支付处理
    // 在实际应用中，这里会调用支付网关API
    const paymentData = {
      id: `PAY-${Date.now()}`,
      orderId,
      amount: 0,
      status: "pending",
      method: paymentMethod,
      createdAt: new Date(),
    };

    // 获取订单金额
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "订单不存在",
      });
    }

    paymentData.amount = order.totalAmount;

    // 返回支付信息
    res.status(200).json({
      status: "success",
      data: {
        payment: paymentData,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "创建支付失败",
    });
  }
};

// 处理支付回调
export const handlePaymentWebhook = async (req: Request, res: Response) => {
  try {
    const { paymentId, orderId, status } = req.body;

    if (!paymentId || !orderId || !status) {
      return res.status(400).json({
        status: "error",
        message: "支付ID、订单ID和状态是必需的",
      });
    }

    // 更新订单状态
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "订单不存在",
      });
    }

    if (status === "success") {
      order.status = "paid";
      await order.save();
    }

    res.status(200).json({
      status: "success",
      message: "支付回调处理成功",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "处理支付回调失败",
    });
  }
};

// 验证支付状态
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;

    // 模拟支付验证
    // 在实际应用中，这里会调用支付网关API查询支付状态
    const paymentStatus = Math.random() > 0.2 ? "success" : "failed";

    res.status(200).json({
      status: "success",
      data: {
        paymentId,
        status: paymentStatus,
        verifiedAt: new Date(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "验证支付状态失败",
    });
  }
};

// 获取支付方式列表
export const getPaymentMethods = async (req: Request, res: Response) => {
  try {
    // 支付方式列表
    const paymentMethods = [
      {
        id: "alipay",
        name: "支付宝",
        icon: "/images/payment/alipay.png",
        color: "#00a0e9",
      },
      {
        id: "wechat",
        name: "微信支付",
        icon: "/images/payment/wechat.png",
        color: "#09bb07",
      },
      {
        id: "creditCard",
        name: "信用卡",
        icon: "/images/payment/credit-card.png",
        color: "#ff9500",
      },
      {
        id: "cash",
        name: "现金支付",
        icon: "/images/payment/cash.png",
        color: "#30b08f",
      },
    ];

    res.status(200).json({
      status: "success",
      data: {
        methods: paymentMethods,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "获取支付方式失败",
    });
  }
};
