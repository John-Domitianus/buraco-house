import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuctionCard } from "@/components/AuctionCard";
import { Countdown } from "@/components/Countdown";
import { CardSkeletons, Container, DiscordButton, EmptyState, ErrorState, PageHeader, SectionTitle, StatusBadge } from "@/components/common";
import { auctionStatus, auctionsQuery, fmtDate, fmtTime, pickNextAuction, settingsQuery } from "@/lib/services";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leiloes/")({
  head: () => ({
    meta: [
      { title: "Leilões — Mafia Store" },
      { name: "description", content: "Próximos leilões de Pokémon, contagem regressiva e leilões anteriores." },
      { property: "og:title", content: "Leilões — Mafia Store" },
      { property: "og:description", content: "Acompanhe o próximo leilão de Pokémon da comunidade." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data, isLoading, isError } = useQuery(auctionsQuery);
  const { data: s } = useQuery(settingsQuery);
  const next = data ? pickNextAuction(data) : undefined;
  const others = (data ?? []).filter((a) => a.id !== next?.id);
  const past = others.filter((a) => auctionStatus(a) === "ended");
  const upcoming = others.filter((a) => auctionStatus(a) !== "ended");

  return (
    <>
      <PageHeader eyebrow="Leilões" title="Leilões" subtitle="Pokémon raros, lances ao vivo e oportunidades únicas." />
      <Container className="py-16">
        <SectionTitle title="Próximo leilão" />
        {isLoading ? (
          <CardSkeletons count={1} className="h-72" />
        ) : isError ? (
          <ErrorState />
        ) : !next ? (
          <EmptyState message="Nenhum leilão programado no momento." />
        ) : (
          (() => {
            const st = auctionStatus(next);
            return (
              <div className={cn("card-surface relative overflow-hidden p-6 sm:p-10", st === "live" && "border-live/50 shadow-glow")}>
                <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-70" />
                <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div className="min-w-0">
                    <StatusBadge status={st} />
                    <h2 className="mt-4 text-2xl font-bold sm:text-4xl">{next.name}</h2>
                    {next.description && <p className="mt-3 max-w-2xl text-muted-foreground">{next.description}</p>}
                    <div className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary-glow" />{fmtDate(next.starts_at)}</span>
                      <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary-glow" />{fmtTime(next.starts_at)}</span>
                      {next.responsible && <span className="flex items-center gap-2"><User className="h-4 w-4 text-primary-glow" />{next.responsible}</span>}
                      {next.location && <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary-glow" />{next.location}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {st !== "live" && <Countdown to={next.starts_at} />}
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button asChild variant="hero"><Link to="/leiloes/$id" params={{ id: next.id }}>Ver leilão</Link></Button>
                      <DiscordButton url={next.discord_url || s?.discord_server_url}>Ir para o Discord</DiscordButton>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        )}

        {upcoming.length > 0 && (
          <div className="mt-16">
            <SectionTitle title="Também agendados" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{upcoming.map((a) => <AuctionCard key={a.id} auction={a} />)}</div>
          </div>
        )}

        <div className="mt-16">
          <SectionTitle title="Leilões anteriores" />
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><CardSkeletons count={3} /></div>
          ) : past.length === 0 ? (
            <EmptyState message="Nenhum leilão encerrado ainda." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{past.map((a) => <AuctionCard key={a.id} auction={a} />)}</div>
          )}
        </div>
      </Container>
    </>
  );
}
