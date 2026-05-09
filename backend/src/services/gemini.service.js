import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getWorkoutInsights(workouts, stats) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const workoutSummary = Object.entries(stats.exercises)
    .map(([name, s]) => {
      const history = s.history
        .slice(-10)
        .map((h) => `${h.date}: ${h.sets}x${h.reps} ${h.weight || "BW"}${h.weight ? s.unit : ""}`)
        .join(", ");
      return `${name}: PR ${s.maxWeight || "BW"}${s.maxWeight ? s.unit : ""} | Sessions: ${s.sessions} | Recent: ${history}`;
    })
    .join("\n");

  const prompt = `You are a professional fitness coach. Analyze this workout data and give actionable advice.

Workout Summary (last 30 days):
Total sessions: ${stats.totalSessions}
Unique exercises: ${stats.uniqueExercises}
Days active: ${stats.activeDays}

Exercise Breakdown:
${workoutSummary}

Respond in JSON only with this structure:
{
  "overview": "2-3 sentence assessment",
  "strengths": ["strength1", "strength2"],
  "improvements": ["area1", "area2"],
  "suggestions": ["specific actionable tip 1", "tip 2", "tip 3"],
  "weeklyPlan": "brief suggestion for weekly split"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}
