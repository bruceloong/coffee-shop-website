import { Request, Response, NextFunction } from "express";
import Product, { ProductCategory } from "../models/productModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// 内存模式的模拟数据
export const mockProducts = [
  {
    _id: "1",
    name: "经典拿铁",
    description: "丝滑浓郁的意式浓缩与蒸汽牛奶的完美结合",
    price: 32,
    category: ProductCategory.COFFEE,
    images: [
      "https://example.com/latte1.jpg",
      "https://example.com/latte2.jpg",
    ],
    mainImage: "https://example.com/latte-main.jpg",
    inStock: true,
    quantity: 100,
    featured: true,
    reviews: [],
    averageRating: 4.5,
    ratingsCount: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "冰滴咖啡",
    description: "12小时慢滴工艺，带来清爽顺滑的口感",
    price: 38,
    category: ProductCategory.COFFEE,
    images: [
      "https://example.com/coldbrew1.jpg",
      "https://example.com/coldbrew2.jpg",
    ],
    mainImage: "https://example.com/coldbrew-main.jpg",
    inStock: true,
    quantity: 50,
    featured: true,
    reviews: [],
    averageRating: 4.8,
    ratingsCount: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "摩卡",
    description: "浓郁的巧克力与咖啡的经典搭配",
    price: 36,
    category: ProductCategory.COFFEE,
    images: [
      "https://example.com/mocha1.jpg",
      "https://example.com/mocha2.jpg",
    ],
    mainImage: "https://example.com/mocha-main.jpg",
    inStock: true,
    quantity: 80,
    featured: true,
    reviews: [],
    averageRating: 4.6,
    ratingsCount: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "肉桂卷",
    description: "手工制作，香甜松软，搭配咖啡的绝佳选择",
    price: 28,
    category: ProductCategory.DESSERT,
    images: [
      "https://example.com/cinnamon1.jpg",
      "https://example.com/cinnamon2.jpg",
    ],
    mainImage: "https://example.com/cinnamon-main.jpg",
    inStock: true,
    quantity: 30,
    featured: true,
    reviews: [],
    averageRating: 4.7,
    ratingsCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 获取所有产品
export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 如果是内存模式，返回模拟数据
    if (global.useInMemoryMode) {
      // 简单的过滤和分页
      let filteredProducts = [...mockProducts];

      // 分类过滤
      if (req.query.category) {
        filteredProducts = filteredProducts.filter(
          (p) => p.category === req.query.category
        );
      }

      // 特色产品过滤
      if (req.query.featured) {
        const featured = req.query.featured === "true";
        filteredProducts = filteredProducts.filter(
          (p) => p.featured === featured
        );
      }

      // 库存过滤
      if (req.query.inStock) {
        const inStock = req.query.inStock === "true";
        filteredProducts = filteredProducts.filter(
          (p) => p.inStock === inStock
        );
      }

      // 价格范围过滤
      if (req.query.minPrice) {
        const minPrice = parseFloat(req.query.minPrice as string);
        filteredProducts = filteredProducts.filter((p) => p.price >= minPrice);
      }

      if (req.query.maxPrice) {
        const maxPrice = parseFloat(req.query.maxPrice as string);
        filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice);
      }

      // 搜索
      if (req.query.search) {
        const search = (req.query.search as string).toLowerCase();
        filteredProducts = filteredProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search)
        );
      }

      // 排序
      if (req.query.sort) {
        const sortBy = req.query.sort as string;
        if (sortBy === "price") {
          filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === "-price") {
          filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === "name") {
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "-name") {
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        }
      }

      // 分页
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      return res.status(200).json({
        status: "success",
        results: paginatedProducts.length,
        total: filteredProducts.length,
        page,
        limit,
        totalPages: Math.ceil(filteredProducts.length / limit),
        data: {
          products: paginatedProducts,
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

    let query = Product.find(JSON.parse(queryStr));

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
    const products = await query;

    // 发送响应
    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  }
);

// 获取单个产品
export const getProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 如果是内存模式，返回模拟数据
    if (global.useInMemoryMode) {
      const product = mockProducts.find((p) => p._id === req.params.id);

      if (!product) {
        return next(new AppError("没有找到该ID的产品", 404));
      }

      return res.status(200).json({
        status: "success",
        data: {
          product,
        },
      });
    }

    // 数据库模式
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("没有找到该ID的产品", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  }
);

// 创建产品
export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 如果是内存模式，模拟创建产品
    if (global.useInMemoryMode) {
      const newProduct = {
        _id: (mockProducts.length + 1).toString(),
        ...req.body,
        reviews: [],
        averageRating: 0,
        ratingsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockProducts.push(newProduct);

      return res.status(201).json({
        status: "success",
        data: {
          product: newProduct,
        },
      });
    }

    // 数据库模式
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  }
);

// 更新产品
export const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 如果是内存模式，模拟更新产品
    if (global.useInMemoryMode) {
      const productIndex = mockProducts.findIndex(
        (p) => p._id === req.params.id
      );

      if (productIndex === -1) {
        return next(new AppError("没有找到该ID的产品", 404));
      }

      const updatedProduct = {
        ...mockProducts[productIndex],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      mockProducts[productIndex] = updatedProduct;

      return res.status(200).json({
        status: "success",
        data: {
          product: updatedProduct,
        },
      });
    }

    // 数据库模式
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(new AppError("没有找到该ID的产品", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  }
);

// 删除产品
export const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 如果是内存模式，模拟删除产品
    if (global.useInMemoryMode) {
      const productIndex = mockProducts.findIndex(
        (p) => p._id === req.params.id
      );

      if (productIndex === -1) {
        return next(new AppError("没有找到该ID的产品", 404));
      }

      mockProducts.splice(productIndex, 1);

      return res.status(204).json({
        status: "success",
        data: null,
      });
    }

    // 数据库模式
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(new AppError("没有找到该ID的产品", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

// 按分类获取产品
export const getProductsByCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { category } = req.params;

    // 验证分类是否有效
    if (!Object.values(ProductCategory).includes(category as ProductCategory)) {
      return next(new AppError("无效的产品分类", 400));
    }

    // 如果是内存模式，返回模拟数据
    if (global.useInMemoryMode) {
      const products = mockProducts.filter((p) => p.category === category);

      return res.status(200).json({
        status: "success",
        results: products.length,
        data: {
          products,
        },
      });
    }

    // 数据库模式
    const products = await Product.find({ category });

    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  }
);

// 更新产品库存
export const updateProductStock = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return next(new AppError("请提供有效的库存数量", 400));
    }

    // 如果是内存模式，模拟更新库存
    if (global.useInMemoryMode) {
      const productIndex = mockProducts.findIndex((p) => p._id === id);

      if (productIndex === -1) {
        return next(new AppError("没有找到该ID的产品", 404));
      }

      mockProducts[productIndex].quantity = stock;
      mockProducts[productIndex].updatedAt = new Date().toISOString();

      return res.status(200).json({
        status: "success",
        data: {
          product: mockProducts[productIndex],
        },
      });
    }

    // 数据库模式
    const product = await Product.findByIdAndUpdate(
      id,
      { stock },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return next(new AppError("没有找到该ID的产品", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  }
);
