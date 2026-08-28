"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/menu";
import type { MenuItem } from "@/types";

type Filter = "all" | (typeof categories)[number]["id"];

export default function MenuGrid({ items }: { items: MenuItem[] }) {
  const [activeCategory, setActiveCategory] = useState<Filter>("all");

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      {/* 分类筛选 */}
      <div
        className="flex flex-wrap justify-center gap-2"
        role="tablist"
        aria-label="菜单分类筛选"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            activeCategory === "all"
              ? "bg-primary text-primary-contrast"
              : "bg-muted text-foreground/70 hover:bg-secondary hover:text-primary"
          }`}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-primary text-primary-contrast"
                : "bg-muted text-foreground/70 hover:bg-secondary hover:text-primary"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 商品网格 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((item, index) => (
            <ProductCard key={item.id} item={item} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
