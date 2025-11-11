"use client";

import { Button } from "@/components/ui/button";
import { RichTextContent } from "@/components/ui/rich-text-editor";
import { usePosts } from "@/query/post.query";
import { Link2 } from "lucide-react";
import Link from "next/link";

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
          {post.type == "LINK" && (
            <Button variant="link" asChild>
              <Link href={post.link} className="flex gap-0.5 items-center">
                <Link2 />
                {post.link}
              </Link>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
