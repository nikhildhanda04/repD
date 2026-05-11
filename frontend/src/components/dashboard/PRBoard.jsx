import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export function PRBoard({ personalRecords }) {
  if (!personalRecords || personalRecords.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            PR Board
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No personal records yet.</p>
        </CardContent>
      </Card>
    );
  }

  // Sort by max weight descending
  const sortedPRs = [...personalRecords].sort((a, b) => b.maxWeight - a.maxWeight);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          PR Board
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedPRs.slice(0, 6).map((pr, i) => (
            <div key={pr.exercise} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {i + 1}
                </span>
                <span className="font-medium capitalize text-sm">{pr.exercise}</span>
              </div>
              <span className="font-bold text-primary">
                {pr.maxWeight} <span className="text-xs text-muted-foreground font-normal">{pr.unit || 'kg'}</span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
