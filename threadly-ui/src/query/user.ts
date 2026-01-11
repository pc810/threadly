import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import type { UserDTO, UserDTOSlice } from "@/types/user";
import { useAuth } from "./auth";
import { queryKeys } from "./keys";

export type UseUsersOpts = { excludeSelf: boolean; enabled: boolean };

export const useUser = (userId: string | undefined) => {
	return useQuery({
		queryKey: queryKeys.user.detail(userId ?? "unknown"),
		queryFn: async () => {
			const response = await axios.get<UserDTO>(`/users/${userId}`);
			return response.data;
		},
		enabled: userId != null,
	});
};

export const useUsers = (query: string, options?: Partial<UseUsersOpts>) => {
	const auth = useAuth();

	return useQuery({
		enabled: query.length >= 2 && !auth.isLoading,
		queryKey: queryKeys.user.search(query, options),
		queryFn: async ({ signal }) =>
			axios
				.get<UserDTOSlice>("/users", {
					params: { query },
					signal,
				})
				.then(({ data }) => {
					if (options?.excludeSelf)
						return {
							...data,
							content: data.content.filter((d) => d.id !== auth.data?.id),
						};

					return data;
				}),
	});
};
