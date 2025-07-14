"use client";

import React from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import NotificationPanel from "@/components/notification-panel";

export default function NotificationsPage() {
  return (
    <ContentLayout title="Notificações SMS e WhatsApp">
      <NotificationPanel />
    </ContentLayout>
  );
}
