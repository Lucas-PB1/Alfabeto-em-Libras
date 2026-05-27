"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { canAccessCms } from "@/features/users/lib/permissions";
import { CmsAuthProvider, useCmsAuth } from "./auth-provider";

const publicCmsPaths = new Set(["/cms/login", "/cms/pending"]);

export function CmsAuthGate({ children }: { children: React.ReactNode }) {
  return (
    <CmsAuthProvider>
      <CmsAuthGateContent>{children}</CmsAuthGateContent>
    </CmsAuthProvider>
  );
}

function CmsAuthGateContent({ children }: { children: React.ReactNode }) {
  const { error, loading, profile, user } = useCmsAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublicPath = publicCmsPaths.has(pathname);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user && !isPublicPath) {
      router.replace("/cms/login");
      return;
    }

    if (user && profile && !canAccessCms(profile) && pathname !== "/cms/pending") {
      router.replace("/cms/pending");
      return;
    }

    if (user && profile && canAccessCms(profile) && isPublicPath) {
      router.replace("/cms");
    }
  }, [isPublicPath, loading, pathname, profile, router, user]);

  if (loading && !isPublicPath) {
    return <FullPageState text="Carregando CMS..." />;
  }

  if (error && !isPublicPath) {
    return <FullPageState text={error} />;
  }

  return children;
}

function FullPageState({ text }: { text: string }) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 flex items-center justify-center p-6">
      <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm font-semibold shadow-sm">
        {text}
      </div>
    </main>
  );
}
