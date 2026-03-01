import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Fragment } from "react";
import { CommunityDetailsWidget } from "@/components/community/details-widget";
import { AppLayout } from "@/components/layout/app-layout";
import { PostPage } from "@/components/post/page";
import { kwId } from "@/lib/utils";
import { usePost } from "@/query/community";

export const Route = createFileRoute("/_app/r/$communityName/comments/$postId")(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	const community = useLoaderData({ from: "/_app/r/$communityName" });

	const { postId } = Route.useParams();

	const { data: post } = usePost(community.id, postId);

	if (!post) return <div>loading</div>;

	return (
		<Fragment key={kwId("post-comment", postId)}>
			<AppLayout>
				<div>
					<PostPage post={post} community={community} />
				</div>
				<CommunityDetailsWidget communityId={community.id} />
			</AppLayout>
		</Fragment>
	);
}
