"use client";

import { useState } from "react";
import { Lock, Mail, UserPlus } from "lucide-react";
import { useCmsAuth } from "@/features/auth/components/auth-provider";
import { CmsButton, CmsField, CmsInput, CmsPanel } from "@/shared/cms/ui";

export default function LoginPage() {
  const { error: authError, signIn, signUp } = useCmsAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (mode === "login") {
        await signIn(form.email, form.password);
      } else {
        await signUp(form.name, form.email, form.password);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Falha ao acessar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 flex items-center justify-center p-4">
      <CmsPanel className="w-full max-w-md">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-wide text-sky-700">CMS Libras</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight">
            {mode === "login" ? "Entrar na plataforma" : "Criar acesso"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {mode === "signup" && (
            <CmsField label="Nome">
              <CmsInput
                required
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Seu nome"
              />
            </CmsField>
          )}

          <CmsField label="Email">
            <CmsInput
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="voce@email.com"
            />
          </CmsField>

          <CmsField label="Senha">
            <CmsInput
              required
              minLength={6}
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Mínimo de 6 caracteres"
            />
          </CmsField>

          {(error || authError) && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">
              {error || authError}
            </p>
          )}

          <CmsButton disabled={busy} className="w-full" type="submit">
            {mode === "login" ? <Lock size={17} /> : <UserPlus size={17} />}
            {busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Solicitar acesso"}
          </CmsButton>
        </form>

        <button
          type="button"
          onClick={() => setMode((current) => (current === "login" ? "signup" : "login"))}
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:text-sky-900"
        >
          <Mail size={16} />
          {mode === "login" ? "Ainda não tenho acesso" : "Já tenho uma conta"}
        </button>
      </CmsPanel>
    </main>
  );
}
