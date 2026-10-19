import { Bird } from "@phosphor-icons/react";

export function BrandPanel() {
  return (
    <div className="brand-panel relative hidden md:block">
      <div className="absolute left-8 top-8 flex items-center gap-2">
        <Bird weight="fill" size={18} className="text-ink" />
        <span className="text-[15px] font-medium text-ink">kenni</span>
      </div>

      <div className="absolute bottom-10 left-10 right-10">
        <p className="text-[13px] text-muted">Your team of agents</p>
        <h2 className="mt-2 max-w-[330px] text-[28px] font-semibold leading-[1.2] tracking-[-0.01em] text-ink">
          Autonomous coding agents that ship in the cloud, while you stay in flow.
        </h2>
      </div>
    </div>
  );
}
