import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import type { ImageMedia } from "@/types/media";
import { queryKeys } from "./keys";

export const useMedia = (mediaId: string) => {
	return useQuery({
		queryKey: queryKeys.media.detail(mediaId),
		queryFn: () =>
			axios.get<ImageMedia>(`/medias/${mediaId}`).then(({ data }) => data),
	});
};
