import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "联系我们",
  description:
    "联系 Brew Haven：门店地址、营业时间、合作咨询与常见问题。期待与你相遇。",
};

const contactInfo = [
  {
    title: "门店地址",
    lines: ["北京市朝阳区三里屯太古里北区 N3-101"],
    icon: "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-3 10.5c4.97 0 9-3.582 9-8 0-4.418-4.03-8-9-8s-9 3.582-9 8c0 4.418 4.03 8 9 8Z",
  },
  {
    title: "电话",
    lines: ["+86 10-8888-7777", "每日 08:00 – 22:00"],
    icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z",
  },
  {
    title: "邮箱",
    lines: ["hello@brewhaven.com", "合作与媒体垂询"],
    icon: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
  },
];

const businessHours = [
  { days: "周一 至 周五", time: "08:00 – 22:00" },
  { days: "周六 至 周日", time: "09:00 – 23:00" },
  { days: "法定节假日", time: "10:00 – 21:00" },
];

const faqs = [
  {
    q: "需要预约座位吗？",
    a: "门店不设最低消费、无需预约，高峰时段可能需要短暂等位。8 人以上的团体建议提前一天电话告知。",
  },
  {
    q: "可以开发票吗？",
    a: "可以。结账时告知店员发票抬头，或在配送订单备注中留下开票信息，电子发票将在 24 小时内发送至您的邮箱。",
  },
  {
    q: "咖啡豆可以邮购吗？",
    a: "可以。店内所有自有烘焙豆均支持全国邮购，下单后 48 小时内新鲜烘焙发出。可到店咨询或致电选购。",
  },
  {
    q: "门店可以办活动吗？",
    a: "欢迎。我们承接小型杯测会、手冲体验课与品牌联名活动，请发送活动需求至 hello@brewhaven.com。",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="联系我们"
        subtitle="无论是品尝建议、合作洽谈，还是只想聊聊咖啡，我们都期待你的声音。"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* 联系信息 */}
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {contactInfo.map((info) => (
                <div key={info.title} className="card-surface flex gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-5 w-5 text-accent" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d={info.icon} />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold">{info.title}</h2>
                    {info.lines.map((line) => (
                      <p key={line} className="mt-0.5 text-sm text-foreground/60">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 营业时间 */}
            <div className="card-surface p-5">
              <h2 className="font-semibold">营业时间</h2>
              <ul className="mt-3 space-y-2">
                {businessHours.map((h) => (
                  <li key={h.days} className="flex justify-between text-sm">
                    <span className="text-foreground/60">{h.days}</span>
                    <span className="font-medium">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 地图（演示：外链跳转百度地图） */}
            <a
              href="https://map.baidu.com/search/%E4%B8%89%E9%87%8C%E5%B1%AF%E5%A4%AA%E5%8F%A4%E9%87%8C"
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface group flex h-44 items-center justify-center overflow-hidden bg-muted transition-colors hover:bg-secondary/50"
            >
              <span className="flex flex-col items-center gap-2 text-sm text-foreground/50 transition-colors group-hover:text-accent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                点击查看地图与路线
              </span>
            </a>
          </div>

          {/* 表单 */}
          <ContactForm />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 bg-muted py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">FAQ</p>
            <h2 className="mt-2 font-display text-3xl font-bold">常见问题</h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="card-surface group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0 text-foreground/40 transition-transform group-open:rotate-45" aria-hidden="true">
                    <path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-7 text-foreground/60">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
