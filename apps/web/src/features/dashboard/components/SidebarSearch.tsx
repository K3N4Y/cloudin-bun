import { MagnifyingGlass } from "@phosphor-icons/react";

export function SidebarSearch() {
  return (
    <div className="flex h-10 items-center gap-2.5 rounded-xl border border-line bg-white px-3 text-sm focus-within:border-[#d4d4d4] focus-within:ring-4 focus-within:ring-brand/10">
      <MagnifyingGlass size={16} aria-hidden="true" className="shrink-0 text-muted" />

      <input
        type="search"
        placeholder="Quick search..."
        aria-label="Quick search"
        className="min-w-0 flex-1 text-ink outline-none placeholder:text-muted"
      />

      <span aria-hidden="true" className="shrink-0 text-muted/70">
        Ctrl <span className="text-muted">K</span>
      </span>
    </div>
  );
}
