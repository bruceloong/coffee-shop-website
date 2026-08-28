"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AboutImage from "@/assets/images/about-image.jpg";
import JoinTeamImage from "@/assets/images/join-team.jpg";

const timeline = [
  {
    year: "2018",
    title: "梦想启航",
    text: "创始人阿伦在胡同里租下一间 30㎡ 的小铺，购入第一台 1kg 烘焙机，Brew Haven 就此诞生。",
  },
  {
    year: "2019",
    title: "产地直采",
    text: "第一次踏足云南保山咖啡产区，与当地庄园建立长期合作关系，开启产地直采模式。",
  },
  {
    year: "2020",
    title: "三里屯首店",
    text: "三里屯太古里门店开业，Brew Haven 正式走进城市核心商圈，成为邻里与白领的日常据点。",
  },
  {
    year: "2021",
    title: "杯测冠军",
    text: "主理咖啡师小雅在全国咖啡师大赛中斩获季军，手冲单品系列广受好评。",
  },
  {
    year: "2023",
    title: "五店同庆",
    text: "北京五家门店同步升级烘焙工坊，推出会员体系与咖啡教室，连接更多咖啡爱好者。",
  },
  {
    year: "至今",
    title: "风味的旅程仍在继续",
    text: "我们依然坚持小批量新鲜烘焙，让每一杯咖啡都值得细细品味。",
  },
];

const values = [
  {
    title: "品质至上",
    text: "从生豆筛选到出品标准，每个环节都有明确的风味指标，不合格的批次绝不上架。",
    icon: "M9.125 6.375c-3.143 0-5.25 2.156-5.25 5.25 0 2.88 2.04 4.935 5.086 5.229a48.3 48.3 0 0 1 6.09 0c3.047-.294 5.087-2.35 5.087-5.23 0-3.093-2.107-5.249-5.25-5.249h-5.763Z",
  },
  {
    title: "可持续发展",
    text: "坚持产地直采与公平贸易，使用可降解包装，让每一杯咖啡都对土地友好。",
    icon: "M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9Zm0-13.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z",
  },
  {
    title: "社区连接",
    text: "门店不只是卖咖啡的地方，更是邻居们工作、交流、放松的第三空间。",
    icon: "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  },
];

export default function AboutContent() {
  return (
    <>
      {/* 品牌故事 + 时间线 */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-2">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">
              Our Journey
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              我们的故事
            </h2>
            <p className="mt-5 leading-8 text-foreground/70">
              Brew Haven 的名字源自「Brew（冲煮）」与「Haven（港湾）」——我们希望这里既是
              咖啡风味的实验室，也是每个人可以安心停泊的角落。七年来，我们从一间小小的工作室，
              成长为五家门店、十余款自有烘焙豆的精品品牌，但对风味的执着从未改变。
            </p>
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={AboutImage}
                alt="Brew Haven 创始团队在门店合影"
                fill
                placeholder="blur"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* 时间线 */}
          <ol className="relative space-y-10 border-l-2 border-line pl-8">
            {timeline.map((item, i) => (
              <motion.li
                key={item.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="relative"
              >
                <span
                  className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent ring-4 ring-background"
                  aria-hidden="true"
                />
                <p className="font-display text-xl font-bold text-accent">{item.year}</p>
                <h3 className="mt-1 font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-7 text-foreground/60">{item.text}</p>
                <span className="sr-only">{`第 ${i + 1} 段历程`}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* 价值观 */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">Values</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">我们的坚持</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card-surface p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-6 w-6 text-accent" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={value.icon} />
                  </svg>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-7 text-foreground/60">{value.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 加入我们 */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-primary p-8 text-primary-contrast md:grid-cols-2 md:p-12">
          <div>
            <h2 className="font-display text-3xl font-bold">加入 Brew Haven</h2>
            <p className="mt-3 leading-7 text-primary-contrast/75">
              我们永远欢迎对咖啡怀有热情的伙伴——咖啡师、烘焙学徒、甜点师与门店管理培训生。
              完善的培训体系与晋升通道，和我们一起把好咖啡带给更多人。
            </p>
            <a
              href="mailto:hr@brewhaven.com?subject=%E5%BA%94%E8%81%98%20Brew%20Haven%20%E8%81%8C%E4%BD%8D"
              className="btn-primary mt-6"
            >
              查看职位空缺
            </a>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={JoinTeamImage}
              alt="Brew Haven 团队日常工作场景"
              fill
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
