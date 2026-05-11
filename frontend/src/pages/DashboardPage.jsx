import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Your workout overview and progress.
        </p>
      </div>

      <Separator className="mb-8" />

      <StatsCards />
      <RecentActivity />
    </div>
  );
}
