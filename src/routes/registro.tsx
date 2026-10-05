import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/AuthCard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Criar conta — Mafia Store" },
      { name: "description", content: "Crie sua conta na Mafia Store." },
      { property: "og:title", content: "Criar conta — Mafia Store" },
      { property: "og:description", content: "Junte-se à comunidade." },
    ],
  }),
  component: Page,
});

const schema = z
  .object({
    nickname: z.string().trim().min(3, "Nickname deve ter ao menos 3 caracteres").max(24).regex(/^[A-Za-z0-9_]+$/, "Use apenas letras, números e _"),
    email: z.string().trim().email("E-mail inválido").max(255),
    password: z.string().min(8, "Senha deve ter ao menos 8 caracteres").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "As senhas não coincidem", path: ["confirm"] });

function Page() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = schema.safeParse(f);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { emailRedirectTo: window.location.origin, data: { nickname: parsed.data.nickname } },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
  }
  return (
    <AuthCard title="Criar conta" subtitle="Registre-se para participar da comunidade." footer={<>Já tem conta? <Link to="/login" className="text-primary-glow hover:underline">Entrar</Link></>}>
      {sent ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <MailCheck className="h-10 w-10 text-success" />
          <p className="font-semibold">Confirme seu e-mail</p>
          <p className="text-sm text-muted-foreground">Enviamos um link de confirmação. Depois de confirmar, faça login.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-2"><Label htmlFor="nickname">Nickname</Label><Input id="nickname" name="nickname" required /></div>
          <div className="grid gap-2"><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" autoComplete="email" required /></div>
          <div className="grid gap-2"><Label htmlFor="password">Senha</Label><Input id="password" name="password" type="password" autoComplete="new-password" required /></div>
          <div className="grid gap-2"><Label htmlFor="confirm">Confirmar senha</Label><Input id="confirm" name="confirm" type="password" autoComplete="new-password" required /></div>
          <Button variant="hero" type="submit" disabled={loading}>{loading ? "Criando..." : "Registrar"}</Button>
        </form>
      )}
    </AuthCard>
  );
}
