import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import AboutContent from "./AboutContent";
import Team1 from "@/assets/images/team-1.jpg";
import Team2 from "@/assets/images/team-2.jpg";
import Team3 from "@/assets/images/team-3.jpg";

export const metadata: Metadata = {
  title: "关于我们",
  description:
    "了解 Brew Haven 的品牌故事：从 2018 年的一间烘焙工作室，到如今连接社区与咖啡爱好者的精品咖啡品牌。",
};

const teamMembers = [
  { image: Team1, name: "阿伦", role: "创始人 · 首席烘焙师" },
  { image: Team2, name: "小雅", role: "主理咖啡师 · Q-Grader" },
  { image: Team3, name: "大鹏", role: "门店主厨 · 甜点研发" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="关于 Brew Haven"
        subtitle="一杯咖啡的温度，来自一颗豆子的旅程，也来自一群热爱咖啡的人。"
      />

      <AboutContent />

      {/* 团队 */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">Team</p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">核心团队</h2>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <div key={member.name} className="card-surface group overflow-hidden">
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={member.image}
                  alt={`${member.name}，${member.role}`}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="font-display text-lg font-semibold">{member.name}</h3>
                <p className="mt-1 text-sm text-foreground/60">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
