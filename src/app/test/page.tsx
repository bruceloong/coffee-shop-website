"use client";

import { useState, useEffect } from "react";

export default function TestPage() {
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 检查后端健康状态
  useEffect(() => {
    const checkHealth = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/health`
        );
        const data = await response.json();
        setHealthStatus(JSON.stringify(data, null, 2));
      } catch (err) {
        console.error("健康检查失败:", err);
        setHealthStatus("无法连接到后端服务");
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API 连接测试</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">后端健康状态</h2>
        {loading ? (
          <p className="text-gray-500">加载中...</p>
        ) : (
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {healthStatus}
          </pre>
        )}
      </div>
    </div>
  );
}
