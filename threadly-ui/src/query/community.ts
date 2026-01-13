import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axios } from "@/lib/axios";

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
import type { Post, PostLink } from "@/types/post";
import { useAuth } from "./auth";
import { queryKeys } from "./keys";
import { isLogedIn } from "./utils";

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
	const auth = useAuth();
	return useQuery({
		enabled: communityId != null && isLogedIn(auth),
		queryKey: queryKeys.community.invitation(
			communityId,
			String(auth.data?.id),
		),
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
		},
		onError: (error: any) => {
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

			queryClient.invalidateQueries({
				queryKey: queryKeys.community.memberships(communityId),
			});
		},
		onError: (error: any) => {
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
		onError: (error: any) => {
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
		onError: (error: any) => {
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
		onError: (error: any) => {
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
				queryKey: queryKeys.permission.resource("COMMUNITY", communityId),
			});
		},
		onError: (error: any) => {
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
	const auth = useAuth();

	const params = {
		pageNumber: pageIndex,
		size: pageSize,
		role: communityRole,
	};

	return useQuery({
		enabled: isLogedIn(auth),
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
	const auth = useAuth();

	const params = {
		pageNumber: pageIndex,
		size: pageSize,
		role: communityRole,
	};

	return useQuery({
		enabled: isLogedIn(auth),
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
				queryKey: queryKeys.feed.list(),
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
