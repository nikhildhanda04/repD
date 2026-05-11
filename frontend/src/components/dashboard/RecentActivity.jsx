import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentActivity() {
  return (
    <div className="mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No workouts yet. Set up your Telegram bot and start logging.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
