"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import StoryImage from "@/assets/images/story-image.jpg";

export default function AboutSection() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image
              src={StoryImage}
              alt="Brew Haven 的咖啡烘焙故事"
              fill
              placeholder="blur"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="card-surface absolute -bottom-6 -right-4 hidden px-6 py-4 sm:block">
            <p className="font-display text-3xl font-bold text-accent">7+</p>
            <p className="text-sm text-foreground/60">年烘焙经验</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">
            Our Story
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            从一颗豆子开始的热爱
          </h2>
          <p className="mt-4 leading-8 text-foreground/70">
            2018 年，Brew Haven 从一间小小的烘焙工作室起步。我们坚持直接从产地采购
            生豆，在店内小批量烘焙，只为把最新鲜、最有层次的风味带到你的杯中。
          </p>
          <p className="mt-3 leading-8 text-foreground/70">
            除了咖啡，我们相信空间同样是风味的一部分——这里是邻居们工作、聊天、放慢脚步的港湾。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/about" className="btn-primary">
              我们的故事
            </Link>
            <Link href="/contact" className="btn-secondary">
              到店坐坐
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
