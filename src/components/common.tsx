import type { ReactNode } from "react";
import { toast } from "sonner";
import { MessageCircle, Inbox, AlertTriangle } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { isRealUrl, statusLabel } from "@/lib/services";
import type { AuctionDisplayStatus } from "@/lib/types";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</div>;
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <Container className="relative py-14 sm:py-20 text-center animate-fade-up">
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary-glow">{eyebrow}</p>}
        <h1 className="text-3xl font-bold sm:text-5xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </Container>
    </section>
  );
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ message, icon }: { message: string; icon?: ReactNode }) {
  return (
    <div className="card-surface flex flex-col items-center gap-3 px-6 py-12 text-center text-muted-foreground">
      {icon ?? <Inbox className="h-8 w-8 text-primary-glow" />}
      <p>{message}</p>
    </div>
  );
}

export function ErrorState({ message = "Não foi possível carregar os dados." }: { message?: string }) {
  return (
    <div className="card-surface flex flex-col items-center gap-3 border-destructive/40 px-6 py-10 text-center">
      <AlertTriangle className="h-7 w-7 text-destructive" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export function CardSkeletons({ count = 3, className = "h-48" }: { count?: number; className?: string }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn("rounded-xl bg-muted", className)} />
      ))}
    </>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warning">
      Exemplo
    </span>
  );
}

/** Opens a configurable Discord link, or warns when it's still a placeholder. */
export function DiscordButton({
  url,
  children = "Entrar no Discord",
  ...props
}: { url?: string | null | undefined; children?: ReactNode } & Omit<ButtonProps, "onClick">) {
  return (
    <Button
      variant="discord"
      {...props}
      onClick={() => {
        if (isRealUrl(url)) window.open(url!, "_blank", "noopener,noreferrer");
        else toast.info("Link do Discord ainda não configurado", { description: "O administrador pode definir em Configurações." });
      }}
    >
      <MessageCircle /> {children}
    </Button>
  );
}

const statusStyle: Record<AuctionDisplayStatus, string> = {
  soon: "border-primary/40 bg-primary/10 text-primary-glow",
  today: "border-warning/40 bg-warning/10 text-warning",
  live: "border-live/50 bg-live/15 text-live animate-pulse-live",
  ended: "border-border bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: AuctionDisplayStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", statusStyle[status])}>
      {status === "live" && <span className="h-1.5 w-1.5 rounded-full bg-live" />}
      {statusLabel[status]}
    </span>
  );
}

export function Avatar({ src, name, className }: { src?: string | null; name: string; className?: string }) {
  return src ? (
    <img src={src} alt={name} className={cn("shrink-0 rounded-full object-cover", className)} />
  ) : (
    <div className={cn("grid shrink-0 place-items-center rounded-full bg-gradient-primary font-display font-bold text-primary-foreground", className)}>
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

export const rarityStyle = (r?: string | null) => {
  const k = (r ?? "").toLowerCase();
  if (k.includes("mít") || k.includes("mit")) return "text-live border-live/40 bg-live/10";
  if (k.includes("lend")) return "text-gold border-gold/40 bg-gold/10";
  if (k.includes("ép") || k.includes("ep")) return "text-primary-glow border-primary/40 bg-primary/10";
  if (k.includes("rar")) return "text-success border-success/40 bg-success/10";
  return "text-muted-foreground border-border bg-muted";
};

export function RarityBadge({ rarity }: { rarity?: string | null }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold", rarityStyle(rarity))}>
      {rarity}
    </span>
  );
}
