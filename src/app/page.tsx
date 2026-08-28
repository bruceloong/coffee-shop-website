import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import MarqueeBar from "@/components/home/MarqueeBar";
import FeaturedSection from "@/components/home/FeaturedSection";
import AboutSection from "@/components/home/AboutSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBar />
      <FeaturedSection />
      <AboutSection />
      <StatsSection />
      <TestimonialsSection />

      {/* 底部 CTA（server 渲染 + CSS 动画） */}
      <section className="bg-primary-dark py-20 text-center text-primary-contrast">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="animate-fade-up font-display text-3xl font-bold md:text-4xl">
            今天，从一杯好咖啡开始
          </h2>
          <p className="animate-fade-up-1 mt-4 text-primary-contrast/70">
            线上下单，到店即取；也欢迎走进门店，让我们为你亲手冲煮。
          </p>
          <div className="animate-fade-up-2 mt-8 flex justify-center gap-4">
            <Link
              href="/menu"
              className="rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-primary-contrast transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
            >
              立即订购
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-primary-contrast/40 px-8 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent active:scale-[0.98]"
            >
              联系我们
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
