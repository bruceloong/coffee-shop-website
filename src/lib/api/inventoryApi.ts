import { api, ApiResponse } from "./apiClient";
import { Product } from "./productApi";

// 库存记录类型枚举
export enum InventoryRecordType {
  PURCHASE = "purchase",
  SALE = "sale",
  ADJUSTMENT = "adjustment",
  RETURN = "return",
  WASTE = "waste",
}

// 库存记录接口
export interface InventoryRecord {
  _id: string;
  product: Product | string;
  type: InventoryRecordType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 创建库存记录请求接口
export interface CreateInventoryRecordRequest {
  product: string;
  type: InventoryRecordType;
  quantity: number;
  notes?: string;
}

// 库存查询参数接口
export interface InventoryQueryParams {
  product?: string;
  type?: InventoryRecordType;
  startDate?: string;
  endDate?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

// 库存分页响应接口
export interface InventoryPaginatedResponse {
  records: InventoryRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 库存摘要接口
export interface InventorySummary {
  _id: string;
  product: Product | string;
  totalQuantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  lastUpdated: string;
}

/**
 * 库存API服务
 */
export const inventoryApi = {
  /**
   * 获取所有库存记录（仅管理员）
   * @param params 查询参数
   * @returns 库存记录分页响应
   */
  getAllInventoryRecords: async (
    params: InventoryQueryParams = {}
  ): Promise<InventoryPaginatedResponse> => {
    // 构建查询字符串
    const queryParams = new URLSearchParams();

    if (params.product) queryParams.append("product", params.product);
    if (params.type) queryParams.append("type", params.type);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.search) queryParams.append("search", params.search);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/inventory/records?${queryString}`
      : "/inventory/records";

    const response = await api.get<InventoryPaginatedResponse>(endpoint);

    return {
      records: response.data?.records || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1,
    };
  },

  /**
   * 获取单个产品的库存记录（仅管理员）
   * @param productId 产品ID
   * @param params 查询参数
   * @returns 库存记录分页响应
   */
  getProductInventoryRecords: async (
    productId: string,
    params: InventoryQueryParams = {}
  ): Promise<InventoryPaginatedResponse> => {
    // 构建查询字符串
    const queryParams = new URLSearchParams();

    if (params.type) queryParams.append("type", params.type);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.search) queryParams.append("search", params.search);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/inventory/products/${productId}/records?${queryString}`
      : `/inventory/products/${productId}/records`;

    const response = await api.get<InventoryPaginatedResponse>(endpoint);

    return {
      records: response.data?.records || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1,
    };
  },

  /**
   * 创建库存记录（仅管理员）
   * @param recordData 库存记录数据
   * @returns 创建的库存记录
   */
  createInventoryRecord: async (
    recordData: CreateInventoryRecordRequest
  ): Promise<InventoryRecord> => {
    const response = await api.post<{ record: InventoryRecord }>(
      "/inventory/records",
      recordData
    );
    return response.data?.record as InventoryRecord;
  },

  /**
   * 获取库存摘要（仅管理员）
   * @returns 库存摘要列表
   */
  getInventorySummary: async (): Promise<InventorySummary[]> => {
    const response = await api.get<{ summary: InventorySummary[] }>(
      "/inventory/summary"
    );
    return response.data?.summary || [];
  },

  /**
   * 获取低库存产品（仅管理员）
   * @returns 低库存产品列表
   */
  getLowStockProducts: async (): Promise<InventorySummary[]> => {
    const response = await api.get<{ products: InventorySummary[] }>(
      "/inventory/low-stock"
    );
    return response.data?.products || [];
  },

  /**
   * 设置低库存阈值（仅管理员）
   * @param productId 产品ID
   * @param threshold 阈值
   * @returns 更新后的库存摘要
   */
  setLowStockThreshold: async (
    productId: string,
    threshold: number
  ): Promise<InventorySummary> => {
    const response = await api.patch<{ summary: InventorySummary }>(
      `/inventory/products/${productId}/threshold`,
      { threshold }
    );
    return response.data?.summary as InventorySummary;
  },
};
