"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, LogOut, Type, UserCircle, Users } from "lucide-react";
import { useCmsAuth } from "@/features/auth/components/auth-provider";
import { canManageUsers, roleLabel } from "@/features/users/lib/permissions";
import { cn } from "@/shared/lib/cn";

const publicCmsPaths = new Set(["/cms/login", "/cms/pending"]);

const navItems = [
  { href: "/cms", label: "Dashboard", icon: Home },
  { href: "/cms/alfabeto", label: "Alfabeto", icon: Type },
  { href: "/cms/palavras", label: "Palavras", icon: BookOpen },
  { href: "/cms/usuarios", label: "Usuários", icon: Users, adminOnly: true },
  { href: "/cms/perfil", label: "Perfil", icon: UserCircle },
];

export function CmsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, signOut } = useCmsAuth();

  if (publicCmsPaths.has(pathname)) {
    return children;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-x-0 top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur md:inset-y-0 md:right-auto md:w-64 md:border-b-0 md:border-r">
        <div className="flex h-16 items-center justify-between px-4 md:h-auto md:flex-col md:items-stretch md:gap-6 md:p-5">
          <Link href="/cms" className="font-black tracking-tight text-slate-950">
            Libras CMS
          </Link>
          <nav className="hidden gap-1 md:grid">
            {navItems.map((item) => {
              if (item.adminOnly && !canManageUsers(profile)) {
                return null;
              }

              return <NavLink key={item.href} {...item} active={pathname === item.href} />;
            })}
          </nav>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            aria-label="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 md:hidden">
          {navItems.map((item) => {
            if (item.adminOnly && !canManageUsers(profile)) {
              return null;
            }

            return <NavLink key={item.href} {...item} active={pathname === item.href} compact />;
          })}
        </nav>
      </aside>

      <main className="mx-auto max-w-6xl px-4 pb-10 pt-32 md:ml-64 md:px-8 md:pt-8">
        <div className="mb-5 text-sm font-bold text-slate-500">
          {profile?.name} · {profile ? roleLabel(profile.role) : "CMS"}
        </div>
        {children}
      </main>
    </div>
  );
}

function NavLink({
  active,
  compact = false,
  href,
  icon: Icon,
  label,
}: {
  active: boolean;
  compact?: boolean;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition",
        compact && "shrink-0",
        active ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
      )}
    >
      <Icon size={17} />
      {label}
    </Link>
  );
}
