import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { axios } from "@/lib/axios";
import { PostFeedSlice } from "@/types/feed";
import type { CreatePostRequest, Post } from "@/types/post";
import { useAuth } from "./auth";
import { queryKeys } from "./keys";

export function useCreatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreatePostRequest) => axios.post("/posts", data),
		onSuccess: (_data, variable) => {
			toast("Post created successfully 🎉", {
				description: "Your post has been published.",
			});

			queryClient.invalidateQueries({
				queryKey: queryKeys.community.posts(variable.communityId),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.feed.list(),
			});
		},
		onError: (error: any) => {
			const message =
				error.response?.data?.message ||
				"Failed to create post. Please try again.";
			toast.error("Error creating post", {
				description: message,
			});
		},
	});
}

export function useUserFeed() {
	const auth = useAuth();
	return useInfiniteQuery({
		enabled: !!auth,
		queryKey: queryKeys.feed.list(),
		initialPageParam: 0,
		queryFn: async ({ pageParam }) =>
			axios
				.get<PostFeedSlice>("/post-feed/me", {
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
