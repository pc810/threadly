import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import React from "react";

function Layout({
  children,
  widget,
}: {
  children: React.ReactNode;
  widget: React.ReactNode;
}) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col max-h-screen">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 min-h-0  pt-14">
            <div className="flex-1 grid-cols-[minmax(0,756px)_minmax(0,316px)] mx-auto grid gap-6">
              {children}
              {widget}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default Layout;
