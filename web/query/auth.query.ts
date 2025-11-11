import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./utils";
import { axios } from "@/lib/axios";
import { UserDTO, userDTOSchema } from "@/types";

export const useAuth = () => {
  return useQuery({
    queryKey: [QueryKeys.auth],
    queryFn: async () =>
      axios
        .get<UserDTO>("/auth/me")
        .then((d) => userDTOSchema.parse(d.data))
        .catch(() => null),
  });
};
