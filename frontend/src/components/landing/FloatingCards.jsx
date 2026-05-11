import { TelegramChatCard } from "./TelegramChatCard";
import { WeeklySummaryCard } from "./WeeklySummaryCard";
import { ProgressCard } from "./ProgressCard";
import { AIInsightsCard } from "./AIInsightsCard";

export function FloatingCards() {
  return (
    <>
      <TelegramChatCard />
      <WeeklySummaryCard />
      <ProgressCard />
      <AIInsightsCard />
    </>
  );
}
