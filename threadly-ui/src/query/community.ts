import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { axios } from "@/lib/axios";
import type { CommentDTOSlice, CreateCommentRequest } from "@/types/comment";
import type {
	Community,
	CommunityInviteAction,
	CommunityMembershipDTOPage,
	CommunityMembershipInviteDTO,
	CommunityMembershipInviteDTOPage,
	CreateCommunityRequest,
	InviteUserDTO,
	UpdateCommunityMetaDTO,
} from "@/types/community";
import type { CreatePostRequest, Post, PostLink } from "@/types/post";
import type { AppAxoisError } from "@/types/utils";
import { CreateVoteRequest } from "@/types/vote";
import { useAuth } from "./auth";
import { queryKeys } from "./keys";

export const useCommunities = () => {
	return useQuery({
		queryKey: queryKeys.community.list(),
		queryFn: () =>
			axios.get<Community[]>("/communities/me").then(({ data }) => data),
	});
};

export const useCommunity = (communityId: string) => {
	return useQuery({
		enabled: communityId != null,
		queryKey: queryKeys.community.detail(communityId),
		queryFn: () =>
			axios
				.get<Community>(`/communities/${communityId}`)
				.then(({ data }) => data),
	});
};

export const useHasCommunityInvite = (communityId: string) => {
	const { auth } = useAuth();
	return useQuery({
		enabled: communityId != null && !!auth,
		queryKey: queryKeys.community.invitation(communityId, String(auth?.id)),
		queryFn: () =>
			axios
				.get<CommunityMembershipInviteDTO | null>(
					`/communities/${communityId}/invite`,
				)
				.then(({ data }) => data),
	});
};

export const useCommunityInvite = (communityId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: queryKeys.community.invitations(communityId),
		mutationFn: (payload: InviteUserDTO) =>
			axios.post<void>(`/communities/${communityId}/invite`, payload),
		onSuccess: () => {
			toast("Community Invitation sent successfully 🎉");

			queryClient.invalidateQueries({
				queryKey: queryKeys.community.invitations(communityId),
			});

			queryClient.invalidateQueries({
				queryKey: queryKeys.permission.resource("COMMUNITY", communityId),
			});
		},
		onError: (error: AppAxoisError) => {
			const message =
				error.response?.data?.message ||
				"Failed to sent invitation. Please try again.";
			toast.error("Failed to Invite", {
				description: message,
			});
		},
	});
};

export const useCommunityInviteAction = (communityId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: queryKeys.community.membershipsInvite(communityId),
		mutationFn: (action: CommunityInviteAction) =>
			axios.post<void>(`/communities/${communityId}/invite/${action}`, {}),
		onSuccess: (_data, variables) => {
			if (variables === "ACCEPT") {
				toast("Community joined successfully 🎉");
			} else {
				toast("Community invitation rejected successfully");
			}
			console.log({
				k1: queryKeys.community.memberships(communityId),
				k2: queryKeys.community.invitations(communityId),
				k3: queryKeys.permission.resource("COMMUNITY", communityId),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.community.memberships(communityId),
			});
			queryClient.refetchQueries({
				queryKey: queryKeys.community.invitations(communityId),
			});
			queryClient.refetchQueries({
				queryKey: queryKeys.permission.resource("COMMUNITY", communityId),
			});
		},
		onError: (error: AppAxoisError) => {
			const message =
				error.response?.data?.message ||
				"Failed to membership action on community. Please try again.";
			toast.error("Failed to membership action", {
				description: message,
			});
		},
	});
};

export const useCommunityInviteRemove = (communityId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: queryKeys.community.membershipsInviteRemote(communityId),
		mutationFn: (invite: CommunityMembershipInviteDTO) =>
			axios.delete<void>(
				`/communities/${invite.id.communityId}/invite/${invite.id.userId}`,
			),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.community.membershipsInvite(communityId),
			});
		},
		onError: (error: AppAxoisError) => {
			const message =
				error.response?.data?.message ||
				"Failed to remove membership invite on community. Please try again.";
			toast.error("Failed to remove invite", {
				description: message,
			});
		},
	});
};

// export const useCommunityByName = (communityName: string) => {
// 	return useQuery({
// 		queryKey: [QueryKeys.community, QueryKeys.name, communityName],
// 		queryFn: () => getCommunityByName(communityName),
// 		enabled: communityName.length > 0,
// 	});
// };

export function useCreateCommunity() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateCommunityRequest) =>
			axios.post("/communities", data),
		onSuccess: () => {
			toast("Community created successfully 🎉");
			queryClient.invalidateQueries({ queryKey: queryKeys.community.list() });
		},
		onError: (error: AppAxoisError) => {
			const message =
				error.response?.data?.message ||
				"Failed to create community. Please try again.";
			toast.error("Error creating community", {
				description: message,
			});
		},
	});
}

export function useUpdateCommunity(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateCommunityMetaDTO) =>
			axios.patch(`/communities/${id}`, data),
		onSuccess: () => {
			toast("Community updated successfully 🎉");

			queryClient.invalidateQueries({
				queryKey: queryKeys.community.detail(id),
				exact: true,
			});
		},
		onError: (error: AppAxoisError) => {
			const message =
				error.response?.data?.message ||
				"Failed to update community. Please try again.";
			toast.error("Error update community", {
				description: message,
			});
		},
	});
}

export function useFollowUnFollowCommunity(
	communityId: string,
	type: "follow" | "unfollow",
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => addCommunityWithDelay(communityId, type),
		onSuccess: () => {
			toast(`${type === "follow" ? "Following" : "Unfollowing"} Community 🎉`);

			queryClient.invalidateQueries({
				queryKey: queryKeys.permission.all,
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.community.detail(communityId),
			});
		},
		onError: (error: AppAxoisError) => {
			toast.error(`Error ${type} community`, {
				description: error.response?.data?.message || "Please try again.",
			});
		},
	});
}

export const useCommunityMembers = (
	communityId: string,
	communityRole: string,
	pageIndex: number,
	pageSize: number,
) => {
	const { isLogedIn } = useAuth();

	const params = {
		pageNumber: pageIndex,
		size: pageSize,
		role: communityRole,
	};

	return useQuery({
		enabled: isLogedIn,
		queryKey: queryKeys.community.memberships(communityId, params),
		staleTime: 5000,
		queryFn: () =>
			axios
				.get<CommunityMembershipDTOPage>(
					`/communities/${communityId}/members`,
					{
						params,
					},
				)
				.then(({ data }) => data),
	});
};

export const useCommunityInvites = (
	communityId: string,
	communityRole: string | undefined,
	pageIndex: number,
	pageSize: number,
) => {
	const { isLogedIn } = useAuth();

	const params = {
		pageNumber: pageIndex,
		size: pageSize,
		role: communityRole,
	};

	return useQuery({
		enabled: isLogedIn,
		queryKey: queryKeys.community.membershipsInvite(communityId, params),
		staleTime: 5000,
		queryFn: () =>
			axios
				.get<CommunityMembershipInviteDTOPage>(
					`/communities/${communityId}/invites`,
					{
						params,
					},
				)
				.then(({ data }) => data),
	});
};

export function usePost(communityId: string, postId: string) {
	return useQuery({
		queryKey: queryKeys.community.post(communityId, postId),
		queryFn: () => axios.get<Post>(`/posts/${postId}`).then(({ data }) => data),
		retry: false,
	});
}

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
				queryKey: queryKeys.community.feed(variable.communityId),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.feed.list(),
			});
		},
		onError: (error: AppAxoisError) => {
			const message =
				error.response?.data?.message ||
				"Failed to create post. Please try again.";
			toast.error("Error creating post", {
				description: message,
			});
		},
	});
}

export function useCommunityPosts(communityId: string) {
	return useQuery({
		queryKey: queryKeys.community.posts(communityId),
		queryFn: () =>
			axios
				.get<Post[]>(`/posts/communities/${communityId}`)
				.then(({ data }) => data),
	});
}

export function usePostLink(communityId: string, postId: string) {
	return useQuery({
		queryKey: queryKeys.community.postLinks(communityId, postId),
		queryFn: () =>
			axios
				.get<PostLink>(`/posts/${postId}/post-link`)
				.then(({ data }) => data),
	});
}

export function usePostRemove(communityId: string, postId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => axios.delete(`/posts/${postId}`),
		onSuccess: (_data) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.feed.all,
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.community.posts(communityId),
			});
			toast.info("Successfully Deleted post");
		},
		onError: () => {
			toast.error("Unable to delete Post");
		},
	});
}

export function useCreateComment(communityId: string, postId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateCommentRequest) =>
			axios.post(`/posts/${postId}/comment`, data),
		onSuccess: (_data) => {
			toast("Comment created successfully 🎉", {
				description: "Your comment has been published.",
			});

			queryClient.invalidateQueries({
				queryKey: queryKeys.community.comments(communityId, postId),
			});
		},
		onError: (error: AppAxoisError) => {
			const message =
				error.response?.data?.message ||
				"Failed to create comment. Please try again.";
			toast.error("Error creating comment", {
				description: message,
			});
		},
	});
}

export function usePostComment(
	communityId: string,
	postId: string,
	parentCommentId: string | null,
) {
	const { isLogedIn, isLoading } = useAuth();
	return useInfiniteQuery({
		enabled: isLogedIn && !isLoading,
		queryKey: queryKeys.community.postComment(
			communityId,
			postId,
			parentCommentId,
		),
		initialPageParam: 0,
		queryFn: async ({ pageParam }) =>
			axios
				.get<CommentDTOSlice>(`/posts/${postId}/comment`, {
					params: {
						pageNumber: pageParam,
						parentId: parentCommentId ?? undefined,
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

export function useVote(communityId: string, postId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, direction }: CreateVoteRequest) => {
			const strDirection = direction === 1 ? "up" : "down";
			if (id.postId) {
				return axios.post(`/posts/${id.postId}/vote/${strDirection}`);
			} else if (id.commentId) {
				return axios.post(`/comments/${id.commentId}/vote/${strDirection}`);
			} else {
				return Promise.reject(new Error("No postId or commentId provided"));
			}
		},
		onSuccess: (_data, { id }) => {
			toast("Vote submitted ✅", {
				description: "Your vote has been counted.",
			});

			if (id.postId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.community.post(communityId, id.postId),
				});
			}

			if (id.commentId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.community.postComment(
						communityId,
						postId,
						id.commentId,
					),
				});
			}
		},
		onError: (error: AppAxoisError) => {
			console.error(error);
			const message =
				error.response?.data?.message ||
				"Failed to submit vote. Please try again.";
			toast.error("Error voting", { description: message });
		},
	});
}
async function addCommunityWithDelay(
	communityId: string,
	type: "follow" | "unfollow",
) {
	try {
		const response = await axios.post(
			`/communities/${communityId}/${type}`,
			{},
		);

		// Wait 2 seconds before returning
		// await new Promise((resolve) => setTimeout(resolve, 3000));

		return response;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export const getCommunityByName = async (communityName: string) =>
	axios
		.get<Community>(`/communities/name/${communityName}`)
		.then(({ data }) => data)
		.catch(() => null);
