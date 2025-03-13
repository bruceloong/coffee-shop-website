import mongoose, { Schema, Document } from "mongoose";

// 产品分类枚举
export enum ProductCategory {
  COFFEE = "coffee",
  TEA = "tea",
  DESSERT = "dessert",
  SNACK = "snack",
  MERCHANDISE = "merchandise",
}

// 评论接口
export interface IReview {
  user: mongoose.Types.ObjectId | string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// 产品接口
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  mainImage: string;
  inStock: boolean;
  quantity: number;
  featured: boolean;
  discount?: number;
  reviews: IReview[];
  averageRating: number;
  ratingsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 评论 Schema
const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "评论必须关联用户"],
    },
    rating: {
      type: Number,
      required: [true, "评论必须包含评分"],
      min: [1, "评分最小为1"],
      max: [5, "评分最大为5"],
    },
    comment: {
      type: String,
      required: [true, "评论不能为空"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// 产品 Schema
const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "产品必须有名称"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "产品必须有描述"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "产品必须有价格"],
      min: [0, "价格不能为负数"],
    },
    category: {
      type: String,
      enum: Object.values(ProductCategory),
      required: [true, "产品必须有分类"],
    },
    images: [String],
    mainImage: {
      type: String,
      required: [true, "产品必须有主图"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, "库存不能为负数"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      min: [0, "折扣不能为负数"],
      max: [100, "折扣不能超过100%"],
    },
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      default: 0,
      min: [0, "平均评分不能为负数"],
      max: [5, "平均评分不能超过5"],
      set: function (val: number) {
        return Math.round(val * 10) / 10; // 保留一位小数
      },
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 索引
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });

// 虚拟属性 - 计算实际价格（考虑折扣）
productSchema.virtual("actualPrice").get(function (this: IProduct) {
  if (!this.discount) return this.price;
  return this.price * (1 - this.discount / 100);
});

// 查询中间件 - 填充评论中的用户信息
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "reviews.user",
    select: "name avatar",
  });
  next();
});

// 静态方法 - 计算平均评分
productSchema.statics.calculateAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { _id: productId },
    },
    {
      $unwind: "$reviews",
    },
    {
      $group: {
        _id: "$_id",
        avgRating: { $avg: "$reviews.rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await this.findByIdAndUpdate(productId, {
      averageRating: stats[0].avgRating,
      ratingsCount: stats[0].count,
    });
  } else {
    await this.findByIdAndUpdate(productId, {
      averageRating: 0,
      ratingsCount: 0,
    });
  }
};

// 保存后中间件 - 更新平均评分
productSchema.post("save", function () {
  // @ts-ignore
  this.constructor.calculateAverageRating(this._id);
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
