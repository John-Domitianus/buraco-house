export function BrandMark({ name }: { name: string }) {
  const [first, ...rest] = name.split(" ");
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary shadow-glow">
        <span className="h-4 w-4 rounded-full border-[3px] border-primary-foreground" />
        <span className="absolute inset-x-1.5 top-1/2 h-[3px] -translate-y-1/2 bg-primary-foreground/90" />
      </span>
      <span className="truncate font-display text-lg font-extrabold uppercase tracking-tight">
        {first}
        {rest.length > 0 && <span className="text-gradient"> {rest.join(" ")}</span>}
      </span>
    </span>
  );
}
