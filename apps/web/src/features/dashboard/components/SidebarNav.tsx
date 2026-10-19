import { useState } from "react";

import { ChatCircle, Tray, type Icon } from "@phosphor-icons/react";

type SidebarNavId = "new-chat" | "inbox";

type SidebarNavItem = { id: SidebarNavId; label: string; icon: Icon };

const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { id: "new-chat", label: "New chat", icon: ChatCircle },
  { id: "inbox", label: "Inbox", icon: Tray },
];

export function SidebarNav() {
  const [selected, setSelected] = useState<SidebarNavId | null>(null);

  return (
    <nav aria-label="Sidebar navigation" className="mt-4 flex flex-col gap-0.5">
      {SIDEBAR_NAV_ITEMS.map(({ id, label, icon: RowIcon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={selected === id}
          onClick={() => setSelected(id)}
          className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[15px] text-[#3f3f3f] transition-colors hover:bg-[#f3f3f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4d4d4] focus-visible:ring-inset aria-pressed:bg-[#f3f3f3]"
        >
          <RowIcon size={18} aria-hidden="true" className="shrink-0 text-[#9a9a9a]" />
          <span className="min-w-0 truncate">{label}</span>
        </button>
      ))}
    </nav>
  );
}
