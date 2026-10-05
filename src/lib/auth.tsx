import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "./types";

type AuthState = {
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load(s: Session | null) {
    if (!s) {
      setProfile(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    const [{ data: p }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", s.user.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", s.user.id),
    ]);
    setProfile(p ?? null);
    setIsAdmin(!!roles?.some((r) => r.role === "admin"));
    setLoading(false);
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setTimeout(() => load(s), 0);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      load(data.session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        isAdmin,
        loading,
        refreshProfile: () => load(session),
        signOut: async () => {
          await supabase.auth.signOut();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
