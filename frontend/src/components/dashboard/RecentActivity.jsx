import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow, parseISO } from "date-fns";

export function RecentActivity({ workouts }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {!workouts || workouts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No workouts yet. Set up your Telegram bot and start logging.
          </p>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {workouts.slice(0, 10).map((workout) => (
              <div
                key={workout.id}
                className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium capitalize text-sm">{workout.exercise}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {workout.sets} sets × {workout.reps} reps {workout.weight ? `@ ${workout.weight}${workout.unit}` : ""}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(parseISO(workout.loggedAt), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
