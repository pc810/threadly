"use client";

import { useAuth } from "@/query/auth.query";
import { ReactNode, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { usePathname, useRouter } from "next/navigation";

export const LoginRedirectProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isLoading, data: auth } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!auth && pathname !== "/login") {
      router.replace("/login");
    } else if (auth && pathname.includes("/login")) {
      router.replace("/dashboard");
    }
  }, [auth, pathname, isLoading, router]);

  //   console.log({ auth, pathname });

  if (isLoading)
    return (
      <div className="size-full fixed bg-background text-foreground grid top-0 place-content-center">
        <Spinner />
      </div>
    );

  return (
    <>
      {/* <div className="p-2 bg-red-600 text-white fixed top-0 left-0 z-[51]">
        {pathname} {JSON.stringify(auth)}
      </div> */}
      {children}
    </>
  );
};
