import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Skeleton } from "boneyard-js/react";
import { useState, useEffect } from "react";

export function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Simulate loading for boneyard demo
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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

      <Skeleton name="dashboard-stats" loading={loading} fixture={<StatsCards />}>
        {!loading && <StatsCards />}
      </Skeleton>
      <div className="mt-8" />
      <Skeleton name="dashboard-activity" loading={loading} fixture={<RecentActivity />}>
        {!loading && <RecentActivity />}
      </Skeleton>
    </div>
  );
}
