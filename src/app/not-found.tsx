import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-16 text-center">
      <p className="font-display text-7xl font-bold text-accent">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">这杯咖啡不存在</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-foreground/60">
        您访问的页面可能已被移走，或者地址有一点点拼写偏差。
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary">
          回到首页
        </Link>
        <Link href="/menu" className="btn-secondary">
          浏览菜单
        </Link>
      </div>
    </div>
  );
}
