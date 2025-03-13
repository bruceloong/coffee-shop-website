import { api, ApiResponse } from "./apiClient";
import { User } from "./userApi";

// 产品分类枚举
export enum ProductCategory {
  COFFEE = "coffee",
  TEA = "tea",
  DESSERT = "dessert",
  SNACK = "snack",
  MERCHANDISE = "merchandise",
}

// 评论接口
export interface Review {
  _id: string;
  user: User | string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// 产品接口
export interface Product {
  _id: string;
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
  reviews: Review[];
  averageRating: number;
  ratingsCount: number;
  actualPrice?: number; // 虚拟属性，考虑折扣后的价格
  createdAt: string;
  updatedAt: string;
}

// 创建产品请求接口
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  mainImage: string;
  quantity: number;
  featured?: boolean;
  discount?: number;
}

// 更新产品请求接口
export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: ProductCategory;
  images?: string[];
  mainImage?: string;
  inStock?: boolean;
  quantity?: number;
  featured?: boolean;
  discount?: number;
}

// 产品查询参数接口
export interface ProductQueryParams {
  category?: ProductCategory;
  featured?: boolean;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

// 产品分页响应接口
export interface ProductPaginatedResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 评论请求接口
export interface ReviewRequest {
  rating: number;
  comment: string;
}

/**
 * 产品API服务
 */
export const productApi = {
  /**
   * 获取所有产品
   * @param params 查询参数
   * @returns 产品分页响应
   */
  getAllProducts: async (
    params: ProductQueryParams = {}
  ): Promise<ProductPaginatedResponse> => {
    // 构建查询字符串
    const queryParams = new URLSearchParams();

    if (params.category) queryParams.append("category", params.category);
    if (params.featured !== undefined)
      queryParams.append("featured", params.featured.toString());
    if (params.inStock !== undefined)
      queryParams.append("inStock", params.inStock.toString());
    if (params.minPrice !== undefined)
      queryParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice !== undefined)
      queryParams.append("maxPrice", params.maxPrice.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : "/products";

    const response = await api.get<ProductPaginatedResponse>(endpoint);

    return {
      products: response.data?.products || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1,
    };
  },

  /**
   * 获取单个产品
   * @param productId 产品ID
   * @returns 产品信息
   */
  getProduct: async (productId: string): Promise<Product> => {
    const response = await api.get<{ product: Product }>(
      `/products/${productId}`
    );
    return response.data?.product as Product;
  },

  /**
   * 创建产品（仅管理员）
   * @param productData 产品数据
   * @returns 创建的产品
   */
  createProduct: async (
    productData: CreateProductRequest
  ): Promise<Product> => {
    const response = await api.post<{ product: Product }>(
      "/products",
      productData
    );
    return response.data?.product as Product;
  },

  /**
   * 更新产品（仅管理员）
   * @param productId 产品ID
   * @param productData 产品数据
   * @returns 更新后的产品
   */
  updateProduct: async (
    productId: string,
    productData: UpdateProductRequest
  ): Promise<Product> => {
    const response = await api.patch<{ product: Product }>(
      `/products/${productId}`,
      productData
    );
    return response.data?.product as Product;
  },

  /**
   * 删除产品（仅管理员）
   * @param productId 产品ID
   */
  deleteProduct: async (productId: string): Promise<void> => {
    await api.delete(`/products/${productId}`);
  },

  /**
   * 获取产品分类
   * @returns 产品分类列表
   */
  getProductCategories: async (): Promise<ProductCategory[]> => {
    const response = await api.get<{ categories: ProductCategory[] }>(
      "/products/categories"
    );
    return response.data?.categories || [];
  },

  /**
   * 获取产品评论
   * @param productId 产品ID
   * @returns 评论列表
   */
  getProductReviews: async (productId: string): Promise<Review[]> => {
    const response = await api.get<{ reviews: Review[] }>(
      `/products/${productId}/reviews`
    );
    return response.data?.reviews || [];
  },

  /**
   * 添加产品评论
   * @param productId 产品ID
   * @param reviewData 评论数据
   * @returns 更新后的产品
   */
  addProductReview: async (
    productId: string,
    reviewData: ReviewRequest
  ): Promise<Product> => {
    const response = await api.post<{ product: Product }>(
      `/products/${productId}/reviews`,
      reviewData
    );
    return response.data?.product as Product;
  },
};
