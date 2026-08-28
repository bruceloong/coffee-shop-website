"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPrice, isValidPhone, generateOrderNumber } from "@/lib/format";

type PaymentMethod = "wechat" | "alipay";

const inputClass =
  "w-full rounded-xl border border-line bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent";

export default function CheckoutPage() {
  const { cartItems, isHydrated, totalItems, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wechat");
  const [formError, setFormError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();

    if (!name) return setFormError("请填写收货人姓名");
    if (!isValidPhone(phone)) return setFormError("请填写正确的 11 位手机号");
    if (!address) return setFormError("请填写收货地址");

    setFormError(null);
    setOrderNumber(generateOrderNumber());
    setPaid(true);
    clearCart();
  };

  // 支付成功页
  if (paid) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 pt-24 pb-16 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100"
        >
          <svg viewBox="0 0 52 52" className="h-12 w-12 text-green-600" aria-hidden="true">
            <motion.path
              d="M14 27 L23 36 L38 18"
              fill="none"
              stroke="currentColor"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            />
          </svg>
        </motion.div>
        <h1 className="mt-6 font-display text-2xl font-bold">支付成功！</h1>
        <p className="mt-2 text-sm leading-6 text-foreground/60">
          订单号 <span className="font-mono font-medium text-foreground">{orderNumber}</span>
          <br />
          我们会尽快为你准备咖啡，请留意配送通知。
        </p>
        <Link href="/menu" className="btn-primary mt-8">
          继续选购
        </Link>
      </div>
    );
  }

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center text-foreground/50">
        正在加载结算信息…
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 pt-24 text-center">
        <h1 className="font-display text-2xl font-bold">购物车是空的</h1>
        <p className="mt-2 text-sm text-foreground/60">先去菜单挑几杯喜欢的咖啡吧</p>
        <Link href="/menu" className="btn-primary mt-8">
          浏览菜单
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold md:text-4xl">确认订单</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        {/* 表单 */}
        <form id="checkout-form" onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* 收货信息 */}
          <section className="card-surface p-6">
            <h2 className="font-display text-lg font-bold">收货信息</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm text-foreground/70">
                  姓名
                </label>
                <input id="name" name="name" type="text" autoComplete="name" placeholder="收货人姓名" className={inputClass} />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm text-foreground/70">
                  手机号
                </label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={11} placeholder="11 位手机号" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="mb-1.5 block text-sm text-foreground/70">
                  收货地址
                </label>
                <input id="address" name="address" type="text" autoComplete="street-address" placeholder="街道、楼栋、门牌号" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="note" className="mb-1.5 block text-sm text-foreground/70">
                  订单备注<span className="text-foreground/40">（选填）</span>
                </label>
                <textarea id="note" name="note" rows={2} placeholder="如：少糖、不要洋葱…" className={inputClass} />
              </div>
            </div>
          </section>

          {/* 支付方式 */}
          <section className="card-surface p-6">
            <h2 className="font-display text-lg font-bold">支付方式</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {(
                [
                  { id: "wechat", label: "微信支付", hint: "推荐" },
                  { id: "alipay", label: "支付宝", hint: "" },
                ] as const
              ).map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  aria-pressed={paymentMethod === method.id}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-sm font-medium transition-all ${
                    paymentMethod === method.id
                      ? "border-accent bg-accent/5 text-foreground shadow-sm"
                      : "border-line text-foreground/60 hover:border-accent/50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {method.id === "wechat" ? (
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-green-600" fill="currentColor" aria-hidden="true">
                        <path d="M8.7 4C4.9 4 1.8 6.6 1.8 9.9c0 1.9 1 3.5 2.6 4.6l-.7 2.1 2.4-1.2c.7.2 1.4.3 2.2.3h.4a5.4 5.4 0 0 1-.2-1.5c0-3.1 3-5.6 6.6-5.6h.4C14.8 6 12 4 8.7 4ZM6.4 7.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm4.6 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8ZM22.2 14c0-2.8-2.8-5.1-6.2-5.1S9.8 11.2 9.8 14s2.8 5.1 6.2 5.1c.7 0 1.3-.1 1.9-.3l2.1 1-.6-1.8c1.7-.9 2.8-2.4 2.8-4Zm-8.2-1.6a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Zm4 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-500" fill="currentColor" aria-hidden="true">
                        <path d="M20.5 7.3 9.6 11.9c-.9.4-1.9-.1-2.1-1l-.2-.8c-.2-.9.3-1.9 1.2-2.2l9.3-3.6c.4-.2.4-.8-.1-.9-1.1-.2-2.8-.3-4.5.3L5.9 6.6C4.7 7 3.9 8.1 4 9.4l.1 1.2c.1 1 1 1.8 2 1.8h6.2c.3 0 .4.3.2.5l-7.2 5c-.5.4-.4 1.1.2 1.3 1.4.4 3.4.5 5.6-.5l6.5-3c1.2-.5 1.9-1.7 1.8-3l-.1-1.3c-.1-1-.9-1.7-1.9-1.7h-4.3c-.3 0-.4-.4-.1-.5l7-2.7c.4-.2.4-.8-.1-.9-.9-.2-2.3-.3-3.4.2Z" />
                      </svg>
                    )}
                    {method.label}
                  </span>
                  {method.hint && (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent">
                      {method.hint}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* 收款码示意 */}
            <div className="mt-5 flex items-center gap-4 rounded-xl bg-muted p-4">
              <svg viewBox="0 0 100 100" className="h-20 w-20 shrink-0" aria-hidden="true">
                <rect width="100" height="100" rx="8" fill={paymentMethod === "wechat" ? "#07c160" : "#1677ff"} opacity="0.12" />
                <rect x="14" y="14" width="30" height="30" rx="4" fill="none" stroke={paymentMethod === "wechat" ? "#07c160" : "#1677ff"} strokeWidth="5" />
                <rect x="56" y="14" width="30" height="30" rx="4" fill="none" stroke={paymentMethod === "wechat" ? "#07c160" : "#1677ff"} strokeWidth="5" />
                <rect x="14" y="56" width="30" height="30" rx="4" fill="none" stroke={paymentMethod === "wechat" ? "#07c160" : "#1677ff"} strokeWidth="5" />
                <rect x="56" y="56" width="12" height="12" fill={paymentMethod === "wechat" ? "#07c160" : "#1677ff"} />
                <rect x="74" y="56" width="12" height="12" fill={paymentMethod === "wechat" ? "#07c160" : "#1677ff"} opacity="0.5" />
                <rect x="56" y="74" width="12" height="12" fill={paymentMethod === "wechat" ? "#07c160" : "#1677ff"} opacity="0.5" />
                <rect x="74" y="74" width="12" height="12" fill={paymentMethod === "wechat" ? "#07c160" : "#1677ff"} />
              </svg>
              <div>
                <p className="text-sm font-medium">
                  使用{paymentMethod === "wechat" ? "微信" : "支付宝"}扫码支付
                </p>
                <p className="mt-1 text-xs text-foreground/50">
                  演示站点：点击「确认支付」即模拟支付成功
                </p>
              </div>
            </div>
          </section>
        </form>

        {/* 汇总 */}
        <aside className="card-surface sticky top-24 h-fit p-6">
          <h2 className="font-display text-lg font-bold">订单明细</h2>
          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.imageSrc} alt={item.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-foreground/50">
                    {formatPrice(item.price, true)} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium">{formatPrice(item.price * item.quantity, true)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-foreground/60">共 {totalItems} 件</dt>
              <dd>{formatPrice(totalPrice, true)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-foreground/60">配送费</dt>
              <dd className="text-green-600">免配送费</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
              <dt>应付</dt>
              <dd className="font-display text-primary">{formatPrice(totalPrice, true)}</dd>
            </div>
          </dl>
          <AnimatePresence>
            {formError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                role="alert"
                className="mt-4 overflow-hidden rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
              >
                {formError}
              </motion.p>
            )}
          </AnimatePresence>
          <button
            type="submit"
            form="checkout-form"
            onClick={(e) => {
              e.preventDefault();
              (e.currentTarget.form as HTMLFormElement)?.requestSubmit();
            }}
            className="btn-primary mt-5 w-full"
          >
            确认支付 {formatPrice(totalPrice, true)}
          </button>
          <p className="mt-3 text-center text-xs text-foreground/40">
            点击支付即表示同意《演示服务条款》
          </p>
        </aside>
      </div>
    </div>
  );
}
