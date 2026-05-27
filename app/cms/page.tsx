"use client";

import { useMemo } from "react";
import { BookOpen, Type, UserCheck, UserRoundCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCmsAuth } from "@/features/auth/components/auth-provider";
import { useAlphabetLetters } from "@/features/alphabet/hooks/use-alphabet-letters";
import { useUsers } from "@/features/users/hooks/use-users";
import { canManageUsers } from "@/features/users/lib/permissions";
import { useWords } from "@/features/words/hooks/use-words";
import { CmsPageHeader, CmsPanel, CmsStatus } from "@/shared/cms/ui";

export default function DashboardPage() {
  const { profile } = useCmsAuth();
  const canSeeUsers = canManageUsers(profile);
  const { letters } = useAlphabetLetters();
  const { users } = useUsers(canSeeUsers);
  const { words } = useWords();
  const lastAccess = useMemo(() => (
    [...users]
      .filter((user) => user.lastLoginAt)
      .sort((a, b) => String(b.lastLoginAt).localeCompare(String(a.lastLoginAt)))
      .slice(0, 5)
  ), [users]);

  return (
    <div className="grid gap-5">
      <CmsPageHeader eyebrow="Visão geral" title="Dashboard" />

      <div className="grid gap-3 md:grid-cols-4">
        <StatCard icon={Type} label="Letras ativas" value={letters.filter((item) => item.active).length} />
        <StatCard icon={BookOpen} label="Palavras" value={words.length} />
        <StatCard icon={UserCheck} label="Pendentes" value={users.filter((user) => user.status === "pending").length} />
        <StatCard icon={UserRoundCheck} label="Aprovados" value={users.filter((user) => user.status === "approved").length} />
      </div>

      <CmsPanel>
        <h2 className="text-base font-black text-slate-950">Últimos acessos</h2>
        <div className="mt-4 grid gap-2">
          {!canSeeUsers && <CmsStatus text="Somente administradores visualizam acessos de usuários." />}
          {canSeeUsers && lastAccess.length === 0 && <CmsStatus text="Nenhum acesso registrado ainda." />}
          {lastAccess.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
              <span className="font-bold text-slate-700">{user.name}</span>
              <span className="text-xs font-bold text-slate-500">{formatDate(user.lastLoginAt)}</span>
            </div>
          ))}
        </div>
      </CmsPanel>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <CmsPanel>
      <Icon size={20} className="text-sky-700" />
      <p className="mt-4 text-2xl font-black text-slate-950">{value}</p>
      <p className="text-sm font-bold text-slate-500">{label}</p>
    </CmsPanel>
  );
}

function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "-";
}
