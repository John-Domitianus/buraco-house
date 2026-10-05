import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Gavel, Handshake, MessageCircle, PackageCheck, ArrowRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardSkeletons, Container, DiscordButton, EmptyState, ErrorState, SectionTitle } from "@/components/common";
import { TopBuyers } from "@/components/TopBuyers";
import { fmtDate, howItWorks, newsQuery, settingsQuery } from "@/lib/services";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mafia Store — Pokémon, leilões e oportunidades Cobblemon" },
      { name: "description", content: "Leilões de Pokémon, ranking de compradores, colaboradores e roleta da comunidade Cobblemon." },
      { property: "og:title", content: "Mafia Store — Loja e comunidade Cobblemon" },
      { property: "og:description", content: "Leilões, ranking, novidades e muito mais para sua jornada no Cobblemon." },
    ],
  }),
  component: Home,
});

const stepIcons = [Gavel, Handshake, MessageCircle, PackageCheck];

function Home() {
  const { data: s } = useQuery(settingsQuery);
  const news = useQuery(newsQuery);
  const steps = howItWorks(s?.how_it_works);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
        <Container className="relative py-24 sm:py-32">
          <div className="max-w-2xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-glow">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" /> Comunidade Cobblemon
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              {s?.store_name ?? "Mafia Store"}
            </h1>
            <p className="mt-4 font-display text-xl font-semibold text-gradient sm:text-2xl">
              {s?.hero_title ?? "Pokémon, leilões e oportunidades para sua jornada."}
            </p>
            <p className="mt-5 max-w-xl text-muted-foreground">{s?.hero_description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg"><Link to="/leiloes">Ver Leilões <ArrowRight /></Link></Button>
              <DiscordButton url={s?.discord_server_url} size="lg" />
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-20">
        <SectionTitle title="Como funciona" subtitle="Simples, seguro e direto pelo Discord." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((st, i) => {
            const Icon = stepIcons[i % stepIcons.length];
            return (
              <div key={i} className="card-surface card-hover p-6 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="mb-5 flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary-glow"><Icon className="h-5 w-5" /></span>
                  <span className="font-display text-3xl font-bold text-muted/80">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-display text-lg font-semibold">{st.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{st.description}</p>
              </div>
            );
          })}
        </div>
      </Container>

      <Container className="py-10">
        <SectionTitle title="Novidades" subtitle="O que está acontecendo na loja." />
        {news.isLoading ? (
          <div className="grid gap-5 md:grid-cols-3"><CardSkeletons count={3} className="h-56" /></div>
        ) : news.isError ? (
          <ErrorState />
        ) : !news.data?.length ? (
          <EmptyState message="Nenhuma novidade publicada." />
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {news.data.map((n) => (
              <article key={n.id} className="card-surface card-hover overflow-hidden">
                {n.image_url ? (
                  <img src={n.image_url} alt={n.title} className="h-40 w-full object-cover" loading="lazy" />
                ) : (
                  <div className="h-2 bg-gradient-primary" />
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-semibold text-primary-glow">{n.category}</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />{fmtDate(n.published_at)}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{n.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{n.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>

      <Container className="py-20">
        <SectionTitle
          title="Maiores compradores"
          subtitle="Os jogadores que mais apoiam a loja."
          action={<Button asChild variant="outline"><Link to="/ranking">Ver ranking completo</Link></Button>}
        />
        <TopBuyers />
      </Container>
    </>
  );
}
