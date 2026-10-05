/**
 * Main navigation. Future pages (Suporte, Builder, Construções, Eventos)
 * can be added here once their route files exist.
 */
export const mainNav = [
  { to: "/", label: "Início" },
  { to: "/colaboradores", label: "Colaboradores" },
  { to: "/leiloes", label: "Leilões" },
  { to: "/ranking", label: "Ranking" },
  { to: "/arrisque-sua-sorte", label: "Arrisque sua Sorte" },
] as const;
