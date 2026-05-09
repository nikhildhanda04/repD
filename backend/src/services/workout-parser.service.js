const WORKOUT_PATTERNS = [
  /^(.+?)\s+(\d+)\s*[xX×*]\s*(\d+)\s+(\d+(?:\.\d+)?)\s*(kg|kgs|lbs|lb)$/i,
  /^(.+?)\s+(\d+)\s*[xX×*]\s*(\d+)\s+(\d+(?:\.\d+)?)$/i,
  /^(.+?)\s+(\d+)\s*[xX×*]\s*(\d+)$/i,
];

const EXERCISE_ALIASES = {
  bp: "bench press",
  bench: "bench press",
  benchpress: "bench press",
  sq: "squat",
  squats: "squat",
  dl: "deadlift",
  deadlifts: "deadlift",
  ohp: "overhead press",
  pullup: "pull ups",
  pullups: "pull ups",
  chinup: "chin ups",
  chinups: "chin ups",
  curls: "bicep curls",
  rdl: "romanian deadlift",
  shrug: "shrugs",
  lunge: "lunges",
  crunch: "crunches",
};

const VALID_EXERCISES = new Set([
  "bench press",
  "incline bench press",
  "decline bench press",
  "dumbbell press",
  "dumbbell bench press",
  "squat",
  "front squat",
  "hack squat",
  "goblet squat",
  "bulgarian split squat",
  "deadlift",
  "romanian deadlift",
  "sumo deadlift",
  "trap bar deadlift",
  "overhead press",
  "push press",
  "barbell row",
  "dumbbell row",
  "cable row",
  "seated row",
  "t-bar row",
  "pendlay row",
  "pull ups",
  "chin ups",
  "lat pulldown",
  "bicep curls",
  "hammer curls",
  "preacher curls",
  "concentration curls",
  "tricep pushdown",
  "skull crushers",
  "tricep extension",
  "dips",
  "leg press",
  "leg curls",
  "leg extensions",
  "calf raises",
  "seated calf raises",
  "lateral raises",
  "front raises",
  "rear delt fly",
  "face pulls",
  "chest fly",
  "cable fly",
  "pec deck",
  "hip thrusts",
  "lunges",
  "walking lunges",
  "reverse lunges",
  "step ups",
  "shrugs",
  "plank",
  "crunches",
  "sit ups",
  "russian twist",
  "ab wheel",
  "farmer walk",
  "kettlebell swing",
  "power clean",
  "clean and jerk",
  "snatch",
  "muscle ups",
  "cable crossover",
  "good morning",
]);

function normalizeExercise(raw) {
  const lower = raw.trim().toLowerCase();
  return EXERCISE_ALIASES[lower] || lower;
}

function normalizeUnit(raw) {
  if (!raw) return "kg";
  const u = raw.toLowerCase();
  if (u === "lb" || u === "lbs") return "lbs";
  return "kg";
}

export function parseWorkoutMessage(text) {
  if (!text || typeof text !== "string") return null;
  const trimmed = text.trim();

  for (const pattern of WORKOUT_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      const exercise = normalizeExercise(match[1]);

      if (!VALID_EXERCISES.has(exercise)) {
        return {
          error: "unknown_exercise",
          exercise,
          raw: trimmed,
        };
      }

      return {
        exercise,
        sets: parseInt(match[2]),
        reps: parseInt(match[3]),
        weight: match[4] ? parseFloat(match[4]) : null,
        unit: normalizeUnit(match[5] || null),
      };
    }
  }

  return null;
}

export function parseBodyWeight(text) {
  if (!text || typeof text !== "string") return null;
  const trimmed = text.trim();

  const explicit = trimmed.match(
    /^(?:bw|body\s*weight|weight)\s+(\d+(?:\.\d+)?)\s*(kg|kgs|lbs|lb)?$/i
  );
  if (explicit) {
    return { weight: parseFloat(explicit[1]), unit: normalizeUnit(explicit[2]) };
  }

  const standalone = trimmed.match(/^(\d{2,3}(?:\.\d+)?)\s*(kg|kgs|lbs|lb)$/i);
  if (standalone) {
    const w = parseFloat(standalone[1]);
    if (w >= 30 && w <= 300) {
      return { weight: w, unit: normalizeUnit(standalone[2]) };
    }
  }

  return null;
}

export function getExerciseList() {
  return [...VALID_EXERCISES].sort();
}
