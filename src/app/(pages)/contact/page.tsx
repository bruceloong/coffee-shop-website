"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    try {
      setFormStatus("loading");

      // 使用EmailJS发送表单
      // 注意：需要在实际项目中替换为您的EmailJS服务ID、模板ID和公钥
      await emailjs.sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        formRef.current,
        "YOUR_PUBLIC_KEY"
      );

      setFormStatus("success");
      formRef.current.reset();

      // 5秒后重置状态
      setTimeout(() => {
        setFormStatus("idle");
      }, 5000);
    } catch (error) {
      console.error("发送邮件失败:", error);
      setFormStatus("error");

      // 5秒后重置状态
      setTimeout(() => {
        setFormStatus("idle");
      }, 5000);
    }
  };

  // 营业时间数据
  const businessHours = [
    { day: "周一至周五", hours: "8:00 - 22:00" },
    { day: "周六", hours: "9:00 - 23:00" },
    { day: "周日", hours: "9:00 - 21:00" },
  ];

  // 联系方式数据
  const contactInfo = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: "地址",
      content: "北京市朝阳区三里屯太古里",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      title: "电话",
      content: "(010) 8888-7777",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "邮箱",
      content: "info@brewhaven.com",
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
            联系我们
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
            我们期待听到您的声音，无论是反馈、建议还是合作机会
          </motion.p>
        </div>
      </div>

      {/* 联系信息和表单 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 联系信息 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">与我们取得联系</h2>
              <div className="h-1 w-20 bg-[var(--primary)] mb-8" />

              <div className="space-y-8 mb-10">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-[var(--primary)]/10 p-3 rounded-full mr-4">
                      <div className="text-[var(--primary)]">{info.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        {info.title}
                      </h3>
                      <p className="text-[var(--foreground)]/70">
                        {info.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-semibold mb-4">营业时间</h3>
              <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md p-6">
                <table className="w-full">
                  <tbody>
                    {businessHours.map((item, index) => (
                      <tr
                        key={index}
                        className={
                          index !== businessHours.length - 1
                            ? "border-b border-gray-200 dark:border-gray-700"
                            : ""
                        }
                      >
                        <td className="py-3 font-medium">{item.day}</td>
                        <td className="py-3 text-right">{item.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* 联系表单 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">发送消息</h2>

                {formStatus === "success" && (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 p-4 rounded-md mb-6">
                    您的消息已成功发送！我们会尽快回复您。
                  </div>
                )}

                {formStatus === "error" && (
                  <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-md mb-6">
                    发送消息时出现错误，请稍后再试。
                  </div>
                )}

                <form ref={formRef} onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        姓名
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        邮箱
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2"
                    >
                      主题
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:bg-gray-800"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      消息
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:bg-gray-800"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === "loading"}
                    className="btn-primary w-full flex justify-center items-center"
                  >
                    {formStatus === "loading" ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        发送中...
                      </>
                    ) : (
                      "发送消息"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 地图 */}
      <section className="section-padding bg-[var(--secondary)]/10">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">我们的位置</h2>
            <div className="h-1 w-20 bg-[var(--primary)] mx-auto mb-6" />
            <p className="text-[var(--foreground)]/80 max-w-2xl mx-auto">
              欢迎光临我们的咖啡店，我们期待您的到来
            </p>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg overflow-hidden shadow-md">
            <div className="aspect-video w-full">
              {/* 这里可以嵌入实际的地图，例如Google Maps或百度地图 */}
              {/* 以下是一个占位图像 */}
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  地图将在这里显示
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 常见问题 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">常见问题</h2>
            <div className="h-1 w-20 bg-[var(--primary)] mx-auto mb-6" />
            <p className="text-[var(--foreground)]/80 max-w-2xl mx-auto">
              以下是我们的顾客经常问到的一些问题
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold mb-3">
                你们提供外送服务吗？
              </h3>
              <p className="text-[var(--foreground)]/70">
                是的，我们提供外送服务。您可以通过我们的官方网站、APP或电话下单。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold mb-3">你们接受预订吗？</h3>
              <p className="text-[var(--foreground)]/70">
                是的，我们接受团体预订和私人活动预订。请提前至少48小时联系我们。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold mb-3">
                你们有无乳糖和素食选项吗？
              </h3>
              <p className="text-[var(--foreground)]/70">
                是的，我们提供多种无乳糖和素食选项。请告知我们您的饮食需求，我们的咖啡师会为您推荐合适的选择。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold mb-3">你们有会员计划吗？</h3>
              <p className="text-[var(--foreground)]/70">
                是的，我们有会员积分计划。每消费1元可获得1积分，积分可用于兑换饮品、食品或周边商品。
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
