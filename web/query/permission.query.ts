import { ResourcePermission, ResourceType } from "@/types";
import { QueryKeys } from "./utils";
import { axios } from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type PermissionMap<P extends readonly string[]> = {
  [K in P[number]]: boolean;
};
export const usePermission = <
  T extends ResourceType,
  P extends readonly ResourcePermission[T][]
>(
  resourceType: T,
  resourceId: string | undefined,
  permissions: P,
  prefer: "consistency" | "latency" = "latency"
): PermissionMap<P> & {
  isLoading: boolean;
  error: unknown;
} => {
  const query = useQuery({
    queryKey: [QueryKeys.permission, resourceType, resourceId],
    enabled: !!resourceId && permissions.length > 0,
    queryFn: async (): Promise<PermissionMap<P>> => {
      const res = await axios.get<PermissionMap<P>>("/permissions", {
        params: {
          resourceType,
          resourceId,
          permissions,
          minimizeLatency: prefer == "latency",
        },
      });
      return res.data;
    },
  });

  // useEffect(() => {
  //   if (!query.data) return;

  //   permissions.forEach((permission) => {
  //     queryClient.setQueryData(
  //       [QueryKeys.permission, resourceType, resourceId, permission],
  //       query.data?.[permission] ?? false
  //     );
  //   });
  // }, [query.data, permissions, resourceType, resourceId, queryClient]);

  return {
    ...(query.data ?? ({} as PermissionMap<P>)),
    isLoading: query.isLoading,
    error: query.error,
  };
};
