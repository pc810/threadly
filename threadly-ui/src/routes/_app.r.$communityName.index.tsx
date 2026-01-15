import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { CommunityDetailsWidget } from "@/components/community/details-widget";
import { CommunityHeader } from "@/components/community/header";
import { AppLayout } from "@/components/layout/app-layout";
import { CommunityPostsList } from "@/components/post/feed";

export const Route = createFileRoute("/_app/r/$communityName/")({
	component: RouteComponent,
});

function RouteComponent() {
	const community = useLoaderData({ from: "/_app/r/$communityName" });
	return (
		<>
			<CommunityHeader communityId={community.id} />
			<AppLayout>
				<div>
					<CommunityPostsList communityId={community.id} />
				</div>
				<CommunityDetailsWidget communityId={community.id} />
			</AppLayout>
		</>
	);
}
