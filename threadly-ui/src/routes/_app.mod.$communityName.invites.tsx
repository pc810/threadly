import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { CommunityInvitesTable } from "@/components/community/mod/invites-table";
import { CommunityMembersTabs } from "@/components/community/mod-members";
import { AppPageTitle } from "@/components/layout/app-layout";

export const Route = createFileRoute("/_app/mod/$communityName/invites")({
	component: RouteComponent,
});

function RouteComponent() {
	const { communityName } = Route.useParams();

	const community = useLoaderData({ from: "/_app/mod/$communityName" });

	return (
		<div>
			<AppPageTitle>Mods & Members</AppPageTitle>
			<CommunityMembersTabs
				defaultValue="invites"
				communityName={communityName}
			/>

			<CommunityInvitesTable communityId={community.id} className="mt-4" />
		</div>
	);
}
