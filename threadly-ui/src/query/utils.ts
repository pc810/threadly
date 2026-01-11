import type { UseQueryResult } from "@tanstack/react-query";

export const isLogedIn = (
	auth: UseQueryResult<
		{
			id: string;
			name: string;
		} | null,
		Error
	>,
) => !!auth && auth.data != null;
