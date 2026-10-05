import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Auction, AuctionDisplayStatus, HowItWorksStep, RankingPeriod } from "./types";

async function unwrap<T>(p: PromiseLike<{ data: T; error: { message: string } | null }>): Promise<T> {
  const { data, error } = await p;
  if (error) throw new Error(error.message);
  return data as T;
}

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: () => unwrap(supabase.from("site_settings").select("*").eq("id", 1).single()),
  staleTime: 60_000,
});

export function howItWorks(v: unknown): HowItWorksStep[] {
  return Array.isArray(v) ? (v as HowItWorksStep[]) : [];
}

export const collaboratorsQuery = queryOptions({
  queryKey: ["collaborators"],
  queryFn: () =>
    unwrap(supabase.from("collaborators").select("*").eq("active", true).order("display_order")),
});

export const auctionsQuery = queryOptions({
  queryKey: ["auctions"],
  queryFn: () => unwrap(supabase.from("auctions").select("*").order("starts_at", { ascending: false })),
});

export const auctionQuery = (id: string) =>
  queryOptions({
    queryKey: ["auction", id],
    queryFn: async () => {
      const auction = await unwrap(supabase.from("auctions").select("*").eq("id", id).maybeSingle());
      const items = await unwrap(
        supabase.from("auction_items").select("*").eq("auction_id", id).order("display_order"),
      );
      return { auction, items: items ?? [] };
    },
  });

export const rankingQuery = (period: RankingPeriod) =>
  queryOptions({
    queryKey: ["ranking", period],
    queryFn: () =>
      unwrap(
        supabase.from("rankings").select("*").eq("period", period).order("total_spent", { ascending: false }),
      ),
  });

export const newsQuery = queryOptions({
  queryKey: ["news"],
  queryFn: () =>
    unwrap(supabase.from("news").select("*").eq("published", true).order("published_at", { ascending: false }).limit(6)),
});

export const prizesQuery = queryOptions({
  queryKey: ["prizes"],
  queryFn: () => unwrap(supabase.from("roulette_prizes").select("*").eq("active", true).order("display_order")),
});

export const resultsQuery = queryOptions({
  queryKey: ["roulette-results"],
  queryFn: () =>
    unwrap(supabase.from("roulette_results").select("*").order("created_at", { ascending: false }).limit(15)),
});

/** Status shown to visitors, derived from stored status + date. */
export function auctionStatus(a: Pick<Auction, "status" | "starts_at">): AuctionDisplayStatus {
  if (a.status === "ended") return "ended";
  if (a.status === "live") return "live";
  const d = new Date(a.starts_at);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "today";
  if (d < now) return "ended";
  return "soon";
}

export const statusLabel: Record<AuctionDisplayStatus, string> = {
  soon: "Em breve",
  today: "Hoje",
  live: "Ao vivo",
  ended: "Encerrado",
};

export function pickNextAuction(list: Auction[]) {
  const live = list.find((a) => auctionStatus(a) === "live");
  if (live) return live;
  return [...list]
    .filter((a) => ["soon", "today"].includes(auctionStatus(a)))
    .sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at))[0];
}

export const fmtDate = (d: string) => new Date(d).toLocaleDateString("pt-BR");
export const fmtTime = (d: string) =>
  new Date(d).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
export const fmtMoney = (n: number | null | undefined) =>
  (n ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Discord links are stored as configurable placeholders until real URLs are set. */
export function isRealUrl(url?: string | null) {
  return !!url && /^https?:\/\//i.test(url);
}
