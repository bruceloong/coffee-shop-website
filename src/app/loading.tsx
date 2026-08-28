export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-16">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-line border-t-primary" />
        <div className="absolute inset-2 rounded-full border-[2px] border-transparent border-b-accent [animation:spin_1.4s_linear_infinite_reverse]" aria-hidden="true" />
      </div>
      <p className="text-sm text-foreground/50">正在为您冲泡…</p>
    </div>
  );
}
