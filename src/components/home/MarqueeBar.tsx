const origins = [
  "埃塞俄比亚 耶加雪菲",
  "哥伦比亚 慧兰",
  "巴拿马 翡翠庄园",
  "云南 保山",
  "危地马拉 安提瓜",
  "肯尼亚 涅里",
];

/** 产区跑马灯：纯 CSS 动画，loop 为内容的一份复制用于无缝循环 */
export default function MarqueeBar() {
  const loop = [...origins, ...origins];

  return (
    <div className="overflow-hidden border-y border-primary-contrast/10 bg-primary-dark py-3.5">
      <div className="flex w-max animate-marquee gap-10">
        {loop.map((origin, i) => (
          <span
            key={`${origin}-${i}`}
            aria-hidden={i >= origins.length}
            className="flex shrink-0 items-center gap-10 text-sm font-medium tracking-[0.2em] text-primary-contrast/70"
          >
            {origin}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
