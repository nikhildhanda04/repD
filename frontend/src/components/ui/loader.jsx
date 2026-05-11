import { cn } from "@/lib/utils";

export function Loader({ className, size = 24, ...props }) {
  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        className="animate-spin text-muted-foreground/30"
        viewBox="0 0 50 50"
        style={{ width: size, height: size }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
      </svg>
      <svg
        className="absolute inset-0 animate-spin text-primary"
        viewBox="0 0 50 50"
        style={{
          width: size,
          height: size,
          animationDuration: "1.5s",
          strokeDasharray: "90, 150",
          strokeDashoffset: 0,
        }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
