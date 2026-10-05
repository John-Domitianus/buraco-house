import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Avatar, CardSkeletons, Container, DiscordButton, EmptyState, ErrorState, PageHeader } from "@/components/common";
import { collaboratorsQuery } from "@/lib/services";

export const Route = createFileRoute("/colaboradores")({
  head: () => ({
    meta: [
      { title: "Colaboradores — Mafia Store" },
      { name: "description", content: "Conheça a equipe responsável pela loja, vendas e organização." },
      { property: "og:title", content: "Colaboradores — Mafia Store" },
      { property: "og:description", content: "A equipe por trás da loja Cobblemon." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data, isLoading, isError } = useQuery(collaboratorsQuery);
  return (
    <>
      <PageHeader eyebrow="Equipe" title="Colaboradores" subtitle="As pessoas responsáveis pela loja, vendas e organização da comunidade." />
      <Container className="py-16">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><CardSkeletons count={3} className="h-72" /></div>
        ) : isError ? (
          <ErrorState />
        ) : !data?.length ? (
          <EmptyState message="Nenhum colaborador cadastrado no momento." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((c) => (
              <div key={c.id} className="card-surface card-hover flex flex-col items-center p-6 text-center">
                <Avatar src={c.avatar_url} name={c.nickname} className="h-20 w-20 text-3xl ring-2 ring-primary/50 ring-offset-4 ring-offset-card" />
                <h3 className="mt-5 max-w-full truncate font-display text-xl font-semibold">{c.nickname}</h3>
                {c.name && <p className="text-sm text-muted-foreground">{c.name}</p>}
                <span className="mt-3 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-glow">{c.role}</span>
                {c.description && <p className="mt-4 text-sm text-muted-foreground">{c.description}</p>}
                <DiscordButton url={c.discord_url} className="mt-6 w-full">Entrar em contato</DiscordButton>
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
