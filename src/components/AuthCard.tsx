import type { ReactNode } from "react";
import { Container } from "@/components/common";

export function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <Container className="relative flex justify-center py-16 sm:py-24">
        <div className="card-surface w-full max-w-md p-6 sm:p-8 animate-fade-up">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </Container>
    </div>
  );
}
