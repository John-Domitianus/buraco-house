import logo from "@/assets/logo.png";

export function BrandMark({ name }: { name: string }) {
  const [first, ...rest] = name.split(" ");
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <img
        src={logo}
        alt={`Logo ${name}`}
        width={1024}
        height={1024}
        className="h-10 w-10 shrink-0 object-contain drop-shadow-[0_2px_10px_color-mix(in_oklab,var(--primary)_40%,transparent)]"
      />
      <span className="truncate font-display text-lg font-extrabold uppercase tracking-tight">
        {first}
        {rest.length > 0 && <span className="text-gradient"> {rest.join(" ")}</span>}
      </span>
    </span>
  );
}
