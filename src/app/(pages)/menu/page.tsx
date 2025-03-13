"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { productAPI } from "@/services/api";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// 产品分类类型
type MenuCategory = "coffee" | "tea" | "dessert" | "food" | "all";

// 产品接口
interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: MenuCategory;
  tags?: string[];
  stock: number;
}

// 价格范围接口
interface PriceRange {
  min: number;
  max: number;
}

export default function MenuPage() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: 0,
    max: 100,
  });
  const [sortOption, setSortOption] = useState<string>("default");
  const [availableOnly, setAvailableOnly] = useState(false);

  // 所有可用的标签
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // 从后端获取产品数据
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAllProducts();
        const products = response.data.products;
        setMenuItems(products);

        // 提取所有可用的标签
        const tags = new Set<string>();
        products.forEach((product: MenuItem) => {
          product.tags?.forEach((tag) => tags.add(tag));
        });
        setAvailableTags(Array.from(tags));

        // 找出最高价格，设置价格范围
        const maxPrice = Math.max(...products.map((p: MenuItem) => p.price));
        setPriceRange({ min: 0, max: Math.ceil(maxPrice) });

        setError("");
      } catch (err: any) {
        console.error("Failed to fetch products:", err);
        setError(err.response?.data?.message || "无法加载产品数据");
        toast.error("加载产品失败，请刷新页面重试");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 筛选和排序产品
  useEffect(() => {
    let result = [...menuItems];

    // 按分类筛选
    if (activeCategory !== "all") {
      result = result.filter((item) => item.category === activeCategory);
    }

    // 按搜索词筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    }

    // 按标签筛选
    if (selectedTags.length > 0) {
      result = result.filter((item) =>
        selectedTags.every((tag) => item.tags?.includes(tag))
      );
    }

    // 按价格范围筛选
    result = result.filter(
      (item) => item.price >= priceRange.min && item.price <= priceRange.max
    );

    // 只显示有库存的商品
    if (availableOnly) {
      result = result.filter((item) => item.stock > 0);
    }

    // 排序
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "stock-desc":
        result.sort((a, b) => b.stock - a.stock);
        break;
      default:
        // 默认排序，保持原顺序
        break;
    }

    setFilteredItems(result);
  }, [
    menuItems,
    activeCategory,
    searchTerm,
    selectedTags,
    priceRange,
    sortOption,
    availableOnly,
  ]);

  // 添加到购物车
  const handleAddToCart = (item: MenuItem) => {
    if (item.stock <= 0) {
      toast.error(`${item.name} 已售罄`);
      return;
    }

    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.imageUrl,
      category: item.category,
    });
  };

  // 处理标签选择
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 重置所有筛选条件
  const resetFilters = () => {
    setActiveCategory("all");
    setSearchTerm("");
    setSelectedTags([]);
    setPriceRange({
      min: 0,
      max: Math.ceil(Math.max(...menuItems.map((p) => p.price))),
    });
    setSortOption("default");
    setAvailableOnly(false);
  };

  // 分类标签
  const categories = [
    { id: "all", name: "全部" },
    { id: "coffee", name: "咖啡" },
    { id: "tea", name: "茶饮" },
    { id: "dessert", name: "甜点" },
    { id: "food", name: "轻食" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">加载失败</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">我们的菜单</h1>

      {/* 搜索栏 */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索产品..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="default">默认排序</option>
              <option value="price-asc">价格: 低到高</option>
              <option value="price-desc">价格: 高到低</option>
              <option value="name-asc">名称: A-Z</option>
              <option value="name-desc">名称: Z-A</option>
              <option value="stock-desc">库存: 多到少</option>
            </select>
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              重置
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 筛选侧边栏 */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">筛选</h2>

            {/* 分类筛选 */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">分类</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() =>
                      setActiveCategory(category.id as MenuCategory)
                    }
                    className={`px-3 py-1 rounded-md text-sm ${
                      activeCategory === category.id
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 价格范围筛选 */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">价格范围</h3>
              <div className="flex items-center justify-between mb-2">
                <span>¥{priceRange.min}</span>
                <span>¥{priceRange.max}</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.ceil(Math.max(...menuItems.map((p) => p.price)))}
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({
                    ...prev,
                    max: parseInt(e.target.value),
                  }))
                }
                className="w-full"
              />
            </div>

            {/* 标签筛选 */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">标签</h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      selectedTags.includes(tag)
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 库存筛选 */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={() => setAvailableOnly(!availableOnly)}
                  className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span>只显示有库存商品</span>
              </label>
            </div>
          </div>
        </div>

        {/* 产品列表 */}
        <div className="lg:w-3/4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500 mb-4">没有找到符合条件的产品</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                重置筛选条件
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <span className="text-primary font-bold">
                        ¥{item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {item.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={item.stock <= 0}
                        className={`px-3 py-1 rounded-md text-white ${
                          item.stock > 0
                            ? "bg-primary hover:bg-primary-dark"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {item.stock > 0 ? "加入购物车" : "已售罄"}
                      </button>
                    </div>
                    {item.stock <= 5 && item.stock > 0 && (
                      <p className="text-orange-500 text-xs mt-2">
                        库存紧张，仅剩 {item.stock} 件
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
