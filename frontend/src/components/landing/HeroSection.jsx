import { LoginDialog } from "@/components/auth/LoginDialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center pt-32 pb-44 sm:pt-40 sm:pb-52">
      <div className="flex items-center gap-1.5 mb-10">
        <div className="grid grid-cols-2 gap-1">
          <div className="h-3 w-3 rounded-full bg-foreground" />
          <div className="h-3 w-3 rounded-full bg-foreground" />
          <div className="h-3 w-3 rounded-full bg-foreground" />
          <div className="h-3 w-3 rounded-full bg-foreground" />
        </div>
      </div>

      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]">
        Log, track, and grow
        <br />
        <span className="text-muted-foreground">all from Telegram</span>
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
