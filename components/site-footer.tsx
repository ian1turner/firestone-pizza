export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[var(--charcoal-deep)] text-stone-400">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="max-w-xl leading-relaxed text-stone-400">
          Kitchen orders only — no payment. Beer tokens are accepted.
        </p>
        <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
          Made for the table
        </p>
      </div>
    </footer>
  );
}
