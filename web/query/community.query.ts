import { axios } from "@/lib/axios";
import {
  Community,
  CommunityInviteAction,
  CommunityMembershipDTOPage,
  CommunityMembershipInviteDTO,
  CommunityMembershipInviteDTOPage,
  CreateCommunityRequest,
  InviteUserDTO,
} from "@/types/community";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isLogedIn, QueryKeys } from "./utils";
import { ResourceTypeEnum } from "@/types";
import { useAuth } from "./auth.query";

export const useCommunities = () => {
  return useQuery({
    queryKey: [QueryKeys.community],
    queryFn: async () => {
      const response = await axios.get<Community[]>("/communities/me");
      return response.data;
    },
  });
};

export const useCommunity = (communityId: string | undefined) => {
  return useQuery({
    enabled: communityId != null,
    queryKey: [QueryKeys.community, communityId],
    queryFn: async () => {
      const response = await axios.get<Community>(
        `/communities/${communityId}`
      );
      return response.data;
    },
  });
};

export const useHasCommunityInvite = (communityId: string | undefined) => {
  const auth = useAuth();
  return useQuery({
    enabled: communityId != null && isLogedIn(auth),
    queryKey: [
      QueryKeys.community,
      communityId,
      QueryKeys.membership,
      QueryKeys.invite,
      auth.data?.id,
    ],
    queryFn: async () => {
      const response = await axios.get<CommunityMembershipInviteDTO | null>(
        `/communities/${communityId}/invite`
      );
      return response.data;
    },
  });
};

export const useCommunityInvite = (communityId: string | undefined) => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  return useMutation({
    mutationKey: [
      QueryKeys.community,
      communityId,
      QueryKeys.invite,
      auth.data?.id,
    ],
    mutationFn: async (payload: InviteUserDTO) => {
      const response = await axios.post<void>(
        `/communities/${communityId}/invite`,
        payload,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      toast("Community Invitation sent successfully 🎉");

      queryClient.invalidateQueries({
        queryKey: [
          QueryKeys.community,
          communityId,
          QueryKeys.membership,
          QueryKeys.invite,
        ],
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

export const useCommunityInviteAction = (communityId: string | undefined) => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  return useMutation({
    mutationKey: [
      QueryKeys.community,
      communityId,
      QueryKeys.invite,
      auth.data?.id,
    ],
    mutationFn: async (action: CommunityInviteAction) => {
      const response = await axios.post<void>(
        `/communities/${communityId}/invite/${action}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (variables == "ACCEPT") {
        toast("Community joined successfully 🎉");
      } else {
        toast("Community invitation rejected successfully");
      }

      queryClient.invalidateQueries({
        queryKey: [
          QueryKeys.community,
          communityId,
          QueryKeys.membership,
          QueryKeys.invite,
        ],
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

export const useCommunityInviteRemove = (communityId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QueryKeys.community, communityId, QueryKeys.removeInvite],
    mutationFn: async (invite: CommunityMembershipInviteDTO) => {
      const response = await axios.delete<void>(
        `/communities/${invite.id.communityId}/invite/${invite.id.userId}`
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeys.community,
          communityId,
          QueryKeys.membership,
          QueryKeys.invite,
        ],
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

export const useCommunityByName = (communityName: string) => {
  return useQuery({
    queryKey: [QueryKeys.community, communityName],
    queryFn: () => getCommunityByName(communityName),
  });
};

export function useCreateCommunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommunityRequest) => {
      const response = await axios.post("/communities", data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast("Community created successfully 🎉");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.community] });
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

export function useFollowUnFollowCommunity(
  communityId: string,
  type: "follow" | "unfollow"
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => addCommunityWithDelay(communityId, type),
    onSuccess: () => {
      toast(`${type === "follow" ? "Following" : "Unfollowing"} Community 🎉`);

      queryClient.invalidateQueries({
        queryKey: [
          QueryKeys.permission,
          ResourceTypeEnum.COMMUNITY,
          communityId,
        ],
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
  pageSize: number
) => {
  const auth = useAuth();

  return useQuery({
    enabled: isLogedIn(auth),
    queryKey: [
      QueryKeys.community,
      communityId,
      QueryKeys.membership,
      communityRole,
      pageIndex,
      pageSize,
    ],
    staleTime: 5000,
    queryFn: async () => {
      const res = await axios.get<CommunityMembershipDTOPage>(
        `/communities/${communityId}/members`,
        {
          withCredentials: true,
          params: {
            pageNumber: pageIndex,
            size: pageSize,
            role: communityRole,
          },
        }
      );
      return res.data;
    },
  });
};

export const useCommunityInvites = (
  communityId: string,
  communityRole: string | undefined,
  pageIndex: number,
  pageSize: number
) => {
  const auth = useAuth();

  return useQuery({
    enabled: isLogedIn(auth),
    queryKey: [
      QueryKeys.community,
      communityId,
      QueryKeys.membership,
      QueryKeys.invite,
      communityRole ?? "all",
      pageIndex,
      pageSize,
    ],
    staleTime: 5000,
    queryFn: async () => {
      const res = await axios.get<CommunityMembershipInviteDTOPage>(
        `/communities/${communityId}/invites`,
        {
          withCredentials: true,
          params: {
            pageNumber: pageIndex,
            size: pageSize,
            role: communityRole,
          },
        }
      );
      return res.data;
    },
  });
};

async function addCommunityWithDelay(
  communityId: string,
  type: "follow" | "unfollow"
) {
  try {
    const response = await axios.post(
      `/communities/${communityId}/${type}`,
      {},
      { withCredentials: true }
    );

    // Wait 2 seconds before returning
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getCommunityByName = async (communityName: string) => {
  const response = await axios.get<Community>(
    `/communities/name/${communityName}`
  );
  return response.data;
};
