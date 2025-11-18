import { axios } from "@/lib/axios";
import { CreatePostRequest, Post, PostLink } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QueryKeys } from "./utils";

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
      queryClient.invalidateQueries({ queryKey: [QueryKeys.post] });
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
    queryKey: [QueryKeys.post],
    queryFn: async () => {
      const response = await axios.get<Post[]>("/posts", {
        withCredentials: true,
      });
      return response.data;
    },
  });
}

export function usePost(postId: string) {
  return useQuery({
    queryKey: [QueryKeys.post, postId],
    queryFn: async () => {
      const response = await axios.get<Post>(`/posts/${postId}`, {
        withCredentials: true,
      });
      return response.data;
    },
  });
}

export function usePostLink(postId: string) {
  return useQuery({
    queryKey: [QueryKeys.post, postId, QueryKeys.postLink],
    queryFn: async () => {
      const response = await axios.get<PostLink>(`/posts/${postId}/post-link`, {
        withCredentials: true,
      });
      return response.data;
    },
  });
}
