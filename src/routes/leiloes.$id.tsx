import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Clock, MapPin, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/Countdown";
import { CardSkeletons, Container, DiscordButton, EmptyState, ErrorState, RarityBadge, StatusBadge } from "@/components/common";
import { auctionQuery, auctionStatus, fmtDate, fmtMoney, fmtTime, settingsQuery } from "@/lib/services";

export const Route = createFileRoute("/leiloes/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do leilão — Buraco House" },
      { name: "description", content: "Veja os Pokémon, horário e responsável por este leilão." },
      { property: "og:title", content: "Detalhes do leilão — Buraco House" },
      { property: "og:description", content: "Pokémon disponíveis, data e informações do leilão." },
    ],
  }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const { data, isLoading, isError } = useQuery(auctionQuery(id));
  const { data: s } = useQuery(settingsQuery);

  return (
    <Container className="py-10 sm:py-14">
      <Button asChild variant="ghost" size="sm" className="mb-6"><Link to="/leiloes"><ArrowLeft /> Voltar aos leilões</Link></Button>
      {isLoading ? (
        <div className="grid gap-5"><CardSkeletons count={2} className="h-56" /></div>
      ) : isError ? (
        <ErrorState />
      ) : !data?.auction ? (
        <EmptyState message="Leilão não encontrado." />
      ) : (
        (() => {
          const a = data.auction;
          const st = auctionStatus(a);
          return (
            <>
              <div className="card-surface overflow-hidden">
                {a.image_url && <img src={a.image_url} alt={a.name} className="h-56 w-full object-cover sm:h-72" />}
                <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto]">
                  <div className="min-w-0">
                    <StatusBadge status={st} />
                    <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{a.name}</h1>
                    {a.description && <p className="mt-3 text-muted-foreground">{a.description}</p>}
                    <div className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary-glow" />{fmtDate(a.starts_at)}</span>
                      <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary-glow" />{fmtTime(a.starts_at)}</span>
                      {a.responsible && <span className="flex items-center gap-2"><User className="h-4 w-4 text-primary-glow" />{a.responsible}</span>}
                      {a.location && <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary-glow" />{a.location}</span>}
                    </div>
                    {a.extra_info && (
                      <div className="mt-6 rounded-lg border border-border bg-surface p-4 text-sm">
                        <p className="mb-1 font-semibold">Informações adicionais</p>
                        <p className="text-muted-foreground">{a.extra_info}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    {(st === "soon" || st === "today") && <Countdown to={a.starts_at} />}
                    <DiscordButton url={a.discord_url || s?.discord_server_url}>Ir para o Discord</DiscordButton>
                  </div>
                </div>
              </div>

              <h2 className="mb-6 mt-14 text-2xl font-bold">Pokémon disponíveis</h2>
              {data.items.length === 0 ? (
                <EmptyState message="Os Pokémon deste leilão ainda não foram divulgados." />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {data.items.map((it) => (
                    <div key={it.id} className="card-surface card-hover overflow-hidden">
                      <div className="grid h-40 place-items-center bg-surface">
                        {it.image_url ? (
                          <img src={it.image_url} alt={it.name} className="h-full w-full object-contain p-4" loading="lazy" />
                        ) : (
                          <Sparkles className="h-10 w-10 text-primary-glow/60" />
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="min-w-0 font-display text-lg font-semibold">{it.name}</h3>
                          <RarityBadge rarity={it.rarity} />
                        </div>
                        {it.info && <p className="mt-2 text-sm text-muted-foreground">{it.info}</p>}
                        {it.starting_price != null && (
                          <p className="mt-4 text-sm">Lance inicial: <span className="font-semibold text-primary-glow">{fmtMoney(Number(it.starting_price))}</span></p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          );
        })()
      )}
    </Container>
  );
}
