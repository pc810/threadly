import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import type { ResourcePermissions, ResourceType } from "@/types/permission";
import { queryKeys } from "./keys";

type PermissionMap<P extends readonly string[]> = {
	[K in P[number]]: boolean;
};
export const usePermission = <
	T extends ResourceType,
	P extends readonly (typeof ResourcePermissions)[T][number][],
>(
	resourceType: T,
	resourceId: string,
	permissions: P,
	prefer: "consistency" | "latency" = "latency",
): PermissionMap<P> & {
	isLoading: boolean;
	error: unknown;
} => {
	const query = useQuery({
		queryKey: queryKeys.permission.resource(
			resourceType,
			resourceId,
			permissions,
		),
		enabled: !!resourceId && permissions.length > 0,
		queryFn: async (): Promise<PermissionMap<P>> => {
			const res = await axios.get<PermissionMap<P>>("/permissions", {
				params: {
					resourceType,
					resourceId,
					permissions,
					minimizeLatency: prefer === "latency",
				},
			});
			return res.data;
		},
	});

	return {
		...(query.data ?? ({} as PermissionMap<P>)),
		isLoading: query.isLoading,
		error: query.error,
	};
};
