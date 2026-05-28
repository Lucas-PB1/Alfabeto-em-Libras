"use client";

import { ShieldCheck, ShieldX } from "lucide-react";
import { useState } from "react";
import { useCmsAuth } from "@/features/auth/components/auth-provider";
import { useUsers } from "@/features/users/hooks/use-users";
import { canManageUsers, roleLabel, statusLabel } from "@/features/users/lib/permissions";
import type { UserProfile, UserRole, UserStatus } from "@/features/users/types";
import { CmsBadge, CmsButton, CmsPageHeader, CmsSelect, CmsStatus, CmsTable } from "@/shared/cms/ui";

type BusyAction = "approve" | "block" | "role";
type BusyState = { action: BusyAction; id: string; label: string } | null;
type Feedback = { text: string; tone: "danger" | "success" };

export default function UsersPage() {
  const { authorizedFetch, profile } = useCmsAuth();
  const { error, loading, users } = useUsers(canManageUsers(profile));
  const [busy, setBusy] = useState<BusyState>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  if (!canManageUsers(profile)) {
    return <CmsStatus tone="danger" text="Somente administradores podem gerenciar usuários." />;
  }

  async function updateUser(id: string, body: Partial<Pick<UserProfile, "role" | "status">>, action: BusyAction) {
    setBusy({ id, action, label: getBusyLabel(action) });
    setFeedback(null);

    try {
      await authorizedFetch(`/api/cms/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setFeedback({ text: "Usuário atualizado.", tone: "success" });
    } catch (updateError) {
      setFeedback({ text: getErrorMessage(updateError), tone: "danger" });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-5">
      <CmsPageHeader eyebrow="Acesso" title="Usuários" />
      {loading && <CmsStatus text="Carregando usuários..." />}
      {busy?.action === "role" && <CmsStatus text={busy.label} />}
      {error && <CmsStatus tone="danger" text={error} />}
      {feedback && <CmsStatus tone={feedback.tone} text={feedback.text} />}

      <CmsTable>
        <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-3 py-3">Usuário</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Papel</th>
            <th className="px-3 py-3">Último acesso</th>
            <th className="px-3 py-3">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {users.map((user) => {
            const rowBusy = busy?.id === user.id;

            return (
              <tr key={user.id}>
                <td className="px-3 py-3">
                  <div className="font-black text-slate-900">{user.name}</div>
                  <div className="text-xs font-bold text-slate-500">{user.email}</div>
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-3 py-3">
                  <CmsSelect
                    value={user.role}
                    disabled={rowBusy}
                    onChange={(event) => updateUser(user.id, { role: event.target.value as UserRole }, "role")}
                  >
                    <option value="editor">{roleLabel("editor")}</option>
                    <option value="admin">{roleLabel("admin")}</option>
                  </CmsSelect>
                </td>
                <td className="px-3 py-3 text-sm font-bold text-slate-500">{formatDate(user.lastLoginAt)}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <CmsButton
                      tone="quiet"
                      disabled={rowBusy && busy?.action !== "approve"}
                      loading={rowBusy && busy?.action === "approve"}
                      loadingText="Aprovando..."
                      onClick={() => updateUser(user.id, { status: "approved" }, "approve")}
                    >
                      <ShieldCheck size={16} />
                      Aprovar
                    </CmsButton>
                    <CmsButton
                      tone="danger"
                      disabled={rowBusy && busy?.action !== "block"}
                      loading={rowBusy && busy?.action === "block"}
                      loadingText="Bloqueando..."
                      onClick={() => updateUser(user.id, { status: "blocked" }, "block")}
                    >
                      <ShieldX size={16} />
                      Bloquear
                    </CmsButton>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </CmsTable>
    </div>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  const tone = status === "approved" ? "success" : status === "blocked" ? "danger" : "warning";

  return <CmsBadge tone={tone}>{statusLabel(status)}</CmsBadge>;
}

function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "-";
}

function getBusyLabel(action: BusyAction) {
  const labels = {
    approve: "Aprovando usuário...",
    block: "Bloqueando usuário...",
    role: "Salvando alterações do usuário...",
  };

  return labels[action];
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Não foi possível concluir a ação.";
}
