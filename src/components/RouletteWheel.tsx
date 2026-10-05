import type { RoulettePrize } from "@/lib/types";

export const prizeColorVar: Record<string, string> = {
  zinc: "var(--muted)",
  sky: "var(--discord)",
  emerald: "var(--success)",
  violet: "var(--primary)",
  amber: "var(--gold)",
  rose: "var(--live)",
};

/** Equal-size segments; probability only affects the server-side draw. */
export function RouletteWheel({ prizes, rotation, spinning }: { prizes: RoulettePrize[]; rotation: number; spinning: boolean }) {
  const n = Math.max(prizes.length, 1);
  const seg = 360 / n;
  const r = 100;
  const pt = (deg: number, rad = r) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [rad + rad * Math.cos(a), rad + rad * Math.sin(a)];
  };
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <div className="absolute left-1/2 top-[-6px] z-10 h-0 w-0 -translate-x-1/2 border-x-[14px] border-t-[24px] border-x-transparent border-t-primary-glow drop-shadow-lg" />
      <div className="absolute inset-0 rounded-full shadow-glow" />
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full rounded-full border-4 border-border"
        style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }}
      >
        {prizes.map((p, i) => {
          const [x1, y1] = pt(i * seg);
          const [x2, y2] = pt((i + 1) * seg);
          const mid = i * seg + seg / 2;
          const [tx, ty] = pt(mid, 0);
          const large = seg > 180 ? 1 : 0;
          return (
            <g key={p.id}>
              <path
                d={`M100,100 L${x1},${y1} A100,100 0 ${large} 1 ${x2},${y2} Z`}
                style={{ fill: prizeColorVar[p.color] ?? "var(--primary)", opacity: i % 2 ? 0.82 : 1 }}
                stroke="var(--background)"
                strokeWidth="1"
              />
              <text
                x={100}
                y={100}
                transform={`rotate(${mid} 100 100) translate(0 -62)`}
                textAnchor="middle"
                style={{ fill: "var(--foreground)", fontSize: 8, fontWeight: 700, fontFamily: "var(--font-display)" }}
              >
                {p.name.length > 14 ? p.name.slice(0, 13) + "…" : p.name}
              </text>
              <title>{`${tx}${ty}`}</title>
            </g>
          );
        })}
        <circle cx="100" cy="100" r="26" style={{ fill: "var(--background)" }} stroke="var(--border)" strokeWidth="2" />
      </svg>
    </div>
  );
}
