import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCards({ stats, latestWeight }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Workouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats?.totalWorkouts || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">all time logged</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats?.activeDays || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">unique days trained (last 30d)</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Body Weight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {latestWeight ? `${latestWeight.weight} ${latestWeight.unit}` : "--"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">latest check-in</p>
        </CardContent>
      </Card>
    </div>
  );
}
