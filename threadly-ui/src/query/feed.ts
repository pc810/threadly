import { useInfiniteQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import type { PostFeedDTOSlice } from "@/types/feed";
import { useAuth } from "./auth";
import { queryKeys } from "./keys";

export function useUserFeed() {
	const { isLogedIn } = useAuth();
	return useInfiniteQuery({
		enabled: isLogedIn,
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

export function useUserProfileFeed(userId: string) {
	return useInfiniteQuery({
		queryKey: queryKeys.feed.user(userId),
		initialPageParam: 0,
		queryFn: async ({ pageParam }) =>
			axios
				.get<PostFeedDTOSlice>(`/post-feed/users/${userId}`, {
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
