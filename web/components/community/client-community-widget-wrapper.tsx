"use client";

import { ReactNode } from "react";
import SimpleBar from "simplebar-react";

export const ClientCommunityWidgetWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="sticky bottom-0 top-18 w-full h-full max-h-[calc(100svh)] pt-4">
      <SimpleBar className="h-full">{children}</SimpleBar>
    </div>
  );
};
