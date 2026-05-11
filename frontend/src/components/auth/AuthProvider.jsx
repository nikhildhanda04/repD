import { useState, useEffect } from "react";
import { AuthContext } from "@/hooks/useAuth";
import { authClient } from "@/lib/auth-client";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const { data } = await authClient.getSession();
      setUser(data?.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.origin + "/telegram",
    });
  }

  async function signOut() {
    await authClient.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}
