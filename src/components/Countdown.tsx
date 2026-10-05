import { useEffect, useState } from "react";

export function Countdown({ to }: { to: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return null;
  const diff = Math.max(0, new Date(to).getTime() - now);
  if (diff === 0) return null;
  const parts = [
    ["d", Math.floor(diff / 86400000)],
    ["h", Math.floor(diff / 3600000) % 24],
    ["m", Math.floor(diff / 60000) % 60],
    ["s", Math.floor(diff / 1000) % 60],
  ] as const;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Começa em</p>
      <div className="flex gap-2">
        {parts.map(([l, v]) => (
          <div key={l} className="min-w-14 rounded-lg border border-border bg-surface px-2 py-2 text-center">
            <div className="font-display text-xl font-bold tabular-nums sm:text-2xl">{String(v).padStart(2, "0")}</div>
            <div className="text-[10px] uppercase text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
