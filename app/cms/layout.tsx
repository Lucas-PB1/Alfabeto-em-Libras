import { CmsAuthGate } from "@/features/auth/components/cms-auth-gate";
import { CmsLayout } from "@/shared/cms/cms-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CmsAuthGate>
      <CmsLayout>{children}</CmsLayout>
    </CmsAuthGate>
  );
}
