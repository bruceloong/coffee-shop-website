"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "手冲耶加雪菲的花香太惊艳了，店员还会耐心讲解豆子的产地故事。这是我在北京喝过最有诚意的咖啡馆。",
    name: "林小满",
    role: "咖啡爱好者 · 常客",
  },
  {
    quote:
      "每周都在这里办公，环境安静舒适，插座充足。肉桂卷配美式是我的固定组合，强烈推荐！",
    name: "Kevin 王",
    role: "自由设计师",
  },
  {
    quote:
      "公司团建选了 Brew Haven 的杯测体验课，专业又有趣。摩卡的巧克力层次感让人回味无穷。",
    name: "陈嘉怡",
    role: "互联网产品经理",
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const goNext = useCallback(
    () => setActive((i) => (i + 1) % testimonials.length),
    []
  );

  // 6s 自动轮播，交互后由 effect 重置计时
  useEffect(() => {
    const timer = window.setInterval(goNext, 6000);
    return () => window.clearInterval(timer);
  }, [goNext, active]);

  const current = testimonials[active];

  return (
    <section className="bg-primary py-20 text-primary-contrast">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">
          Testimonials
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
          顾客的声音
        </h2>

        <div className="mt-10 min-h-[180px] md:min-h-[150px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-lg leading-8 text-primary-contrast/90 md:text-xl">
                “{current.quote}”
              </p>
              <footer className="mt-6">
                <p className="font-display font-semibold">{current.name}</p>
                <p className="mt-1 text-sm text-primary-contrast/60">{current.role}</p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="顾客评价切换">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`查看第 ${i + 1} 条评价`}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-accent" : "w-2 bg-primary-contrast/30 hover:bg-primary-contrast/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
