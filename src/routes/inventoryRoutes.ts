import express from "express";
import * as authMiddleware from "../middleware/authMiddleware";
import memoryData from "../services/memoryDataService";
import Product from "../models/productModel";

const router = express.Router();

// 所有库存路由都需要管理员权限
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo("admin"));

// 获取库存概览
router.get("/", async (req, res) => {
  try {
    let products;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalProducts = 0;

    if (process.env.USE_MEMORY_DB === "true") {
      // 内存数据模式
      products = memoryData.getProducts();
      totalProducts = products.length;

      // 统计低库存和缺货产品
      products.forEach((product) => {
        if (!product.inStock) {
          outOfStockCount++;
        } else if (product.quantity <= 10) {
          lowStockCount++;
        }
      });
    } else {
      // MongoDB模式
      totalProducts = await Product.countDocuments();
      outOfStockCount = await Product.countDocuments({ inStock: false });
      lowStockCount = await Product.countDocuments({
        inStock: true,
        quantity: { $lte: 10 },
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        totalProducts,
        lowStockCount,
        outOfStockCount,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

// 获取低库存产品
router.get("/low-stock", async (req, res) => {
  try {
    let products;

    if (process.env.USE_MEMORY_DB === "true") {
      // 内存数据模式
      products = memoryData
        .getProducts()
        .filter((product) => product.inStock && product.quantity <= 10);
    } else {
      // MongoDB模式
      products = await Product.find({
        inStock: true,
        quantity: { $lte: 10 },
      }).sort({ quantity: 1 });
    }

    res.status(200).json({
      status: "success",
      results: products.length,
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
});

// 获取缺货产品
router.get("/out-of-stock", async (req, res) => {
  try {
    let products;

    if (process.env.USE_MEMORY_DB === "true") {
      // 内存数据模式
      products = memoryData.getProducts().filter((product) => !product.inStock);
    } else {
      // MongoDB模式
      products = await Product.find({ inStock: false });
    }

    res.status(200).json({
      status: "success",
      results: products.length,
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
});

// 更新产品库存
router.patch("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        status: "fail",
        message: "请提供有效的库存数量",
      });
    }

    let product;

    if (process.env.USE_MEMORY_DB === "true") {
      // 内存数据模式
      product = memoryData.getProductById(req.params.id);

      if (!product) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该产品",
        });
      }

      product = memoryData.updateProduct(req.params.id, {
        quantity,
        inStock: quantity > 0,
      });
    } else {
      // MongoDB模式
      product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          status: "fail",
          message: "未找到该产品",
        });
      }

      product.quantity = quantity;
      product.inStock = quantity > 0;
      await product.save();
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
});

export default router;
