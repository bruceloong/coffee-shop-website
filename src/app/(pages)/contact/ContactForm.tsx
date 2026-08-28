"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const inputClass =
  "w-full rounded-xl border border-line bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent";

/**
 * 联系表单：优先使用 EmailJS 发送；未配置环境变量时降级为演示模式（模拟发送）。
 * 需要配置：NEXT_PUBLIC_EMAILJS_SERVICE_ID / NEXT_PUBLIC_EMAILJS_TEMPLATE_ID / NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
 */
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const isEmailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name) return setFormError("请填写您的称呼");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setFormError("请填写有效的邮箱地址");
    if (message.length < 5) return setFormError("留言内容请不少于 5 个字");

    setFormError(null);
    setSubmitting(true);
    try {
      if (isEmailConfigured) {
        const { default: emailjs } = await import("@emailjs/browser");
        await emailjs.send(
          SERVICE_ID!,
          TEMPLATE_ID!,
          { from_name: name, reply_to: email, message },
          { publicKey: PUBLIC_KEY }
        );
      } else {
        // 演示模式：模拟网络延迟
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      toast.success("留言发送成功，我们会尽快回复您！");
      form.reset();
    } catch {
      toast.error("发送失败，请稍后重试或直接致电门店");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} noValidate className="card-surface h-fit p-6 md:p-8">
        <h2 className="font-display text-xl font-bold">给我们留言</h2>

        {!isEmailConfigured && (
          <p className="mt-3 rounded-xl bg-accent/10 px-4 py-3 text-xs leading-5 text-accent">
            演示模式：未配置 EmailJS 环境变量，提交将模拟发送。
            配置 NEXT_PUBLIC_EMAILJS_* 后即可真实收信。
          </p>
        )}

        <div className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block text-sm text-foreground/70">
                称呼
              </label>
              <input id="contact-name" name="name" type="text" autoComplete="name" placeholder="怎么称呼您？" className={inputClass} />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1.5 block text-sm text-foreground/70">
                邮箱
              </label>
              <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm text-foreground/70">
              留言内容
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              placeholder="想对我们说的话、合作意向、活动咨询…"
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {formError && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {formError}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full disabled:opacity-60">
          {submitting ? "发送中…" : "发送留言"}
        </button>
      </form>
    </motion.div>
  );
}
