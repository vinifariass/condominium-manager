import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DebugUser } from "@/components/debug-user";

export default function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AdminPanelLayout>
        {children}
        <DebugUser />
      </AdminPanelLayout>
    </AuthGuard>
  );
}
