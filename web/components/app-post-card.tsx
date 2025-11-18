"use client";

import { AppPostLink } from "@/components/app-post-link";
import {
  RichTextContent,
  RichTextPreview,
} from "@/components/ui/rich-text-editor";
import { usePost } from "@/query/post.query";
import { Post } from "@/types";
import clsx from "clsx";
import { Skeleton } from "./ui/skeleton";
import { formatAgo } from "@/lib/date";
import { AppCommunity } from "@/components/app-community";

type PostIdProps = {
  postId: string;
};
type PostProps = {
  post: Post;
};

export const AppPostCard = ({ postId }: PostIdProps) => {
  const { data: post } = usePost(postId);

  //   return <PlaceholderCard />;
  if (!post) return <PlaceholderCard />;

  return (
    <PostCard className="space-y-2">
      <PostCardMeta post={post} />
      <PostCardTitle>{post.title}</PostCardTitle>
      <PostCardContent post={post} />
    </PostCard>
  );
};

const PostCardMeta = ({
  post,
  className,
  ...props
}: React.ComponentProps<"p"> & PostProps) => {
  return (
    <div
      className={clsx(
        "text-xs text-gray-500 flex items-center gap-1",
        className
      )}
      {...props}
    >
      <AppCommunity communityId={post.communityId} />
      <span>•</span>
      <time dateTime={post.createdAt}>{formatAgo(post.createdAt)}</time>
    </div>
  );
};

const PlaceholderCard = () => {
  return (
    <PostCard className="space-y-4">
      <PostCardTitle>
        <Skeleton className="h-5 w-1/3" />
      </PostCardTitle>
      <div className="text-sm text-gray-500">
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="aspect-square w-2/4" />
    </PostCard>
  );
};

const PostCard = ({ children, className }: React.ComponentProps<"div">) => {
  return (
    <div className={clsx("p-3 border rounded-xl", className)}>{children}</div>
  );
};
const PostCardTitle = ({ className, ...props }: React.ComponentProps<"h2">) => {
  return <h2 className={clsx("font-semibold text-lg", className)} {...props} />;
};
const PostCardContent = ({
  post,
  ...props
}: React.ComponentProps<"div"> & PostProps) => {
  return (
    <div {...props}>
      {post.type == "TEXT" && <RichTextPreview value={post.contentText} />}
      {post.type == "LINK" && <AppPostLink post={post} />}
    </div>
  );
};
