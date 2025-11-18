import { axios } from "@/lib/axios";
import { Community, CreateCommunityRequest } from "@/types/community";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QueryKeys } from "./utils";

export const useCommunities = () => {
  return useQuery({
    queryKey: [QueryKeys.community],
    queryFn: async () => {
      const response = await axios.get<Community[]>("/communities");
      return response.data;
    },
  });
};

export const useCommunity = (communityId: string) => {
  return useQuery({
    queryKey: [QueryKeys.community, communityId],
    queryFn: async () => {
      const response = await axios.get<Community>(
        `/communities/${communityId}`
      );
      return response.data;
    },
  });
};

export const useCommunityByName = (communityName: string) => {
  return useQuery({
    queryKey: [QueryKeys.community, communityName],
    queryFn: async () => {
      const response = await axios.get<Community>(
        `/communities/name/${communityName}`
      );
      return response.data;
    },
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
