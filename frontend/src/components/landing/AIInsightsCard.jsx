export function AIInsightsCard() {
  return (
    <div
      className="absolute -right-24 -bottom-4 hidden lg:block animate-float-slow"
      style={{ transform: "rotate(5deg)" }}
    >
      <div className="relative">
        <div className="absolute -top-6 -right-3 h-14 w-14 rounded-2xl bg-white border border-border/40 shadow-xl flex items-center justify-center z-10">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-purple-500" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
            <circle cx="12" cy="12" r="4" />
            <path d="M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
          </svg>
        </div>

        <div className="w-72 rounded-3xl bg-white/90 backdrop-blur-sm border border-border/30 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500/10 to-violet-400/5 px-5 py-3 border-b border-border/20">
            <p className="text-sm font-semibold text-foreground">AI Coach</p>
            <p className="text-[11px] text-muted-foreground">Powered by Gemini</p>
          </div>

          <div className="p-5 space-y-3">
            <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3">
              <p className="text-xs font-medium text-purple-900 mb-1">Progressive Overload</p>
              <p className="text-[11px] text-purple-700 leading-relaxed">
                Your bench press has been at 80kg for 3 sessions. Try increasing to 82.5kg next workout.
              </p>
            </div>
            <div className="bg-muted/40 border border-border/30 rounded-xl p-3">
              <p className="text-xs font-medium text-foreground mb-1">Muscle Balance</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Push/pull ratio is 1.8:1. Add more rows and pull ups to balance.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-3 left-6 w-56 h-10 rounded-2xl bg-white/60 backdrop-blur border border-border/20 shadow-lg -z-10" />
      </div>
    </div>
  );
}
