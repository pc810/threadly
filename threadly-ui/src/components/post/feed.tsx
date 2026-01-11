import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCommunityPostCreateLink } from "@/lib/format";
import { useCommunity, useCommunityPosts } from "@/query/community";
import { useUserFeed } from "@/query/feed";
import { PostCard } from "./card";

export function PostFeed() {
	const {
		data: feed,
		isLoading,
		error,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useUserFeed();

	if (isLoading || feed == null) return <p>Loading...</p>;
	if (error) return <p>Failed to load posts</p>;

	const posts = feed?.pages.flatMap((page) => page.content) ?? [];

	return (
		<div className="space-y-4 my-4">
			{posts.map((postFeed) => (
				<PostCard
					key={postFeed.id}
					communityId={postFeed.communityId}
					postId={postFeed.postId}
				/>
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

export function CommunityPostsList({ communityId }: { communityId: string }) {
	const { data: community } = useCommunity(communityId);

	const { data: posts, isLoading, error } = useCommunityPosts(communityId);

	if (community == null || posts == null || isLoading) return <p>Loading...</p>;
	if (error) return <p>Failed to load posts</p>;

	if (posts.length === 0)
		return (
			<PlaceHolderCommunityPostsList
				createLink={getCommunityPostCreateLink(community.name)}
			/>
		);

	return (
		<div className="space-y-4 my-4">
			{posts?.map((post) => (
				<PostCard
					key={post.id}
					communityId={post.communityId}
					postId={post.id}
				/>
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
				<Link to={createLink}>Create Post</Link>
			</Button>
		</div>
	);
};
