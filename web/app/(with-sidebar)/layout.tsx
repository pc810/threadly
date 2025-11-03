import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col max-h-screen">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 min-h-0 overflow-hidden pt-14">
            <div className="flex-1 overflow-y-auto">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default Layout;
