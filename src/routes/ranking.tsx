import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Avatar, CardSkeletons, Container, DemoBadge, EmptyState, ErrorState, PageHeader } from "@/components/common";
import { PodiumCard } from "@/components/TopBuyers";
import { fmtMoney, rankingQuery } from "@/lib/services";
import type { RankingPeriod } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ranking")({
  head: () => ({
    meta: [
      { title: "Ranking de compradores — Buraco House" },
      { name: "description", content: "Os jogadores que mais apoiaram a loja neste mês, trimestre e no total." },
      { property: "og:title", content: "Ranking — Buraco House" },
      { property: "og:description", content: "Veja o ranking dos maiores compradores." },
    ],
  }),
  component: Page,
});

const filters: { value: RankingPeriod; label: string }[] = [
  { value: "month", label: "Este mês" },
  { value: "quarter", label: "Últimos 3 meses" },
  { value: "total", label: "Total" },
];

function Page() {
  const [period, setPeriod] = useState<RankingPeriod>("total");
  const { data, isLoading, isError } = useQuery(rankingQuery(period));
  const top = data?.slice(0, 3) ?? [];
  const rest = data?.slice(3) ?? [];

  return (
    <>
      <PageHeader eyebrow="Ranking" title="Maiores compradores" subtitle="Quem mais apoia a loja. Valores atualizados pela administração." />
      <Container className="py-14">
        <div className="mb-10 flex justify-center">
          <div className="inline-flex flex-wrap justify-center gap-1 rounded-xl border border-border bg-surface p-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setPeriod(f.value)}
                className={cn("rounded-lg px-4 py-2 text-sm font-medium transition-colors", period === f.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-3"><CardSkeletons count={3} className="h-64" /></div>
        ) : isError ? (
          <ErrorState />
        ) : !data?.length ? (
          <EmptyState message="Nenhum dado de ranking para este período." />
        ) : (
          <>
            <div className="grid gap-5 pt-4 sm:grid-cols-3">
              {(top.length === 3 ? [1, 0, 2] : top.map((_, i) => i)).map((i) => (
                <div key={top[i]!.id} className={i === 0 ? "order-first sm:order-none" : ""}><PodiumCard entry={top[i]!} index={i} /></div>
              ))}
            </div>
            {rest.length > 0 && (
              <div className="card-surface mt-10 divide-y divide-border overflow-hidden">
                {rest.map((r, i) => (
                  <div key={r.id} className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:px-6">
                    <span className="font-display text-lg font-bold text-muted-foreground">{i + 4}º</span>
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar src={r.avatar_url} name={r.nickname} className="h-10 w-10" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{r.nickname}</p>
                        <p className="text-xs text-muted-foreground">{r.purchases} compras {r.is_demo && <DemoBadge />}</p>
                      </div>
                    </div>
                    <span className="font-display font-semibold text-primary-glow">{fmtMoney(r.total_spent)}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}
