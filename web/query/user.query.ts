import { QueryOptions, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./utils";
import { axios } from "@/lib/axios";
import { UserDTO, UserDTOSlice } from "@/types";
import { useAuth } from "./auth.query";

export const useUser = (userId: string | undefined) => {
  return useQuery({
    queryKey: [QueryKeys.user, userId],
    queryFn: async () => {
      const response = await axios.get<UserDTO>(`/users/${userId}`);
      return response.data;
    },
    enabled: userId != null,
  });
};

export type UseUsersOpts = { excludeSelf: boolean; enabled: boolean };

export const useUsers = (query: string, options?: Partial<UseUsersOpts>) => {
  const auth = useAuth();
  return useQuery({
    queryKey: [QueryKeys.user, query, options],
    queryFn: async ({ signal }) => {
      const response = await axios.get<UserDTOSlice>("/users", {
        params: { query },
        signal,
      });
      if (options?.excludeSelf)
        return {
          ...response.data,
          content: response.data.content.filter((d) => d.id !== auth.data?.id),
        };

      return response.data;
    },
    enabled: query.length >= 2 && !!auth,
  });
};
