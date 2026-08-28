"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 2018, suffix: "年", label: "品牌创立" },
  { value: 12, suffix: "+", label: "单一产区豆" },
  { value: 5, suffix: "家", label: "城市门店" },
  { value: 98, suffix: "%", label: "顾客好评率" },
];

/** 数字滚动：进入视口后以 easeOutCubic 缓动 1.4s 到目标值 */
function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <span ref={ref} className="font-display text-4xl font-bold text-primary md:text-5xl">
      {display}
      <span className="text-accent">{suffix}</span>
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <CountUp target={stat.value} suffix={stat.suffix} />
            <p className="mt-2 text-sm text-foreground/60">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
