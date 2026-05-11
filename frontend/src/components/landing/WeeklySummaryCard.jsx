export function WeeklySummaryCard() {
  return (
    <div
      className="absolute -right-32 top-8 hidden lg:block animate-float-slower"
      style={{ transform: "rotate(6deg)" }}
    >
      <div className="relative">
        <div className="absolute -top-5 -left-5 h-14 w-14 rounded-2xl bg-white border border-border/40 shadow-xl flex items-center justify-center z-10">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
          </svg>
        </div>

        <div className="w-80 rounded-3xl bg-white/90 backdrop-blur-sm border border-border/30 shadow-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border/20">
            <p className="text-sm font-semibold text-foreground">Weekly Summary</p>
            <p className="text-[11px] text-muted-foreground">May 5 - May 11</p>
          </div>

          <div className="px-5 py-3 flex gap-1 border-b border-border/10">
            <span className="text-xs font-medium bg-foreground text-background px-3 py-1 rounded-full">Weekly</span>
            <span className="text-xs font-medium text-muted-foreground px-3 py-1 rounded-full">Monthly</span>
            <span className="text-xs font-medium text-muted-foreground px-3 py-1 rounded-full">All Time</span>
          </div>

          <div className="p-5 space-y-3.5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Workouts</span>
              <span className="text-lg font-bold">5</span>
            </div>
            <div className="w-full h-px bg-border/40" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Volume</span>
              <span className="text-lg font-bold">12,450 kg</span>
            </div>
            <div className="w-full h-px bg-border/40" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">New PRs</span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-green-600">+2</span>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">UP 12%</span>
              </div>
            </div>
            <div className="w-full h-px bg-border/40" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Body Weight</span>
              <span className="text-lg font-bold">78.5 kg</span>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-4 left-8 w-64 h-12 rounded-2xl bg-white/60 backdrop-blur border border-border/20 shadow-lg -z-10" />
      </div>
    </div>
  );
}
