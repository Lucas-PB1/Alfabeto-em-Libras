"use client";

import { ShieldCheck, ShieldX } from "lucide-react";
import { useState } from "react";
import { useCmsAuth } from "@/features/auth/components/auth-provider";
import { useUsers } from "@/features/users/hooks/use-users";
import { canManageUsers, roleLabel, statusLabel } from "@/features/users/lib/permissions";
import type { UserProfile, UserRole, UserStatus } from "@/features/users/types";
import { CmsBadge, CmsButton, CmsPageHeader, CmsSelect, CmsStatus, CmsTable } from "@/shared/cms/ui";

export default function UsersPage() {
  const { authorizedFetch, profile } = useCmsAuth();
  const { error, loading, users } = useUsers(canManageUsers(profile));
  const [busyId, setBusyId] = useState("");

  if (!canManageUsers(profile)) {
    return <CmsStatus text="Somente administradores podem gerenciar usuários." />;
  }

  async function updateUser(id: string, body: Partial<Pick<UserProfile, "role" | "status">>) {
    setBusyId(id);

    try {
      await authorizedFetch(`/api/cms/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="grid gap-5">
      <CmsPageHeader eyebrow="Acesso" title="Usuários" />
      {loading && <CmsStatus text="Carregando usuários..." />}
      {error && <CmsStatus text={error} />}

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
          {users.map((user) => (
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
                  disabled={busyId === user.id}
                  onChange={(event) => updateUser(user.id, { role: event.target.value as UserRole })}
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
                    disabled={busyId === user.id}
                    onClick={() => updateUser(user.id, { status: "approved" })}
                  >
                    <ShieldCheck size={16} />
                    Aprovar
                  </CmsButton>
                  <CmsButton
                    tone="danger"
                    disabled={busyId === user.id}
                    onClick={() => updateUser(user.id, { status: "blocked" })}
                  >
                    <ShieldX size={16} />
                    Bloquear
                  </CmsButton>
                </div>
              </td>
            </tr>
          ))}
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
