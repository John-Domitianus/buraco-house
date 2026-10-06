import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/AuthCard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Buraco House" },
      { name: "description", content: "Acesse sua conta da Buraco House." },
      { property: "og:title", content: "Entrar — Buraco House" },
      { property: "og:description", content: "Acesse sua conta." },
    ],
  }),
  component: Page,
});

const schema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres").max(72),
});

function Page() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ email: f.get("email"), password: f.get("password") });
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) { toast.error(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos" : error.message); return; }
    toast.success("Bem-vindo de volta!");
    navigate({ to: "/" });
  }
  return (
    <AuthCard title="Entrar" subtitle="Acesse sua conta para girar a roleta e mais." footer={<>Não tem conta? <Link to="/registro" className="text-primary-glow hover:underline">Registre-se</Link></>}>
      <form onSubmit={submit} className="grid gap-4">
        <div className="grid gap-2"><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" autoComplete="email" required /></div>
        <div className="grid gap-2"><Label htmlFor="password">Senha</Label><Input id="password" name="password" type="password" autoComplete="current-password" required /></div>
        <Button variant="hero" type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
      </form>
    </AuthCard>
  );
}
