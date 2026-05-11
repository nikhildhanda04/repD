import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const steps = [
  {
    number: "1",
    title: "Create a bot with BotFather",
    content: [
      "Open Telegram and search for @BotFather or visit t.me/BotFather",
      'Send the command /newbot',
      'BotFather will ask for a display name — type anything you want (e.g. "My Gym Tracker")',
      "Then it asks for a username — this must end in bot (e.g. my_gym_tracker_bot)",
      "BotFather replies with your bot token — a long string like 7123456789:AAH1bGci...",
    ],
    highlight: "Copy and save the bot token. You will need it below.",
  },
  {
    number: "2",
    title: "Create a group and add your bot",
    content: [
      "Create a new Telegram group (or use an existing one)",
      "Add your newly created bot to the group",
      'Send any message in the group (e.g. "hello")',
    ],
    highlight: "The bot must be in the group before you can get the chat ID.",
  },
  {
    number: "3",
    title: "Get your Chat ID",
    content: [
      "Open your browser and go to:",
    ],
    code: "https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates",
    afterCode: [
      'Replace <YOUR_TOKEN> with your actual bot token',
      'Look for "chat":{"id": -1001234567890, ...} in the JSON response',
      "The number (including the minus sign for groups) is your Chat ID",
    ],
    highlight: "Group chat IDs are negative numbers. Private chats use positive numbers.",
  },
  {
    number: "4",
    title: "Disable privacy mode (important)",
    content: [
      "Go back to @BotFather in Telegram",
      "Send /setprivacy",
      "Select your bot",
      'Choose "Disable"',
    ],
    highlight:
      "Without this, your bot can only see /commands — not regular messages like 'bench press 4x8 80kg'.",
  },
  {
    number: "5",
    title: "Connect below",
    content: [
      "Paste your bot token and chat ID in the form below",
      "We will verify both are valid before saving",
      "Once connected, you can start logging workouts in your Telegram chat",
    ],
    highlight: null,
  },
];

export function TelegramSetupGuide() {
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <Card key={step.number}>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {step.number}
              </div>
              <div className="space-y-3 flex-1 min-w-0">
                <h3 className="font-semibold text-lg leading-none">
                  {step.title}
                </h3>
                <ul className="space-y-1.5">
                  {step.content.map((line, j) => (
                    <li key={j} className="text-sm text-muted-foreground">
                      {line}
                    </li>
                  ))}
                </ul>
                {step.code && (
                  <code className="block text-xs bg-muted p-3 rounded-md font-mono break-all">
                    {step.code}
                  </code>
                )}
                {step.afterCode && (
                  <ul className="space-y-1.5">
                    {step.afterCode.map((line, j) => (
                      <li key={j} className="text-sm text-muted-foreground">
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
                {step.highlight && (
                  <div className="text-sm font-medium text-foreground bg-muted/50 rounded-md p-3 border border-border">
                    {step.highlight}
                  </div>
                )}
              </div>
            </div>
            {i < steps.length - 1 && <Separator className="mt-6" />}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
