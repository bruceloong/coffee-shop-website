import mongoose from "mongoose";

// 库存操作类型枚举
export enum InventoryOperationType {
  ADD = "add",
  REMOVE = "remove",
  ADJUST = "adjust",
}

// 库存记录接口
export interface IInventoryRecord extends mongoose.Document {
  product: mongoose.Schema.Types.ObjectId;
  operationType: InventoryOperationType;
  quantity: number;
  previousStock: number;
  currentStock: number;
  note?: string;
  operator: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

// 库存记录模式
const inventoryRecordSchema = new mongoose.Schema<IInventoryRecord>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "库存记录必须关联产品"],
    },
    operationType: {
      type: String,
      enum: Object.values(InventoryOperationType),
      required: [true, "库存记录必须有操作类型"],
    },
    quantity: {
      type: Number,
      required: [true, "库存记录必须有数量"],
    },
    previousStock: {
      type: Number,
      required: [true, "库存记录必须有之前的库存数量"],
    },
    currentStock: {
      type: Number,
      required: [true, "库存记录必须有当前的库存数量"],
    },
    note: {
      type: String,
      trim: true,
    },
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "库存记录必须有操作者"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 索引
inventoryRecordSchema.index({ product: 1, createdAt: -1 });
inventoryRecordSchema.index({ operator: 1 });

// 查询中间件：填充产品和操作者信息
inventoryRecordSchema.pre(
  /^find/,
  function (this: mongoose.Query<any, any>, next) {
    this.populate({
      path: "product",
      select: "name category price",
    }).populate({
      path: "operator",
      select: "name",
    });
    next();
  }
);

const InventoryRecord = mongoose.model<IInventoryRecord>(
  "InventoryRecord",
  inventoryRecordSchema
);

export default InventoryRecord;
