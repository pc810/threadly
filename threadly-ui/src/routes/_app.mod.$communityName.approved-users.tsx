import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { AppPageTitle } from "@/components/app-layout";
import { CommunityMembersTable } from "@/components/community/members-table";
import { CommunityMembersTabs } from "@/components/community/mod-members";
import { COMMUNITY_ROLE } from "@/types/community";

export const Route = createFileRoute("/_app/mod/$communityName/approved-users")(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	const { communityName } = Route.useParams();

	const community = useLoaderData({ from: "/_app/mod/$communityName" });

	return (
		<div>
			<AppPageTitle>Mods & Members</AppPageTitle>
			<CommunityMembersTabs
				defaultValue="approved-users"
				communityName={communityName}
			/>
			<p className="text-muted-foreground py-4 text-sm">
				Approved users are trusted members in your community. Depending on your
				community setup, approved users would not be filtered by certain
				restrictions in case you set them up.
			</p>

			<CommunityMembersTable
				communityId={community.id}
				communityRole={COMMUNITY_ROLE.MEMBER}
			/>
		</div>
	);
}
