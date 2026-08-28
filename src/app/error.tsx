"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 上报到监控服务（如 Sentry）的最佳位置
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-16 text-center">
      <p className="font-display text-6xl font-bold text-accent">☕</p>
      <h1 className="mt-4 font-display text-2xl font-bold">出错了，咖啡洒了</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-foreground/60">
        我们的小帮手正在擦桌子，请稍后再试。
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-8">
        重试
      </button>
    </div>
  );
}
