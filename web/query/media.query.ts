import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./utils";
import { axios } from "@/lib/axios";
import { ImageMedia } from "@/types";

export const useMedia = (mediaId: string) => {
  return useQuery({
    queryKey: [QueryKeys.media, mediaId],
    queryFn: async () => {
      const response = await axios.get<ImageMedia>(`/medias/${mediaId}`, {
        withCredentials: true,
      });
      return response.data;
    },
  });
};
