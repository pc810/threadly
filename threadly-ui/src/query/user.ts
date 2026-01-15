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
	const { auth, isLogedIn } = useAuth();

	return useQuery({
		enabled: query.length >= 2 && isLogedIn,
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
							content: data.content.filter((d) => d.id !== auth?.id),
						};

					return data;
				}),
	});
};

export const getUserByUsername = async (username: string) =>
	axios
		.get<UserDTO>(`/users/name/${username}`)
		.then(({ data }) => data)
		.catch(() => null);
