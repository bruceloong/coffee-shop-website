"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/menu", label: "菜单" },
  { href: "/about", label: "关于我们" },
  { href: "/contact", label: "联系我们" },
];

/** 购物车入口：水合完成前不渲染角标，避免闪烁 */
function CartLink({ onClick }: { onClick?: () => void }) {
  const { totalItems, isHydrated } = useCart();
  const count = Math.min(totalItems, 99);

  return (
    <Link
      href="/cart"
      onClick={onClick}
      aria-label={`购物车，${totalItems} 件商品`}
      className="relative rounded-full p-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>
      <AnimatePresence>
        {isHydrated && totalItems > 0 && (
          <motion.span
            key="cart-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold leading-none text-primary-contrast"
          >
            {count}
            {totalItems > 99 ? "+" : ""}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 路由变化时关闭移动端菜单
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // 菜单打开时锁定页面滚动，并支持 Esc 关闭
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line/60 bg-background/85 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Brew Haven 首页">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-7 w-7 text-primary"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Zm13 1.5h1a2.5 2.5 0 0 1 0 5h-1M7 3.5c0 1-.8 1.2-.8 2.2m3.8-2.7c0 1-.8 1.2-.8 2.2m3.8-2.2c0 1-.8 1.2-.8 2.2"
            />
          </svg>
          <span className="font-display text-xl font-bold tracking-wide text-primary">
            Brew Haven
          </span>
        </Link>

        {/* 桌面端导航 */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-secondary text-primary"
                  : "text-foreground/80 hover:bg-secondary/60 hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <CartLink />
          <Link href="/menu" className="btn-primary hidden !px-5 !py-2 text-sm md:inline-flex">
            立即订购
          </Link>
          {/* 移动端汉堡按钮 */}
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "关闭菜单" : "打开菜单"}
            className="rounded-full p-2 text-foreground/80 transition-colors hover:bg-secondary md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-6 w-6"
              aria-hidden="true"
            >
              {isOpen ? (
                <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-b border-line/60 bg-background/95 backdrop-blur-md md:hidden"
          >
            <div className="space-y-1 px-4 pb-6 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-secondary text-primary"
                      : "text-foreground/80 hover:bg-secondary/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/menu" onClick={closeMenu} className="btn-primary mt-3 w-full">
                立即订购
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
