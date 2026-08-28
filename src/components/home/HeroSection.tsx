"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroImage from "@/assets/images/hero-bg.jpg";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  return (
    <section ref={ref} className="relative h-svh min-h-[560px] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <Image
          src={HeroImage}
          alt="Brew Haven 门店内景，咖啡师正在冲煮咖啡"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      {/* 渐变遮罩，保证文字可读性 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60" aria-hidden="true" />

      <div className="relative flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sm font-medium uppercase tracking-[0.35em] text-accent"
            >
              Specialty Coffee · Since 2018
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-4 font-display text-5xl font-bold leading-tight md:text-6xl"
            >
              每一杯，
              <br />
              都是一场风味的旅行
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-5 max-w-xl text-lg leading-8 text-white/85"
            >
              精选全球单一产区咖啡豆，店内现场烘焙，用匠心呈现每一杯的层次与温度。
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/menu"
                className="rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-primary-contrast shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
              >
                探索菜单
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-white/50 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/10 active:scale-[0.98]"
              >
                了解我们
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 底部滚动提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25 12 15.75 4.5 8.25" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
