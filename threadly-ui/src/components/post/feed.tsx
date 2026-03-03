import type {
	InfiniteData,
	UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getCommunityPostCreateLink } from "@/lib/format";
import {
	useCommunityFeed,
	useUserFeed,
	useUserProfileFeed,
} from "@/query/feed";
import type { PostFeedDTOSlice } from "@/types/feed";
import { PostCard } from "./card";

// export function PostFeed() {
// 	const {
// 		data: feed,
// 		isLoading,
// 		error,
// 		fetchNextPage,
// 		isFetchingNextPage,
// 		hasNextPage,
// 	} = useUserFeed();

// 	if (isLoading || feed == null) return <p>Loading...</p>;
// 	if (error) return <p>Failed to load posts</p>;

// 	const posts = feed?.pages.flatMap((page) => page.content) ?? [];

// 	return (
// 		<div className="space-y-4 my-4">
// 			{posts.map((postFeed) => (
// 				<PostCard
// 					key={postFeed.id}
// 					communityId={postFeed.communityId}
// 					postId={postFeed.postId}
// 				/>
// 			))}

// 			{hasNextPage && (
// 				<Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
// 					{isFetchingNextPage && <Skeleton />}
// 					Load more
// 				</Button>
// 			)}
// 		</div>
// 	);
// }

type PostFeedProviderProps = {
	query: UseInfiniteQueryResult<InfiniteData<PostFeedDTOSlice>>;
};

export function PostFeedProvider({ query }: PostFeedProviderProps) {
	const {
		data: feed,
		fetchNextPage,
		isFetchingNextPage,
		isLoading,
		hasNextPage,
	} = query;

	const matchRoute = useMatchRoute();

	const communityParams = matchRoute({ to: "/r/$communityName" });

	const posts = feed?.pages.flatMap((page) => page.content) ?? [];

	if (posts == null || isLoading) return <p>Loading...</p>;

	if (posts.length === 0)
		return communityParams ? (
			<PlaceHolderCommunityPostsList
				createLink={getCommunityPostCreateLink(communityParams.communityName)}
			/>
		) : (
			<PlaceHolderPostFeed />
		);

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
					{isFetchingNextPage && <Spinner />}
					Load more
				</Button>
			)}
		</div>
	);
}

export function UserFeed() {
	const userFeedQuery = useUserFeed();
	return <PostFeedProvider query={userFeedQuery} />;
}

export function CommunityPostsList({ communityId }: { communityId: string }) {
	const communityFeedQuery = useCommunityFeed(communityId);

	return <PostFeedProvider query={communityFeedQuery} />;
}

export function UserProfilePostsFeed({ userId }: { userId: string }) {
	const userProfileFeedQuery = useUserProfileFeed(userId);

	return <PostFeedProvider query={userProfileFeedQuery} />;
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

const PlaceHolderPostFeed = () => {
	return (
		<div className="gap-2 flex-col flex mx-auto max-w-lg text-center items-center py-30">
			<h1 className="text-2xl font-bold">No Posts available</h1>
		</div>
	);
};
