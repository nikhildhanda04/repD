import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Loader } from "@/components/ui/loader";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function TelegramConnectForm({ existingConfig, onConnected }) {
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/telegram/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ botToken: botToken.trim(), chatId: chatId.trim() }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      setBotToken("");
      setChatId("");
      onConnected?.(data.data);
    } catch {
      setError("Failed to connect. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/telegram/config`, {
        method: "DELETE",
        credentials: "include",
      });
      onConnected?.(null);
    } catch {
      setError("Failed to disconnect.");
    } finally {
      setLoading(false);
    }
  }

  if (existingConfig) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Connected</p>
                <p className="text-sm text-muted-foreground">
                  Bot: @{existingConfig.botUsername}
                  {existingConfig.chatTitle && ` | Chat: ${existingConfig.chatTitle}`}
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDisconnect}
              disabled={loading}
              className="cursor-pointer"
            >
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Bot Token</label>
            <Input
              placeholder="7123456789:AAH1bGciOiJIUzI1NiIs..."
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              required
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Chat ID</label>
            <Input
              placeholder="-1001234567890"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              required
              className="font-mono text-sm"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-md p-3">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full cursor-pointer">
            {loading && <Loader size={16} className="mr-2" />}
            Connect Bot
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
