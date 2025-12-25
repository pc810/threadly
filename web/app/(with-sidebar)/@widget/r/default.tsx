import { ClientCommunityWidgetWrapper } from "@/components/community";
import { ReactNode } from "react";

export default function WidgetLayout({ children }: { children: ReactNode }) {
  return (
    <ClientCommunityWidgetWrapper>{children}</ClientCommunityWidgetWrapper>
  );
}
