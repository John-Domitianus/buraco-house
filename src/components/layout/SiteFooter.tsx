import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { BrandMark } from "./BrandMark";
import { mainNav } from "@/lib/nav";
import { isRealUrl, settingsQuery } from "@/lib/services";

export function SiteFooter() {
  const { data: s } = useQuery(settingsQuery);
  const name = s?.store_name ?? "Buraco House";
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <BrandMark name={name} />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            {s?.footer_tagline ?? "Uma plataforma criada para a comunidade de Cobblemon."}
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Navegação</h4>
          <ul className="grid gap-2 text-sm">
            {mainNav.map((n) => (
              <li key={n.to}><Link to={n.to} className="text-foreground/80 hover:text-primary-glow">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Comunidade</h4>
          <p className="text-sm text-muted-foreground">Dúvidas, negociações e anúncios acontecem no nosso Discord.</p>
          <button
            className="mt-3 text-sm font-semibold text-primary-glow hover:underline"
            onClick={() =>
              isRealUrl(s?.discord_server_url)
                ? window.open(s!.discord_server_url, "_blank", "noopener,noreferrer")
                : toast.info("Link do Discord ainda não configurado")
            }
          >
            Discord →
          </button>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
