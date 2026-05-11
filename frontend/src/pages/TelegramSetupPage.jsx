import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TelegramSetupGuide } from "@/components/telegram/TelegramSetupGuide";
import { TelegramConnectForm } from "@/components/telegram/TelegramConnectForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function TelegramSetupPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const res = await fetch(`${API_URL}/api/telegram/config`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setConfig(data.data);
    } catch {
      // not connected
    } finally {
      setLoading(false);
    }
  }

  function handleConnected(newConfig) {
    setConfig(newConfig);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="space-y-2 mb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Telegram Setup</h1>
          {config && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              Connected
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Connect your Telegram bot to start logging workouts from chat.
        </p>
      </div>

      <Separator className="my-6" />

      {config && (
        <div className="mb-8 space-y-6">
          <TelegramConnectForm
            existingConfig={config}
            onConnected={handleConnected}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How to log workouts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Send messages in your connected Telegram chat using this format:
              </p>
              <div className="space-y-2">
                <code className="block text-sm bg-muted p-3 rounded-md font-mono">
                  bench press 4x8 80kg
                </code>
                <code className="block text-sm bg-muted p-3 rounded-md font-mono">
                  squat 5x5 100kg
                </code>
                <code className="block text-sm bg-muted p-3 rounded-md font-mono">
                  pull ups 4x12
                </code>
                <code className="block text-sm bg-muted p-3 rounded-md font-mono">
                  bw 78.5kg
                </code>
              </div>
              <p className="text-sm text-muted-foreground">
                Shortcuts: bp (bench press), dl (deadlift), sq (squat), ohp (overhead press), rdl (romanian deadlift)
              </p>
            </CardContent>
          </Card>

          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="w-full cursor-pointer gap-2"
          >
            Continue to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!config && !loading && (
        <>
          <TelegramSetupGuide />

          <Separator className="my-8" />

          <div className="space-y-2 mb-4">
            <h2 className="text-xl font-semibold">Connect your bot</h2>
            <p className="text-sm text-muted-foreground">
              Paste the bot token and chat ID from the steps above.
            </p>
          </div>

          <TelegramConnectForm
            existingConfig={null}
            onConnected={handleConnected}
          />
        </>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      )}
    </div>
  );
}
