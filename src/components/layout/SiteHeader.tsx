import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Menu, X, LogIn, UserPlus, LogOut, Shield, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscordButton } from "@/components/common";
import { BrandMark } from "./BrandMark";
import { mainNav } from "@/lib/nav";
import { settingsQuery } from "@/lib/services";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: settings } = useQuery(settingsQuery);
  const { session, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function handleSignOut() {
    await signOut();
    qc.invalidateQueries();
    setOpen(false);
    navigate({ to: "/", replace: true });
  }

  const linkCls =
    "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
  const activeCls = "bg-accent text-foreground";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="min-w-0" onClick={() => setOpen(false)}>
          <BrandMark name={settings?.store_name ?? "Buraco House"} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} activeProps={{ className: activeCls }} activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <DiscordButton url={settings?.discord_server_url} size="sm">Discord</DiscordButton>
          {session ? (
            <>
              <span className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground">
                <Coins className="h-3.5 w-3.5 text-gold" /> {profile?.credits ?? 0}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}><LogOut /> Sair</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/login"><LogIn /> Login</Link></Button>
              <Button asChild variant="hero" size="sm"><Link to="/registro"><UserPlus /> Registrar</Link></Button>
            </>
          )}
        </div>

        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu" onClick={() => setOpen((v) => !v)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      <div className={cn("border-t border-border bg-surface lg:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
          {mainNav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={cn(linkCls, "py-3 text-base")} activeProps={{ className: activeCls }} activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
          <div className="mt-3 grid gap-2 border-t border-border pt-4">
            <DiscordButton url={settings?.discord_server_url} className="w-full">Discord</DiscordButton>
            {session ? (
              <>><Shield /> Painel admin</Link></Button>
                )}
                <Button variant="ghost" className="w-full" onClick={handleSignOut}><LogOut /> Sair ({profile?.nickname})</Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline"><Link to="/login" onClick={() => setOpen(false)}>Login</Link></Button>
                <Button asChild variant="hero"><Link to="/registro" onClick={() => setOpen(false)}>Registrar</Link></Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
