import { Request, Response, NextFunction } from "express";
import Product, { ProductCategory } from "../models/productModel";
import memoryData from "../services/memoryDataService";

// 获取所有产品
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 构建查询
    let query: any = {};

    // 过滤
    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.featured === "true") {
      query.featured = true;
    }

    if (req.query.inStock === "true") {
      query.inStock = true;
    }

    // 价格范围
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // 搜索
    if (req.query.search) {
      const searchRegex = new RegExp(String(req.query.search), "i");
      query.$or = [{ name: searchRegex }, { description: searchRegex }];
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
    let products;
    let total;

    if (process.env.USE_MEMORY_DB === "true") {
      // 内存数据模式
      let filteredProducts = memoryData.getProducts();

      // 应用过滤器
      if (query.category) {
        filteredProducts = filteredProducts.filter(
          (p) => p.category === query.category
        );
      }

      if (query.featured) {
        filteredProducts = filteredProducts.filter((p) => p.featured === true);
      }

      if (query.inStock) {
        filteredProducts = filteredProducts.filter((p) => p.inStock === true);
      }

      if (query.price) {
        if (query.price.$gte) {
          filteredProducts = filteredProducts.filter(
            (p) => p.price >= query.price.$gte
          );
        }
        if (query.price.$lte) {
          filteredProducts = filteredProducts.filter(
            (p) => p.price <= query.price.$lte
          );
        }
      }

      if (query.$or) {
        const searchRegex = query.$or[0].name;
        filteredProducts = filteredProducts.filter(
          (p) => searchRegex.test(p.name) || searchRegex.test(p.description)
        );
      }

      // 应用排序
      if (Object.keys(sortBy).length > 0) {
        const [sortField, sortOrder] = Object.entries(sortBy)[0];
        filteredProducts.sort((a, b) => {
          if (a[sortField] < b[sortField]) return -1 * sortOrder;
          if (a[sortField] > b[sortField]) return 1 * sortOrder;
          return 0;
        });
      }

      total = filteredProducts.length;

      // 应用分页
      products = filteredProducts.slice(skip, skip + limit);
    } else {
      // MongoDB模式
      total = await Product.countDocuments(query);
      products = await Product.find(query).sort(sortBy).skip(skip).limit(limit);
    }

    res.status(200).json({
      status: "success",
      results: products.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: {
        products,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 获取单个产品
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product =
      process.env.USE_MEMORY_DB === "true"
        ? memoryData.getProductById(req.params.id)
        : await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "未找到该产品",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 创建产品
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newProduct =
      process.env.USE_MEMORY_DB === "true"
        ? memoryData.createProduct(req.body)
        : await Product.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 更新产品
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let updatedProduct;

    if (process.env.USE_MEMORY_DB === "true") {
      updatedProduct = memoryData.updateProduct(req.params.id, req.body);

      if (!updatedProduct) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该产品",
        });
      }
    } else {
      updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedProduct) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该产品",
        });
      }
    }

    res.status(200).json({
      status: "success",
      data: {
        product: updatedProduct,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 删除产品
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (process.env.USE_MEMORY_DB === "true") {
      const deletedProduct = memoryData.deleteProduct(req.params.id);

      if (!deletedProduct) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该产品",
        });
      }
    } else {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该产品",
        });
      }
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 获取产品分类
export const getProductCategories = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = Object.values(ProductCategory);

    res.status(200).json({
      status: "success",
      data: {
        categories,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 添加产品评论
export const addProductReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        status: "fail",
        message: "评分和评论内容不能为空",
      });
    }

    const reviewData = {
      user: req.user.id,
      rating,
      comment,
    };

    let product;

    if (process.env.USE_MEMORY_DB === "true") {
      // 检查产品是否存在
      product = memoryData.getProductById(req.params.id);

      if (!product) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该产品",
        });
      }

      // 检查用户是否已经评论过该产品
      const existingReview = memoryData
        .getReviews()
        .find(
          (review) =>
            review.product === req.params.id && review.user === req.user.id
        );

      if (existingReview) {
        return res.status(400).json({
          status: "fail",
          message: "您已经评论过该产品",
        });
      }

      // 创建评论
      const newReview = memoryData.createReview({
        product: req.params.id,
        ...reviewData,
      });

      // 获取更新后的产品
      product = memoryData.getProductById(req.params.id);
    } else {
      // 检查产品是否存在
      product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该产品",
        });
      }

      // 检查用户是否已经评论过该产品
      const existingReview = product.reviews.find(
        (review) => review.user.toString() === req.user.id
      );

      if (existingReview) {
        return res.status(400).json({
          status: "fail",
          message: "您已经评论过该产品",
        });
      }

      // 添加评论
      product.reviews.push(reviewData);
      await product.save();
    }

    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 获取产品评论
export const getProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let reviews;

    if (process.env.USE_MEMORY_DB === "true") {
      reviews = memoryData.getReviewsByProduct(req.params.id);
    } else {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该产品",
        });
      }

      reviews = product.reviews;
    }

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
