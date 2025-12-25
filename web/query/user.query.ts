import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./utils";
import { axios } from "@/lib/axios";
import { UserDTO } from "@/types";

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
