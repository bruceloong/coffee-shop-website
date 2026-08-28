"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/menu";

export default function FeaturedSection() {
  const featured = getFeaturedProducts();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">
          Signature
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
          招牌精选
        </h2>
        <p className="mt-3 text-foreground/60">
          每一杯都由咖啡师现场制作，呈现豆子最本真的风味。
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((item, i) => (
          <ProductCard key={item.id} item={item} index={i} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/menu" className="btn-secondary">
          查看完整菜单
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
