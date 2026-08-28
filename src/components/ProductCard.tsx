"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/types";

interface ProductCardProps {
  item: MenuItem;
  index?: number;
  imageClassName?: string;
}

export default function ProductCard({
  item,
  index = 0,
  imageClassName = "h-56",
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({ id: item.id, name: item.name, price: item.price, imageSrc: item.image.src });
    setAdded(true);
    toast.success(`已将「${item.name}」加入购物车`);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06, ease: "easeOut" }}
      className="card-surface group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className={`relative ${imageClassName} overflow-hidden`}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          placeholder="blur"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.tags?.[0] && (
          <span className="absolute left-3 top-3 rounded-full bg-primary-contrast/90 px-3 py-1 text-xs font-medium text-primary shadow-sm">
            {item.tags[0]}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {item.name}
          </h3>
          <p className="shrink-0 font-display text-lg font-bold text-primary">
            {formatPrice(item.price)}
          </p>
        </div>
        <p className="mt-2 text-sm leading-6 text-foreground/60">{item.description}</p>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={added}
          className="btn-primary mt-4 w-full disabled:cursor-default disabled:opacity-80"
        >
          {added ? "已加入 ✓" : "加入购物车"}
        </button>
      </div>
    </motion.article>
  );
}
