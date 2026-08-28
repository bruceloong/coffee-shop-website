import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import MenuGrid from "./MenuGrid";
import { menuItems } from "@/data/menu";

export const metadata: Metadata = {
  title: "菜单",
  description:
    "浏览 Brew Haven 完整菜单：经典意式咖啡、手冲单品、精品茶饮、手工甜点与轻食简餐。",
};

export default function MenuPage() {
  return (
    <>
      <PageHero
        title="我们的菜单"
        subtitle="全部饮品均可调整浓度、糖度与奶种；甜点与轻食每日限量新鲜制作。"
      />
      <MenuGrid items={menuItems} />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="card-surface mx-auto max-w-3xl p-6 text-center text-sm leading-7 text-foreground/60">
          <p>
            <span className="font-medium text-foreground">特别说明：</span>
            咖啡豆与牛奶均可换为燕麦奶（+¥5）；对食材过敏或有饮食限制的顾客，
            请在下单前告知店员，我们会为你调整配方。
          </p>
        </div>
      </section>
    </>
  );
}
