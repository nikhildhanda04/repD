export function ProgressCard() {
  return (
    <div
      className="absolute -left-20 -bottom-8 hidden lg:block animate-float-slower"
      style={{ transform: "rotate(-4deg)" }}
    >
      <div className="relative">
        <div className="w-80 rounded-3xl bg-white/90 backdrop-blur-sm border border-border/30 shadow-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border/20 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Bench Press</p>
              <p className="text-[11px] text-muted-foreground">Progress over 8 weeks</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">85 kg</p>
              <p className="text-[10px] text-green-600 font-medium">+15 kg</p>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-end gap-1.5 h-28">
              {[35, 40, 42, 50, 48, 58, 55, 65, 62, 72, 70, 80, 78, 88, 85, 95].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm transition-colors ${
                    i >= 14 ? "bg-foreground" : i >= 10 ? "bg-foreground/60" : "bg-foreground/20"
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-[10px] text-muted-foreground">8 weeks ago</span>
              <span className="text-[10px] font-medium text-foreground">This week</span>
            </div>
          </div>
        </div>

        <div className="absolute -top-4 right-6 px-3 py-1.5 rounded-full bg-foreground text-background text-xs font-bold shadow-lg z-10">
          PR: 85 kg
        </div>
      </div>
    </div>
  );
}
