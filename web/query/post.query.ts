import { axios } from "@/lib/axios";
import { Post } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type CreatePostRequest = {
  title: string;
  type: string;
  link: string;
  contentJson: string;
  contentHtml: string;
  contentText: string;
  communityId: string;
};

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostRequest) => {
      const response = await axios.post("/posts", data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast("Post created successfully 🎉", {
        description: "Your post has been published.",
      });
      // Invalidate or refresh related post queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await axios.get<Post[]>("/posts", {
        withCredentials: true,
      });
      return response.data;
    },
  });
}
