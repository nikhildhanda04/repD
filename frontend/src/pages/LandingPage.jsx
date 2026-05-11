import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { FloatingCards } from "@/components/landing/FloatingCards";
import { Footer } from "@/components/layout/Footer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    async function redirect() {
      try {
        const res = await fetch(`${API_URL}/api/telegram/config`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.data) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/telegram", { replace: true });
        }
      } catch {
        navigate("/telegram", { replace: true });
      }
    }

    redirect();
  }, [user, navigate]);

  return (
    <>
      <div className="relative overflow-hidden min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div
          className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 w-[140%] h-[70%] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 100%, rgba(168,85,247,0.25) 0%, rgba(168,85,247,0.03) 40%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <FloatingCards />
          <HeroSection />
        </div>
      </div>
      <Footer />
    </>
  );
}
