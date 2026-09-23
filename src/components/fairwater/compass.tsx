type Props = {
  deg: number | null;
  label: string;
  value: string;
  hint: string;
};

export function Compass({ deg, label, value, hint }: Props) {
  const rot = deg ?? 0;
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 48 48" className="size-12 shrink-0" aria-hidden="true">
        <circle cx="24" cy="24" r="17" fill="none" className="stroke-line" strokeWidth="1.5" />
        {deg != null ? (
          <path d="M24 9.5 L27.2 24 L24 21.2 L20.8 24 Z" className="fill-accent" transform={`rotate(${rot} 24 24)`} />
        ) : null}
        <circle cx="24" cy="24" r="1.6" className="fill-fg" />
      </svg>
      <div className="min-w-0">
        <div className="text-xs font-medium tracking-wide text-subtle uppercase">{label}</div>
        <div className="truncate text-base font-medium tabular-nums text-fg">{value}</div>
        <div className="truncate text-sm text-muted">{hint}</div>
      </div>
    </div>
  );
}
