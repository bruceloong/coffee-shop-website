"use client";

import { useState, useEffect } from "react";

export default function ApiTestPage() {
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 检查后端健康状态
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/health");
        const data = await response.json();
        setHealthStatus(JSON.stringify(data, null, 2));
      } catch (err) {
        console.error("健康检查失败:", err);
        setHealthStatus("无法连接到后端服务");
      }
    };

    checkHealth();
  }, []);

  // 获取产品列表
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/v1/products");
        const data = await response.json();

        if (data.status === "success" && data.data && data.data.products) {
          setProducts(data.data.products);
          setError(null);
        } else {
          setError("获取产品失败: " + (data.message || "未知错误"));
        }
      } catch (err: any) {
        console.error("获取产品失败:", err);
        setError(err.message || "获取产品失败");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API 连接测试</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">后端健康状态</h2>
        {healthStatus ? (
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {healthStatus}
          </pre>
        ) : (
          <p className="text-gray-500">检查中...</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">产品列表</h2>
        {loading ? (
          <p className="text-gray-500">加载中...</p>
        ) : error ? (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg overflow-hidden"
              >
                <div className="h-48 bg-gray-200">
                  {product.mainImage && (
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {product.description.substring(0, 100)}...
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold text-lg">
                      ¥{product.price.toFixed(2)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.inStock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.inStock ? "有库存" : "缺货"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">暂无产品</p>
        )}
      </div>
    </div>
  );
}
