export function TelegramChatCard() {
  return (
    <div
      className="absolute -left-28 top-12 hidden lg:block animate-float-slow"
      style={{ transform: "rotate(-8deg)" }}
    >
      <div className="relative">
        <div className="absolute -top-6 -left-6 h-16 w-16 rounded-2xl bg-white border border-border/40 shadow-xl flex items-center justify-center z-10">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-blue-500" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
        </div>

        <div className="w-80 rounded-3xl bg-white/90 backdrop-blur-sm border border-border/30 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-400/5 px-5 py-3 border-b border-border/20">
            <p className="text-sm font-semibold text-foreground">Gym Log</p>
            <p className="text-[11px] text-muted-foreground">3 members</p>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex gap-2.5">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-blue-600">N</span>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">You</p>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-tl-md px-3.5 py-2">
                  <p className="text-sm font-mono font-medium">bench press 4x8 80kg</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-blue-600">N</span>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">You</p>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-tl-md px-3.5 py-2">
                  <p className="text-sm font-mono font-medium">squat 5x5 100kg</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-green-600">B</span>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">repD Bot</p>
                <div className="bg-muted/60 border border-border/40 rounded-2xl rounded-tl-md px-3.5 py-2">
                  <p className="text-sm text-green-700 font-medium">Logged 2 exercises.</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Total volume: 3,840 kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-3 -right-4 w-48 rounded-2xl bg-white/80 backdrop-blur border border-border/30 shadow-xl p-3 z-10">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs font-medium text-green-700">Synced just now</p>
          </div>
        </div>
      </div>
    </div>
  );
}
