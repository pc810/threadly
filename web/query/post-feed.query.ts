import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./utils";
import { axios } from "@/lib/axios";
import { useAuth } from "./auth.query";
import { PostFeedSlice } from "@/types/post-feed";

export function useUserPostFeed() {
  const auth = useAuth();
  return useInfiniteQuery({
    enabled: !!auth,
    queryKey: [QueryKeys.feed],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const response = await axios.get<PostFeedSlice>("/post-feed/me", {
        withCredentials: true,
        params: {
          feedTime: new Date().getTime(),
          pageNumber:pageParam,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.last) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPage.first) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });
}
