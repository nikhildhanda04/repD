import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { PixelLoader } from "@/components/ui/pixel-loader";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function AICoach() {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch(`${API_URL}/api/workouts/insights`, { credentials: "include" });
        const data = await res.json();
        if (data.success && data.data.insights) {
          setInsight(data.data.insights);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("AI Coach error:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, []);

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 via-background to-background border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-purple-500" />
          AI Coach Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <PixelLoader size={24} color="#a855f7" />
            <p className="text-sm text-muted-foreground animate-pulse">Analyzing your workouts...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <p>Your AI Coach needs more data to analyze. Keep logging workouts!</p>
          </div>
        ) : (
          <div className="relative rounded-2xl bg-muted/50 p-4 pl-12 text-sm leading-relaxed border border-border/50 shadow-sm">
            <Sparkles className="absolute left-4 top-4 h-5 w-5 text-purple-500" />
            <div 
              className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1" 
              dangerouslySetInnerHTML={{ __html: insight.replace(/\n/g, '<br/>') }} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
