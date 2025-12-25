import { axios } from "@/lib/axios";
import {
  Community,
  CommunityMembershipDTOPage,
  CreateCommunityRequest,
} from "@/types/community";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QueryKeys } from "./utils";
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
    queryKey: [QueryKeys.community, communityId],
    queryFn: async () => {
      const response = await axios.get<Community>(
        `/communities/${communityId}`
      );
      return response.data;
    },
    enabled: communityId != null,
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
  pageIndex: number,
  pageSize: number
) => {
  const auth = useAuth();

  return useQuery({
    enabled: !!auth,
    queryKey: [
      QueryKeys.community,
      communityId,
      QueryKeys.membership,
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
            role: "MEMBER",
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
