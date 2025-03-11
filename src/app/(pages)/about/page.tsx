"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageUrl } from "@/utils/imageUtils";

export default function AboutPage() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 时间线动画
    if (timelineRef.current) {
      const timelineItems =
        timelineRef.current.querySelectorAll(".timeline-item");

      timelineItems.forEach((item, index) => {
        gsap.from(item, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
          },
          delay: index * 0.2,
        });
      });
    }

    // 核心价值观动画
    if (valuesRef.current) {
      const valueItems = valuesRef.current.querySelectorAll(".value-item");

      valueItems.forEach((item, index) => {
        gsap.from(item, {
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
          delay: index * 0.15,
        });
      });
    }
  }, []);

  // 团队成员数据
  const teamMembers = [
    {
      name: "张明",
      role: "创始人 & 首席咖啡师",
      bio: "拥有10年咖啡行业经验，曾获得亚洲咖啡师大赛冠军。",
      image: "/team-1.jpg",
    },
    {
      name: "李华",
      role: "行政总厨",
      bio: "毕业于法国蓝带厨艺学院，专注于创造与咖啡完美搭配的美食。",
      image: "/team-2.jpg",
    },
    {
      name: "王芳",
      role: "店面经理",
      bio: "热情好客，致力于为每位顾客创造难忘的体验。",
      image: "/team-3.jpg",
    },
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
            关于我们
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
            了解 Brew Haven 的故事、理念和团队
          </motion.p>
        </div>
      </div>

      {/* 我们的故事 */}
      <section id="story" className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <h2 className="text-3xl font-bold mb-6">我们的故事</h2>
              <div className="h-1 w-20 bg-[var(--primary)] mb-6" />
              <p className="text-[var(--foreground)]/80 mb-4">
                Brew Haven
                的故事始于2018年，当时我们的创始人张明在旅行中发现了咖啡的魅力。他走访了世界各地的咖啡产区，学习不同的咖啡文化和制作工艺，最终决定在北京开设一家能够展现咖啡多样性的精品咖啡店。
              </p>
              <p className="text-[var(--foreground)]/80 mb-4">
                我们的第一家店铺位于三里屯，开业当天就吸引了众多咖啡爱好者。随着口碑的传播，我们逐渐成长为北京最受欢迎的咖啡目的地之一。
              </p>
              <p className="text-[var(--foreground)]/80">
                今天，Brew Haven
                已经成为一个温暖的社区空间，不仅提供优质的咖啡和美食，还举办各种活动，包括咖啡品鉴会、烘焙工作坊和艺术展览，为顾客创造丰富多彩的体验。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 relative h-[400px] rounded-lg overflow-hidden"
            >
              <Image
                src={getImageUrl("/story-image.jpg")}
                alt="我们的咖啡店故事"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 时间线 */}
      <section className="section-padding bg-[var(--secondary)]/10">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">我们的历程</h2>
            <div className="h-1 w-20 bg-[var(--primary)] mx-auto mb-6" />
            <p className="text-[var(--foreground)]/80 max-w-2xl mx-auto">
              从一个想法到多家门店，我们一路走来的重要时刻
            </p>
          </div>

          <div ref={timelineRef} className="relative max-w-3xl mx-auto">
            {/* 时间线中轴 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[var(--primary)]/30" />

            {/* 时间线项目 */}
            <div className="timeline-item relative mb-16 pl-8 md:pl-0">
              <div className="md:w-1/2 md:pr-8 md:text-right">
                <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-[var(--primary)] mb-2">
                    2018年
                  </h3>
                  <p className="text-[var(--foreground)]/80">
                    Brew Haven
                    在北京三里屯开设第一家门店，开始了我们的咖啡之旅。
                  </p>
                </div>
              </div>
              <div className="absolute left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--primary)] z-10" />
            </div>

            <div className="timeline-item relative mb-16 pl-8 md:pl-0">
              <div className="md:w-1/2 md:ml-auto md:pl-8">
                <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-[var(--primary)] mb-2">
                    2019年
                  </h3>
                  <p className="text-[var(--foreground)]/80">
                    开始与本地农场合作，推出季节性菜单，并举办第一次咖啡品鉴活动。
                  </p>
                </div>
              </div>
              <div className="absolute left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--primary)] z-10" />
            </div>

            <div className="timeline-item relative mb-16 pl-8 md:pl-0">
              <div className="md:w-1/2 md:pr-8 md:text-right">
                <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-[var(--primary)] mb-2">
                    2020年
                  </h3>
                  <p className="text-[var(--foreground)]/80">
                    疫情期间转型线上业务，推出咖啡订阅服务和居家烘焙套装。
                  </p>
                </div>
              </div>
              <div className="absolute left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--primary)] z-10" />
            </div>

            <div className="timeline-item relative mb-16 pl-8 md:pl-0">
              <div className="md:w-1/2 md:ml-auto md:pl-8">
                <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-[var(--primary)] mb-2">
                    2021年
                  </h3>
                  <p className="text-[var(--foreground)]/80">
                    在北京国贸开设第二家门店，并开始自己的咖啡豆烘焙业务。
                  </p>
                </div>
              </div>
              <div className="absolute left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--primary)] z-10" />
            </div>

            <div className="timeline-item relative pl-8 md:pl-0">
              <div className="md:w-1/2 md:pr-8 md:text-right">
                <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-[var(--primary)] mb-2">
                    2023年至今
                  </h3>
                  <p className="text-[var(--foreground)]/80">
                    扩展到上海和广州，推出咖啡学院项目，培训下一代咖啡师。
                  </p>
                </div>
              </div>
              <div className="absolute left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--primary)] z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* 我们的核心价值观 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">我们的核心价值观</h2>
            <div className="h-1 w-20 bg-[var(--primary)] mx-auto mb-6" />
            <p className="text-[var(--foreground)]/80 max-w-2xl mx-auto">
              这些价值观指导着我们的每一个决策和行动
            </p>
          </div>

          <div
            ref={valuesRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="value-item bg-white dark:bg-[#1a1a1a] p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-[var(--primary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">品质至上</h3>
              <p className="text-[var(--foreground)]/70">
                我们坚持使用最优质的原料，每一杯咖啡都经过精心制作，确保为顾客提供卓越的体验。
              </p>
            </div>

            <div className="value-item bg-white dark:bg-[#1a1a1a] p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-[var(--primary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">可持续发展</h3>
              <p className="text-[var(--foreground)]/70">
                我们致力于环保实践，从直接贸易咖啡豆到可堆肥包装，努力减少我们的环境足迹。
              </p>
            </div>

            <div className="value-item bg-white dark:bg-[#1a1a1a] p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-[var(--primary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">社区连接</h3>
              <p className="text-[var(--foreground)]/70">
                我们相信咖啡有连接人们的力量，我们的咖啡馆是社区聚会、交流和创造的场所。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 我们的团队 */}
      <section id="team" className="section-padding bg-[var(--secondary)]/10">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">认识我们的团队</h2>
            <div className="h-1 w-20 bg-[var(--primary)] mx-auto mb-6" />
            <p className="text-[var(--foreground)]/80 max-w-2xl mx-auto">
              我们的团队充满激情，致力于为您提供最好的咖啡体验
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-[#1a1a1a] rounded-lg overflow-hidden shadow-md"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-[var(--primary)] font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-[var(--foreground)]/70">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 加入我们 */}
      <section id="careers" className="section-padding">
        <div className="container-custom">
          <div className="bg-[var(--primary)] text-white p-8 md:p-12 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">加入我们的团队</h2>
                <p className="mb-6">
                  我们始终在寻找热爱咖啡、充满激情的人才加入我们的团队。如果你对咖啡充满热情，并希望在一个创新、友好的环境中工作，我们期待你的加入。
                </p>
                <button className="bg-white text-[var(--primary)] px-6 py-3 rounded-md hover:bg-[var(--text-light)]/90 transition-colors duration-300 font-medium">
                  查看职位空缺
                </button>
              </div>

              <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl("/join-team.jpg")}
                  alt="加入我们的团队"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
