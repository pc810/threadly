"use client";

import { AppPostCard } from "@/components/app-post-card";
import { useCommunity } from "@/query/community.query";
import { useCommunityPosts, usePosts } from "@/query/post.query";
import { Button } from "./ui/button";
import Link from "next/link";
import { getCommunityPostCreateLink } from "@/lib/format";
import { useUserPostFeed } from "@/query/post-feed.query";
import { Skeleton } from "./ui/skeleton";

export function AppPostList() {
  const {
    data: feed,
    isLoading,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useUserPostFeed();

  if (isLoading || feed == null) return <p>Loading...</p>;
  if (error) return <p>Failed to load posts</p>;

  const posts = feed?.pages.flatMap((page) => page.content) ?? [];

  return (
    <div className="space-y-4 my-4">
      {posts.map((postFeed) => (
        <AppPostCard key={postFeed.id} postId={postFeed.postId} />
      ))}

      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage && <Skeleton />}
          Load more
        </Button>
      )}
    </div>
  );
}

export function AppCommunityPostsList({
  communityName,
}: {
  communityName?: string;
}) {
  const { data: community } = useCommunity(communityName);

  const {
    data: posts,
    isLoading,
    error,
  } = useCommunityPosts(community?.id ?? null);

  if (community == null || posts == null || isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load posts</p>;

  if (posts.length == 0)
    return (
      <PlaceHolderCommunityPostsList
        createLink={getCommunityPostCreateLink(community.name)}
      />
    );

  return (
    <div className="space-y-4 my-4">
      {posts?.map((post) => (
        <AppPostCard key={post.id} postId={post.id} />
      ))}
    </div>
  );
}

const PlaceHolderCommunityPostsList = ({
  createLink,
}: {
  createLink: string;
}) => {
  return (
    <div className="gap-2 flex-col flex mx-auto max-w-lg text-center items-center py-30">
      <h1 className="text-2xl font-bold">
        This community doesn&apos;t have any posts yet
      </h1>
      <p>Make one and get this feed started.</p>
      <Button className="mt-4 max-w-max rounded-full" asChild>
        <Link href={createLink}>Create Post</Link>
      </Button>
    </div>
  );
};
