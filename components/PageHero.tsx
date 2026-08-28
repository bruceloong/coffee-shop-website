interface PageHeroProps {
  title: string;
  subtitle?: string;
}

/** 内页顶部横幅（server 组件，使用 CSS 动画避免额外客户端 JS） */
export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="bg-primary pb-14 pt-28 text-primary-contrast">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="animate-fade-up font-display text-4xl font-bold md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="animate-fade-up-1 mt-3 max-w-2xl text-base leading-7 text-primary-contrast/75">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
