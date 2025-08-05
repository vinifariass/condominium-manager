import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { DebugUser } from "@/components/debug-user";

export default function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminPanelLayout>
      {children}
      <DebugUser />
    </AdminPanelLayout>
  );
}
