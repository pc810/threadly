"use client";

import { AppPostCard } from "@/components/app-post-card";
import { usePosts } from "@/query/post.query";

export function AppPostList() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load posts</p>;

  return (
    <div className="space-y-4 my-4">
      {posts?.map((post) => (
        <AppPostCard key={post.id} postId={post.id} />
      ))}
    </div>
  );
}
