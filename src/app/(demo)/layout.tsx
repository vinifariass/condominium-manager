'use client';
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DebugUser } from "@/components/debug-user";
import { use, useEffect } from "react";

export default function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
  const observer = new MutationObserver(() => {
    if (document.body.style.pointerEvents === 'none') {
      // Só remove se não há modais realmente abertos
      const openDialogs = document.querySelectorAll('[data-state="open"][data-radix-dialog-content]');
      if (openDialogs.length === 0) {
        document.body.style.pointerEvents = 'auto';
      }
    }
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['style']
  });

  return () => observer.disconnect();
}, []);
  return (
    <AuthGuard>
      <AdminPanelLayout>
        {children}
        <DebugUser />
      </AdminPanelLayout>
    </AuthGuard>
  );
}
