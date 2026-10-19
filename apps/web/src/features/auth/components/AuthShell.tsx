import type { ReactNode } from "react";
import { BrandPanel } from "./BrandPanel";

/** The frame both auth pages and the signed-in page render inside. `min-h` rather than a fixed
 *  height: the register form is taller than the mockup's two fields and must never clip its footer. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-page font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-[1000px] min-h-[620px] grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] overflow-hidden rounded-[18px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.10)]">
        <BrandPanel />
        <div className="flex flex-col justify-center px-8 py-12 md:px-14">
          <div className="w-full max-w-[368px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
