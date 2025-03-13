import mongoose, { Schema, Document } from "mongoose";

// 订单状态枚举
export enum OrderStatus {
  PENDING = "pending",
  PAID = "paid",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

// 支付方式枚举
export enum PaymentMethod {
  CREDIT_CARD = "creditCard",
  WECHAT = "wechat",
  ALIPAY = "alipay",
  CASH = "cash",
}

// 订单项接口
export interface IOrderItem {
  product: mongoose.Types.ObjectId | string;
  quantity: number;
  price: number;
}

// 订单接口
export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId | string;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  contactInfo: {
    name: string;
    phone: string;
    address?: string;
  };
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 订单项 Schema
const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "订单项必须包含产品"],
  },
  quantity: {
    type: Number,
    required: [true, "订单项必须包含数量"],
    min: [1, "数量必须大于0"],
  },
  price: {
    type: Number,
    required: [true, "订单项必须包含价格"],
    min: [0, "价格不能为负数"],
  },
});

// 订单 Schema
const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: [true, "订单必须有订单号"],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "订单必须关联用户"],
    },
    items: {
      type: [orderItemSchema],
      required: [true, "订单必须包含商品"],
      validate: {
        validator: function (items: IOrderItem[]) {
          return items.length > 0;
        },
        message: "订单必须至少包含一个商品",
      },
    },
    totalAmount: {
      type: Number,
      required: [true, "订单必须有总金额"],
      min: [0, "总金额不能为负数"],
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: [true, "订单必须指定支付方式"],
    },
    contactInfo: {
      name: {
        type: String,
        required: [true, "联系人姓名是必需的"],
      },
      phone: {
        type: String,
        required: [true, "联系人电话是必需的"],
      },
      address: String,
    },
    note: String,
  },
  {
    timestamps: true,
  }
);

// 索引
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

// 查询中间件 - 自动填充用户信息
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email",
  });
  next();
});

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
