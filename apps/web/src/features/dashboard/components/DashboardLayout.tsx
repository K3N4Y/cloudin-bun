import type { ReactNode } from "react";

import { SidebarNav } from "./SidebarNav";
import { SidebarSearch } from "./SidebarSearch";

export function DashboardLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface font-sans">
      <aside aria-label="Sidebar" className="w-[248px] shrink-0 border-r border-edge p-3">
        <SidebarSearch />
        <SidebarNav />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header aria-label="Topbar" className="h-16 shrink-0 border-b border-edge" />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
