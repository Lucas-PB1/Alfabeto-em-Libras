"use client";

import { Clock, LogOut } from "lucide-react";
import { useCmsAuth } from "@/features/auth/components/auth-provider";
import { statusLabel } from "@/features/users/lib/permissions";
import { CmsButton, CmsPanel } from "@/shared/cms/ui";

export default function PendingPage() {
  const { profile, signOut } = useCmsAuth();
  const blocked = profile?.status === "blocked";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 flex items-center justify-center p-4">
      <CmsPanel className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
          <Clock size={24} />
        </div>
        <h1 className="text-2xl font-black tracking-tight">
          {blocked ? "Acesso bloqueado" : "Aguardando autorização"}
        </h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
          {blocked
            ? "Seu usuário não está autorizado a acessar o CMS no momento."
            : "Sua conta foi criada e precisa ser aprovada por um administrador."}
        </p>
        {profile && (
          <p className="mt-3 text-xs font-black uppercase tracking-wide text-slate-400">
            Status: {statusLabel(profile.status)}
          </p>
        )}
        <CmsButton tone="quiet" className="mt-6 w-full" onClick={signOut}>
          <LogOut size={17} />
          Sair
        </CmsButton>
      </CmsPanel>
    </main>
  );
}
