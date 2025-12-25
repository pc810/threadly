// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { LoginRedirectProvider } from "@/components/login-redirect-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <LoginRedirectProvider>{children}</LoginRedirectProvider>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
