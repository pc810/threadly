"use client";

import { AppPostLink } from "@/components/app-post-link";
import { RichTextContent } from "@/components/ui/rich-text-editor";
import { usePosts } from "@/query/post.query";

export function PostList() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load posts</p>;

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <div key={post.id} className="p-4 border rounded-xl">
          <h2 className="font-semibold text-lg">{post.title}</h2>
          <p className="text-sm text-gray-500">
            {post.type} • {new Date(post.createdAt).toLocaleString()}
          </p>
          {post.type == "TEXT" && <RichTextContent value={post.contentJson} />}
          {post.type == "LINK" && <AppPostLink post={post} />}
        </div>
      ))}
    </div>
  );
}
