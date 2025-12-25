import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import clsx from "clsx";
import React from "react";

function Layout({
  children,
  widget,
  header,
  sidebar,
}: {
  children: React.ReactNode;
  widget: React.ReactNode;
  header: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col max-h-screen">
        <SiteHeader />
        <div className="flex flex-1">
          {sidebar}
          <SidebarInset className="flex-1 min-h-0  pt-14">
            {header}
            <div
              className={clsx(
                "flex-1 mx-auto grid gap-6",
                "px-6",
                // "grid-cols-1 has-[>:first-child:nth-last-child(2)]:grid-cols-2"
                "grid-cols-1 w-full has-[>:first-child:nth-last-child(2)]:w-auto has-[>:first-child:nth-last-child(2)]:grid-cols-[minmax(0,756px)_minmax(0,316px)] has-[>:first-child:nth-last-child(2)]:px-0"
              )}
            >
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
