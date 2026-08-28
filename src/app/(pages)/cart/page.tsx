"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { cartItems, isHydrated, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    router.push("/checkout");
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    clearCart();
    toast.success("购物车已清空");
  };

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center text-foreground/50">
        正在加载购物车…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold md:text-4xl">购物车</h1>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 flex flex-col items-center rounded-3xl border border-dashed border-line py-20 text-center"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className="h-16 w-16 text-foreground/25" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
          </svg>
          <p className="mt-4 text-lg font-medium text-foreground/70">购物车还是空的</p>
          <p className="mt-1 text-sm text-foreground/50">去菜单挑一杯喜欢的咖啡吧</p>
          <Link href="/menu" className="btn-primary mt-8">
            浏览菜单
          </Link>
        </motion.div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* 商品列表 */}
          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {cartItems.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: "hidden" }}
                  transition={{ duration: 0.25 }}
                  className="card-surface flex gap-4 p-4"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                    <Image src={item.imageSrc} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="truncate font-medium">{item.name}</h2>
                      <p className="shrink-0 font-display font-bold text-primary">
                        {formatPrice(item.price * item.quantity, true)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`减少一份${item.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-foreground/70 transition-colors hover:border-accent hover:text-accent"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-medium" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`增加一份${item.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-foreground/70 transition-colors hover:border-accent hover:text-accent"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`移除${item.name}`}
                        className="text-sm text-foreground/40 transition-colors hover:text-red-500"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>

            <li className="pt-1">
              <button
                type="button"
                onClick={handleClearCart}
                className="text-sm text-foreground/50 transition-colors hover:text-red-500"
              >
                清空购物车
              </button>
            </li>
          </ul>

          {/* 汇总 */}
          <aside className="card-surface sticky top-24 h-fit p-6">
            <h2 className="font-display text-lg font-bold">订单汇总</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-foreground/60">商品数量</dt>
                <dd>{totalItems} 件</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground/60">小计</dt>
                <dd>{formatPrice(totalPrice, true)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
                <dt>合计</dt>
                <dd className="font-display text-primary">{formatPrice(totalPrice, true)}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={handleCheckout}
              className="btn-primary mt-6 w-full"
            >
              去结算
            </button>
            <Link
              href="/menu"
              className="mt-3 block text-center text-sm text-foreground/50 transition-colors hover:text-accent"
            >
              继续选购
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
