import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";

export function VolumeChart({ workouts }) {
  if (!workouts || workouts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Volume Progression</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No volume data yet.</p>
        </CardContent>
      </Card>
    );
  }

  // Aggregate volume by date
  const volumeByDate = {};
  workouts.forEach(w => {
    const dateStr = format(parseISO(w.loggedAt), "MMM d");
    if (!volumeByDate[dateStr]) {
      volumeByDate[dateStr] = 0;
    }
    const weight = w.weight || 0;
    volumeByDate[dateStr] += (w.sets * w.reps * weight);
  });

  // Convert to array and take last 14 days, sort chronologically
  const chartData = Object.keys(volumeByDate)
    .map(date => ({ date, volume: volumeByDate[date] }))
    .reverse()
    .slice(-14);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume Progression</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
            <Tooltip 
              cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#a855f7', fontWeight: 600 }}
              formatter={(value) => [`${value} kg`, 'Total Volume']}
            />
            <Bar dataKey="volume" fill="#a855f7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
