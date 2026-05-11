import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ['#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4'];

export function ExercisePieChart({ stats }) {
  if (!stats || !stats.exercises || Object.keys(stats.exercises).length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Exercise Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No exercises logged yet.</p>
        </CardContent>
      </Card>
    );
  }

  // Convert exercises map to array and sort by sessions
  const chartData = Object.values(stats.exercises)
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 5) // Take top 5
    .map(e => ({
      name: e.exercise.charAt(0).toUpperCase() + e.exercise.slice(1),
      value: e.sessions
    }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Exercises</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              itemStyle={{ fontWeight: 600 }}
              formatter={(value) => [`${value} sessions`, 'Count']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {chartData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-xs text-muted-foreground">{entry.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
