import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
export type Row<T extends keyof Tables> = Tables[T]["Row"];

export type SiteSettings = Row<"site_settings">;
export type Collaborator = Row<"collaborators">;
export type Auction = Row<"auctions">;
export type AuctionItem = Row<"auction_items">;
export type RankingEntry = Row<"rankings">;
export type NewsItem = Row<"news">;
export type RoulettePrize = Row<"roulette_prizes">;
export type RouletteResult = Row<"roulette_results">;
export type Profile = Row<"profiles">;

export type HowItWorksStep = { title: string; description: string };
export type RankingPeriod = "month" | "quarter" | "total";
export type AuctionDisplayStatus = "soon" | "today" | "live" | "ended";
