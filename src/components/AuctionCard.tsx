import { Link } from "@tanstack/react-router";
import { CalendarDays, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common";
import { auctionStatus, fmtDate, fmtTime } from "@/lib/services";
import type { Auction } from "@/lib/types";

export function AuctionCard({ auction }: { auction: Auction }) {
  return (
    <div className="card-surface card-hover flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 font-display text-lg font-semibold">{auction.name}</h3>
        <StatusBadge status={auctionStatus(auction)} />
      </div>
      <div className="grid gap-1.5 text-sm text-muted-foreground">
        <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 shrink-0" /> {fmtDate(auction.starts_at)}</span>
        <span className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" /> {fmtTime(auction.starts_at)}</span>
        {auction.responsible && <span className="flex items-center gap-2"><User className="h-4 w-4 shrink-0" /> {auction.responsible}</span>}
      </div>
      <Button asChild variant="outline" className="mt-auto">
        <Link to="/leiloes/$id" params={{ id: auction.id }}>Ver detalhes</Link>
      </Button>
    </div>
  );
}
