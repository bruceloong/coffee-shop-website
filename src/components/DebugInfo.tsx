"use client";

import { useState } from "react";
import { detectEnvironment, getImageUrl } from "@/utils/imageUtils";
import Image from "next/image";

export default function DebugInfo() {
  const [isVisible, setIsVisible] = useState(false);
  const env = detectEnvironment();

  // 测试不同的图片路径
  const testPaths = ["/espresso.jpg", "latte.jpg", "/images/cappuccino.jpg"];

  const resolvedPaths = testPaths.map((path) => ({
    original: path,
    resolved: getImageUrl(path),
  }));

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-md text-sm z-50 opacity-50 hover:opacity-100"
      >
        调试信息
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-4 m-4 rounded-lg shadow-lg z-50 max-w-md overflow-auto max-h-[80vh]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">环境调试信息</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          关闭
        </button>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">环境信息:</h4>
        <ul className="text-sm space-y-1">
          <li>
            <span className="font-medium">服务器渲染:</span>{" "}
            {env.isServer ? "是" : "否"}
          </li>
          <li>
            <span className="font-medium">GitHub Pages:</span>{" "}
            {env.isGitHubPages ? "是" : "否"}
          </li>
          <li>
            <span className="font-medium">本地开发:</span>{" "}
            {env.isLocalhost ? "是" : "否"}
          </li>
          <li>
            <span className="font-medium">自定义域名:</span>{" "}
            {env.isCustomDomain ? "是" : "否"}
          </li>
          <li>
            <span className="font-medium">主机名:</span> {env.hostname || "N/A"}
          </li>
          <li>
            <span className="font-medium">路径:</span>{" "}
            {typeof window !== "undefined" ? window.location.pathname : "N/A"}
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-2">图片路径解析:</h4>
        <ul className="text-sm space-y-2">
          {resolvedPaths.map((item, index) => (
            <li key={index} className="border-b pb-2 dark:border-gray-700">
              <div>
                <span className="font-medium">原始路径:</span> {item.original}
              </div>
              <div>
                <span className="font-medium">解析路径:</span> {item.resolved}
              </div>
              <div className="mt-1">
                <span className="font-medium">预览:</span>
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 mt-1 relative overflow-hidden">
                  <Image
                    src={item.resolved}
                    alt="测试图片"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Crect width="40" height="40" fill="%23f44336" /%3E%3Cpath d="M20,10 L30,30 L10,30 Z" fill="%23ffffff" /%3E%3C/svg%3E';
                      target.title = "加载失败";
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
