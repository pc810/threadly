import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { axios } from "@/lib/axios";
import { PostFeedDTOSlice, PostFeedSlice } from "@/types/feed";
import type { CreatePostRequest, Post } from "@/types/post";
import { useAuth } from "./auth";
import { queryKeys } from "./keys";

export function useUserFeed() {
	const auth = useAuth();
	return useInfiniteQuery({
		enabled: !!auth,
		queryKey: queryKeys.feed.list(),
		initialPageParam: 0,
		queryFn: async ({ pageParam }) =>
			axios
				.get<PostFeedDTOSlice>("/post-feed/me", {
					params: {
						feedTime: Date.now(),
						pageNumber: pageParam,
					},
				})
				.then(({ data }) => data),
		getNextPageParam: (lastPage, _allPages, lastPageParam) => {
			if (lastPage.last) {
				return undefined;
			}
			return lastPageParam + 1;
		},
		getPreviousPageParam: (firstPage, _allPages, firstPageParam) => {
			if (firstPage.first) {
				return undefined;
			}
			return firstPageParam - 1;
		},
	});
}

export function useCommunityFeed(communityId: string) {
	return useInfiniteQuery({
		queryKey: queryKeys.community.feed(communityId),
		initialPageParam: 0,
		queryFn: async ({ pageParam }) =>
			axios
				.get<PostFeedDTOSlice>(`/post-feed/communities/${communityId}`, {
					params: {
						pageNumber: pageParam,
					},
				})
				.then(({ data }) => data),
		getNextPageParam: (lastPage, _allPages, lastPageParam) => {
			if (lastPage.last) {
				return undefined;
			}
			return lastPageParam + 1;
		},
		getPreviousPageParam: (firstPage, _allPages, firstPageParam) => {
			if (firstPage.first) {
				return undefined;
			}
			return firstPageParam - 1;
		},
	});
}
