import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Send, Loader2, CheckCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function Footer() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus(data.message || "Failed to send");
      }
    } catch {
      setStatus("Failed to send. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h3 className="text-lg font-semibold tracking-tight mb-1">Get in touch</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Questions, feedback, or feature requests.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <Textarea
                placeholder="Your message..."
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                className="resize-none"
              />

              {status === "sent" ? (
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Message sent successfully
                </div>
              ) : typeof status === "string" && status !== "sent" ? (
                <p className="text-sm text-destructive">{status}</p>
              ) : null}

              <Button type="submit" disabled={loading} className="cursor-pointer">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Send Message
              </Button>
            </form>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="h-2 w-2 rounded-full bg-foreground" />
                  <div className="h-2 w-2 rounded-full bg-foreground" />
                  <div className="h-2 w-2 rounded-full bg-foreground" />
                  <div className="h-2 w-2 rounded-full bg-foreground" />
                </div>
                <span className="text-lg font-bold tracking-tight">repD</span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-8">
                Log workouts from Telegram. Track progress with auto-parsed data.
                Get AI-powered coaching insights.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Resources</h4>
                  <div className="flex flex-col gap-1.5">
                    <a
                      href="https://t.me/BotFather"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                    >
                      BotFather
                    </a>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <p className="text-xs text-muted-foreground">
              {new Date().getFullYear()} repD. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
