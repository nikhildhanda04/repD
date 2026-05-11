import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { BodyWeightChart } from "@/components/dashboard/BodyWeightChart";
import { VolumeChart } from "@/components/dashboard/VolumeChart";
import { ExercisePieChart } from "@/components/dashboard/ExercisePieChart";
import { PRBoard } from "@/components/dashboard/PRBoard";
import { AICoach } from "@/components/dashboard/AICoach";
import { Skeleton } from "boneyard-js/react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { PixelLoader } from "@/components/ui/pixel-loader";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [weightData, setWeightData] = useState({ latest: null, history: [] });

  const fetchData = useCallback(async () => {
    try {
      const [workoutsRes, statsRes, weightRes] = await Promise.all([
        fetch(`${API_URL}/api/workouts`, { credentials: "include" }),
        fetch(`${API_URL}/api/workouts/stats`, { credentials: "include" }),
        fetch(`${API_URL}/api/workouts/bodyweight`, { credentials: "include" })
      ]);

      const [workoutsData, statsData, weightJson] = await Promise.all([
        workoutsRes.json(),
        statsRes.json(),
        weightRes.json()
      ]);

      if (workoutsData.success) setWorkouts(workoutsData.data.workouts);
      if (statsData.success) setStats(statsData.data);
      if (weightJson.success) setWeightData({ latest: weightJson.data.latest, history: weightJson.data.history });

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch(`${API_URL}/api/workouts/sync`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSyncStatus(`Synced ${data.data.syncedWorkouts} workouts`);
        fetchData(); // Refresh the data!
      } else {
        setSyncStatus(data.message || "Sync failed");
      }
    } catch {
      setSyncStatus("Failed to connect");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            Your workout overview and progress.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {syncStatus && (
            <span className="text-sm font-medium text-green-600">
              {syncStatus}
            </span>
          )}
          <Button 
            onClick={handleSync} 
            disabled={isSyncing}
            variant="outline"
            className="gap-2 cursor-pointer"
          >
            {isSyncing ? <PixelLoader size={16} /> : <RefreshCw className="h-4 w-4" />}
            Sync Telegram
          </Button>
        </div>
      </div>

      <Separator className="mb-8" />

      <Skeleton name="dashboard-stats" loading={loading} fixture={<StatsCards />}>
        {!loading && <StatsCards stats={stats} latestWeight={weightData.latest} />}
      </Skeleton>
      
      <div className="mt-8">
        <Skeleton name="dashboard-ai-coach" loading={loading} fixture={<AICoach />}>
          {!loading && <AICoach />}
        </Skeleton>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Skeleton name="dashboard-volume" loading={loading} fixture={<VolumeChart />}>
          {!loading && <VolumeChart workouts={workouts} />}
        </Skeleton>
        <Skeleton name="dashboard-pie" loading={loading} fixture={<ExercisePieChart />}>
          {!loading && <ExercisePieChart stats={stats} />}
        </Skeleton>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Skeleton name="dashboard-activity" loading={loading} fixture={<RecentActivity />}>
          {!loading && <RecentActivity workouts={workouts} />}
        </Skeleton>
        <Skeleton name="dashboard-prs" loading={loading} fixture={<PRBoard />}>
          {!loading && <PRBoard personalRecords={stats?.personalRecords} />}
        </Skeleton>
      </div>

      <div className="mt-8">
        <Skeleton name="dashboard-weight-chart" loading={loading} fixture={<BodyWeightChart />}>
          {!loading && <BodyWeightChart data={weightData.history} />}
        </Skeleton>
      </div>
    </div>
  );
}
