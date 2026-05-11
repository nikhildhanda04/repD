import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { FloatingCards } from "@/components/landing/FloatingCards";
import { Footer } from "@/components/layout/Footer";

export function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  return (
    <>
      <div className="relative overflow-hidden min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="relative mx-auto max-w-6xl px-6">
          <FloatingCards />
          <HeroSection />
        </div>
      </div>
      <Footer />
    </>
  );
}
