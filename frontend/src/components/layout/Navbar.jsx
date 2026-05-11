import { useAuth } from "@/hooks/useAuth";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { UserMenu } from "@/components/auth/UserMenu";
import { Link } from "react-router-dom";

export function Navbar() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="h-2 w-2 rounded-full bg-foreground" />
            <div className="h-2 w-2 rounded-full bg-foreground" />
            <div className="h-2 w-2 rounded-full bg-foreground" />
            <div className="h-2 w-2 rounded-full bg-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">repD</span>
        </Link>
        <nav className="flex items-center gap-4">
          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/telegram"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Telegram
              </Link>
              <UserMenu />
            </>
          ) : (
            <LoginDialog />
          )}
        </nav>
      </div>
    </header>
  );
}
