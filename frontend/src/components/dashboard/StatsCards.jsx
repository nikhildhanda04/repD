import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Workouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">--</p>
          <p className="text-xs text-muted-foreground mt-1">Connect Telegram to start</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">--</p>
          <p className="text-xs text-muted-foreground mt-1">exercises logged</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Body Weight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">--</p>
          <p className="text-xs text-muted-foreground mt-1">latest check-in</p>
        </CardContent>
      </Card>
    </div>
  );
}
