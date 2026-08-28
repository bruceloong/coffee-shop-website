"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

const shopLinks = [
  { href: "/menu", label: "全部菜单" },
  { href: "/cart", label: "购物车" },
  { href: "/checkout", label: "结算" },
];

const supportLinks = [
  { href: "/contact#faq", label: "常见问题" },
  { href: "/contact", label: "联系我们" },
];

const followLinks = [
  { href: "https://weixin.com", label: "微信" },
  { href: "https://weibo.com", label: "微博" },
  { href: "https://www.xiaohongshu.com", label: "小红书" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("请输入有效的邮箱地址");
      return;
    }
    toast.success("订阅成功，欢迎加入 Brew Haven 咖啡通讯！");
    setEmail("");
  };

  return (
    <footer className="bg-primary-dark text-primary-contrast">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* 品牌 */}
          <div>
            <p className="font-display text-2xl font-bold">Brew Haven</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-primary-contrast/70">
              源自 2018 年的精品咖啡烘焙坊，用一杯好咖啡温暖城市的每一个清晨。
            </p>
          </div>

          {/* 门店 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
              门店
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-contrast/80 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 支持 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
              支持
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-contrast/80 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-3 text-sm">
              {followLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-contrast/80 transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* 咖啡通讯 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
              咖啡通讯
            </h3>
            <p className="mt-4 text-sm text-primary-contrast/70">
              订阅获取新品预告与会员专属优惠。
            </p>
            <form onSubmit={handleSubscribe} className="mt-3 flex gap-2" noValidate>
              <label htmlFor="newsletter-email" className="sr-only">
                邮箱地址
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-full border border-primary-contrast/25 bg-primary-contrast/10 px-4 py-2 text-sm text-primary-contrast placeholder:text-primary-contrast/40 focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-primary-contrast transition-opacity hover:opacity-90"
              >
                订阅
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-primary-contrast/15 pt-6 text-xs text-primary-contrast/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Brew Haven. 保留所有权利。</p>
          <p>北京市朝阳区三里屯太古里北区 N3-101 · 每日 08:00 – 22:00</p>
        </div>
      </div>
    </footer>
  );
}
