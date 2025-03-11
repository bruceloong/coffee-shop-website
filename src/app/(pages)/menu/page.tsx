"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// 菜单分类
type MenuCategory = "coffee" | "tea" | "dessert" | "food";

// 菜单项接口
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: MenuCategory;
  tags?: string[];
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("coffee");

  // 菜单数据
  const menuItems: MenuItem[] = [
    // 咖啡类
    {
      id: 1,
      name: "意式浓缩",
      description: "浓郁的意式浓缩咖啡，纯粹的咖啡体验",
      price: "¥28",
      image: "/espresso.jpg",
      category: "coffee",
      tags: ["经典", "热门"],
    },
    {
      id: 2,
      name: "美式咖啡",
      description: "意式浓缩与纯净水的完美结合，带来醇和的口感",
      price: "¥30",
      image: "/americano.jpg",
      category: "coffee",
    },
    {
      id: 3,
      name: "拿铁",
      description: "丝滑浓郁的意式浓缩与蒸汽牛奶的完美结合",
      price: "¥32",
      image: "/latte.jpg",
      category: "coffee",
      tags: ["热门"],
    },
    {
      id: 4,
      name: "卡布奇诺",
      description: "经典意式咖啡，浓缩咖啡、蒸汽牛奶和奶泡的黄金比例",
      price: "¥32",
      image: "/cappuccino.jpg",
      category: "coffee",
    },
    {
      id: 5,
      name: "摩卡",
      description: "浓郁的巧克力与咖啡的经典搭配",
      price: "¥36",
      image: "/mocha.jpg",
      category: "coffee",
    },
    {
      id: 6,
      name: "焦糖玛奇朵",
      description: "香浓的焦糖风味与拿铁的完美融合",
      price: "¥36",
      image: "/caramel-macchiato.jpg",
      category: "coffee",
      tags: ["热门"],
    },
    {
      id: 7,
      name: "冰滴咖啡",
      description: "12小时慢滴工艺，带来清爽顺滑的口感",
      price: "¥38",
      image: "/cold-brew.jpg",
      category: "coffee",
      tags: ["特色"],
    },
    {
      id: 8,
      name: "手冲咖啡",
      description: "单一产区精品咖啡豆，手工冲泡，展现咖啡的多层次风味",
      price: "¥42",
      image: "/pour-over.jpg",
      category: "coffee",
      tags: ["特色"],
    },

    // 茶类
    {
      id: 9,
      name: "伯爵红茶",
      description: "经典英式红茶，带有佛手柑的独特香气",
      price: "¥28",
      image: "/earl-grey.jpg",
      category: "tea",
    },
    {
      id: 10,
      name: "茉莉花茶",
      description: "优质绿茶与茉莉花窨制，清香怡人",
      price: "¥28",
      image: "/jasmine-tea.jpg",
      category: "tea",
    },
    {
      id: 11,
      name: "抹茶拿铁",
      description: "优质抹茶粉与蒸汽牛奶的完美结合",
      price: "¥34",
      image: "/matcha-latte.jpg",
      category: "tea",
      tags: ["热门"],
    },
    {
      id: 12,
      name: "水果茶",
      description: "新鲜水果与花草茶的清爽组合",
      price: "¥36",
      image: "/fruit-tea.jpg",
      category: "tea",
    },

    // 甜点类
    {
      id: 13,
      name: "提拉米苏",
      description: "经典意式甜点，咖啡与马斯卡彭奶酪的浪漫邂逅",
      price: "¥38",
      image: "/tiramisu.jpg",
      category: "dessert",
      tags: ["热门"],
    },
    {
      id: 14,
      name: "纽约芝士蛋糕",
      description: "浓郁顺滑的奶油芝士，搭配酥脆饼底",
      price: "¥36",
      image: "/cheesecake.jpg",
      category: "dessert",
    },
    {
      id: 15,
      name: "巧克力布朗尼",
      description: "浓郁的巧克力风味，外酥内软",
      price: "¥32",
      image: "/brownie.jpg",
      category: "dessert",
    },
    {
      id: 16,
      name: "肉桂卷",
      description: "手工制作，香甜松软，搭配咖啡的绝佳选择",
      price: "¥28",
      image: "/cinnamon-roll.jpg",
      category: "dessert",
      tags: ["特色"],
    },

    // 食品类
    {
      id: 17,
      name: "鳄梨吐司",
      description: "新鲜鳄梨、有机鸡蛋和全麦吐司的健康组合",
      price: "¥42",
      image: "/avocado-toast.jpg",
      category: "food",
      tags: ["热门"],
    },
    {
      id: 18,
      name: "三明治",
      description: "新鲜蔬菜、优质蛋白与自制酱料，营养美味",
      price: "¥38",
      image: "/sandwich.jpg",
      category: "food",
    },
    {
      id: 19,
      name: "沙拉碗",
      description: "时令蔬果、藜麦、坚果的营养搭配",
      price: "¥46",
      image: "/salad-bowl.jpg",
      category: "food",
    },
    {
      id: 20,
      name: "早餐套餐",
      description: "包含咖啡、三明治和水果的完美早餐",
      price: "¥58",
      image: "/breakfast-set.jpg",
      category: "food",
      tags: ["特色"],
    },
  ];

  // 根据当前选中的分类过滤菜单项
  const filteredItems = menuItems.filter(
    (item) => item.category === activeCategory
  );

  // 分类标签
  const categories = [
    { id: "coffee", name: "咖啡" },
    { id: "tea", name: "茶饮" },
    { id: "dessert", name: "甜点" },
    { id: "food", name: "轻食" },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* 页面标题 */}
      <div className="bg-[var(--primary)] text-white py-16">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            我们的菜单
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "80px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-white mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto text-white/90"
          >
            精选优质原料，每一款产品都是我们的匠心之作
          </motion.p>
        </div>
      </div>

      {/* 菜单分类选项卡 */}
      <div className="container-custom mt-12">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as MenuCategory)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--secondary)]/20 hover:bg-[var(--secondary)]/40"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* 菜单项列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white dark:bg-[#1a1a1a] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-56">
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.parentElement) {
                      const placeholder =
                        target.parentElement.querySelector(".animate-pulse");
                      if (placeholder) placeholder.classList.add("hidden");
                    }
                  }}
                />
                {item.tags && item.tags.length > 0 && (
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[var(--primary)] text-white text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <span className="text-[var(--primary)] font-bold">
                    {item.price}
                  </span>
                </div>
                <p className="text-[var(--foreground)]/70 text-sm mb-4">
                  {item.description}
                </p>
                <button className="w-full py-2 bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-dark)] transition-colors duration-300">
                  加入购物车
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 特别说明 */}
      <div className="container-custom mt-16 text-center">
        <div className="bg-[var(--secondary)]/10 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">特别说明</h3>
          <p className="text-[var(--foreground)]/70 mb-2">
            我们可以根据您的需求调整甜度和温度。
          </p>
          <p className="text-[var(--foreground)]/70">
            如有过敏原顾虑或特殊饮食需求，请告知我们的服务人员。
          </p>
        </div>
      </div>
    </div>
  );
}
