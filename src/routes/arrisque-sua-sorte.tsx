import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Gift, Coins } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CardSkeletons, Container, EmptyState, ErrorState, PageHeader, RarityBadge, SectionTitle } from "@/components/common";
import { RouletteWheel, prizeColorVar } from "@/components/RouletteWheel";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { prizesQuery, resultsQuery, settingsQuery } from "@/lib/services";
import type { RoulettePrize } from "@/lib/types";

export const Route = createFileRoute("/arrisque-sua-sorte")({
  head: () => ({
    meta: [
      { title: "Arrisque sua Sorte — Mafia Store" },
      { name: "description", content: "Gire a roleta com créditos virtuais e concorra a prêmios exclusivos." },
      { property: "og:title", content: "Arrisque sua Sorte — Mafia Store" },
      { property: "og:description", content: "Você confia na sua sorte? Gire a roleta." },
    ],
  }),
  component: Page,
});

type DemoResult = { id: string; nickname: string; prize_name: string; created_at: string };

function demoPick(prizes: RoulettePrize[]) {
  const total = prizes.reduce((s, p) => s + Number(p.probability), 0);
  let r = Math.random() * total;
  for (const p of prizes) {
    r -= Number(p.probability);
    if (r < 0) return p;
  }
  return prizes[prizes.length - 1];
}

function Page() {
  const prizes = useQuery(prizesQuery);
  const results = useQuery(resultsQuery);
  const { data: s } = useQuery(settingsQuery);
  const { session, profile, refreshProfile } = useAuth();
  const qc = useQueryClient();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [won, setWon] = useState<RoulettePrize | null>(null);
  const [demoHistory, setDemoHistory] = useState<DemoResult[]>([]);
  const list = prizes.data ?? [];
  const cost = s?.spin_cost ?? 100;

  async function spin() {
    if (!list.length || spinning) return;
    let prize: RoulettePrize | undefined;
    if (session) {
      const { data, error } = await supabase.rpc("spin_roulette");
      if (error) return toast.error(error.message);
      prize = list.find((p) => p.id === (data as { prize_id: string }).prize_id) ?? list[0];
    } else {
      prize = demoPick(list);
    }
    const idx = list.findIndex((p) => p.id === prize!.id);
    const seg = 360 / list.length;
    const target = 360 - (idx * seg + seg / 2);
    const jitter = (Math.random() - 0.5) * seg * 0.6;
    const base = rotation - (rotation % 360);
    setSpinning(true);
    setRotation(base + 360 * 6 + target + jitter);
    setTimeout(() => {
      setSpinning(false);
      setWon(prize!);
      if (session) {
        qc.invalidateQueries({ queryKey: ["roulette-results"] });
        refreshProfile();
      } else {
        setDemoHistory((h) => [{ id: crypto.randomUUID(), nickname: "Visitante (demo)", prize_name: prize!.name, created_at: new Date().toISOString() }, ...h].slice(0, 10));
      }
    }, 5200);
  }

  const history = [...demoHistory, ...(results.data ?? [])];

  return (
    <>
      <PageHeader eyebrow="Roleta" title="Arrisque sua Sorte" subtitle="Você confia na sua sorte?" />
      <Container className="py-14">
        <div className="mb-8 rounded-lg border border-warning/30 bg-warning/5 p-4 text-center text-sm text-muted-foreground">
          Modo demonstrativo: a roleta usa apenas <strong className="text-foreground">créditos virtuais</strong>. Nenhum dinheiro real é envolvido.
        </div>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,420px)]">
          <div className="order-2 lg:order-1">
            <SectionTitle title="Prêmios possíveis" />
            {prizes.isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2"><CardSkeletons count={4} className="h-24" /></div>
            ) : prizes.isError ? (
              <ErrorState />
            ) : !list.length ? (
              <EmptyState message="Nenhum prêmio configurado." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {list.map((p) => (
                  <div key={p.id} className="card-surface card-hover flex items-center gap-4 p-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg" style={{ background: prizeColorVar[p.color] }}>
                      {p.image_url ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" /> : <Gift className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{p.name}</p>
                      <div className="mt-1 flex items-center gap-2"><RarityBadge rarity={p.rarity} /><span className="text-xs text-muted-foreground">{Number(p.probability)}%</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="order-1 flex flex-col items-center gap-6 lg:order-2">
            {list.length > 0 ? <RouletteWheel prizes={list} rotation={rotation} spinning={spinning} /> : <CardSkeletons count={1} className="aspect-square w-full max-w-[420px] rounded-full" />}
            <Button variant="hero" size="lg" className="w-full max-w-xs" onClick={spin} disabled={spinning || !list.length}>
              {spinning ? "Girando..." : "Girar a roleta"}
            </Button>
            {session ? (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Coins className="h-4 w-4 text-gold" /> Saldo: {profile?.credits ?? 0} créditos · {cost} por giro</p>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Girando em modo visitante. <Link to="/registro" className="text-primary-glow hover:underline">Crie uma conta</Link> para registrar seus resultados.
              </p>
            )}
          </div>
        </div>

        <div className="mt-20">
          <SectionTitle title="Histórico de resultados" />
          {results.isLoading ? (
            <CardSkeletons count={1} className="h-40" />
          ) : history.length === 0 ? (
            <EmptyState message="Nenhum giro registrado ainda. Seja o primeiro!" />
          ) : (
            <div className="card-surface divide-y divide-border overflow-hidden">
              {history.map((h) => (
                <div key={h.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-4 py-3 text-sm sm:grid-cols-3 sm:px-6">
                  <span className="truncate font-semibold">{h.nickname}</span>
                  <span className="text-right text-primary-glow sm:text-left">{h.prize_name}</span>
                  <span className="col-span-2 text-xs text-muted-foreground sm:col-span-1 sm:text-right sm:text-sm">{new Date(h.created_at).toLocaleString("pt-BR")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>

      <Dialog open={!!won} onOpenChange={(o) => !o && setWon(null)}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-2xl">{won?.name === "Nada" ? "Não foi dessa vez!" : "Parabéns!"}</DialogTitle>
            <DialogDescription className="text-center">Resultado do seu giro</DialogDescription>
          </DialogHeader>
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-2xl shadow-glow" style={{ background: won ? prizeColorVar[won.color] : undefined }}>
            <Gift className="h-10 w-10" />
          </div>
          <p className="font-display text-xl font-bold">{won?.name}</p>
          <div className="flex justify-center"><RarityBadge rarity={won?.rarity} /></div>
          <Button variant="hero" onClick={() => setWon(null)}>Fechar</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
