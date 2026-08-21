import type { ReactNode } from "react";

import {
  DesktopSidebar,
  MobileNavigation,
} from "@/components/app-navigation";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <DesktopSidebar />

      <div className="min-h-screen pb-36 pt-[calc(env(safe-area-inset-top)+0.5rem)] lg:pl-72 lg:pb-0 lg:pt-0">
        {children}
      </div>

      <MobileNavigation />
    </div>
  );
}