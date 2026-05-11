import { LoginDialog } from "@/components/auth/LoginDialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center pt-32 pb-44 sm:pt-40 sm:pb-52">
      <div className="flex items-center gap-1.5 mb-10">
        <div className="grid bg-neutral-800 p-3 rounded-xl grid-cols-2 gap-2 shadow-[inset_0_3px_0_0_rgba(255,255,255,0.25),inset_0_-4px_8px_0_rgba(0,0,0,0.9),0_8px_20px_-4px_rgba(0,0,0,0.5),0_4px_8px_-2px_rgba(0,0,0,0.4)]">
          <div className="h-5 w-5 rounded-full bg-white" />
          <div className="h-5 w-5 rounded-full bg-white" />
          <div className="h-5 w-5 rounded-full bg-white" />
          <div className="h-5 w-5 rounded-full bg-white" />
        </div>
      </div>

      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]">
        Log, track, and grow
        <br />
        <span className="text-muted-foreground">all from <span className="text-blue-400">Telegram</span> </span>
      </h1>

      <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
        Send your workouts in a Telegram chat. Get automatic tracking,
        progress analytics, and AI-powered coaching.
      </p>

      <div className="mt-10">
        <LoginDialog
          trigger={
            <Button
              size="lg"
              className="h-12 px-8 gap-2 cursor-pointer"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          }
        />
      </div>
    </div>
  );
}
