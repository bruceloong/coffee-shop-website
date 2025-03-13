// 导出所有API服务
export * from "./apiClient";
export * from "./userApi";
export * from "./productApi";
export * from "./orderApi";
export * from "./paymentApi";
export * from "./inventoryApi";

// 导出API服务对象
import { api } from "./apiClient";
import { userApi } from "./userApi";
import { productApi } from "./productApi";
import { orderApi } from "./orderApi";
import { paymentApi } from "./paymentApi";
import { inventoryApi } from "./inventoryApi";

// 组合所有API服务
const apiServices = {
  api,
  user: userApi,
  product: productApi,
  order: orderApi,
  payment: paymentApi,
  inventory: inventoryApi,
};

export default apiServices;
