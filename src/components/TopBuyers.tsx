import { useQuery } from "@tanstack/react-query";
import { Crown } from "lucide-react";
import { Avatar, CardSkeletons, DemoBadge, EmptyState, ErrorState } from "@/components/common";
import { fmtMoney, rankingQuery } from "@/lib/services";
import type { RankingEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

const medal = [
  { label: "1º", cls: "text-gold border-gold/50", ring: "ring-gold/60" },
  { label: "2º", cls: "text-silver border-silver/50", ring: "ring-silver/60" },
  { label: "3º", cls: "text-bronze border-bronze/50", ring: "ring-bronze/60" },
];

export function PodiumCard({ entry, index }: { entry: RankingEntry; index: number }) {
  const m = medal[index];
  return (
    <div className={cn("card-surface card-hover relative flex flex-col items-center gap-3 p-6 text-center", index === 0 && "sm:-translate-y-3 border-gold/40")}>
      {index === 0 && <Crown className="absolute -top-4 h-8 w-8 text-gold" />}
      <span className={cn("rounded-full border px-3 py-0.5 font-display text-sm font-bold", m.cls)}>{m.label}</span>
      <Avatar src={entry.avatar_url} name={entry.nickname} className={cn("h-16 w-16 text-2xl ring-2", m.ring)} />
      <div className="min-w-0 max-w-full">
        <p className="truncate font-display text-lg font-semibold">{entry.nickname}</p>
        {entry.is_demo && <div className="mt-1"><DemoBadge /></div>}
      </div>
      <p className="font-display text-2xl font-bold text-gradient">{fmtMoney(entry.total_spent)}</p>
      <p className="text-xs text-muted-foreground">{entry.purchases} compras</p>
    </div>
  );
}

export function TopBuyers() {
  const { data, isLoading, isError } = useQuery(rankingQuery("total"));
  if (isLoading) return <div className="grid gap-5 sm:grid-cols-3"><CardSkeletons count={3} className="h-64" /></div>;
  if (isError) return <ErrorState />;
  if (!data?.length) return <EmptyState message="Nenhum comprador no ranking ainda." />;
  const top = data.slice(0, 3);
  const order = top.length === 3 ? [1, 0, 2] : top.map((_, i) => i);
  return (
    <div className="grid gap-5 pt-4 sm:grid-cols-3">
      {order.map((i) => (
        <div key={top[i].id} className={cn(i === 0 ? "order-first sm:order-none" : "")}>
          <PodiumCard entry={top[i]} index={i} />
        </div>
      ))}
    </div>
  );
}
