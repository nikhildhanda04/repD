import { cn } from "@/lib/utils";

export function PixelLoader({ className, size = 16, color = "currentColor", ...props }) {
  // A simple 8-bit style dot matrix spinning animation
  // Uses 8 dots arranged in a square ring, lighting up one by one
  return (
    <div
      className={cn("relative grid grid-cols-3 grid-rows-3 gap-[2px]", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      {[0, 1, 2, 5, 8, 7, 6, 3].map((pos, i) => (
        <div
          key={i}
          className="bg-current rounded-sm opacity-20"
          style={{
            gridColumn: (pos % 3) + 1,
            gridRow: Math.floor(pos / 3) + 1,
            animation: `pixel-spin 0.8s infinite step-end`,
            animationDelay: `${i * 0.1}s`,
            backgroundColor: color,
          }}
        />
      ))}
      <style>{`
        @keyframes pixel-spin {
          0%, 100% { opacity: 1; }
          12.5% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
