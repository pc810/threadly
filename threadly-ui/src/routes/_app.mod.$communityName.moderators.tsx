import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { AppPageTitle } from "@/components/app-layout";
import { CommunityMembersTable } from "@/components/community/members-table";
import { CommunityModInvite } from "@/components/community/mod-invite";
import { CommunityMembersTabs } from "@/components/community/mod-members";
import { COMMUNITY_ROLE } from "@/types/community";

export const Route = createFileRoute("/_app/mod/$communityName/moderators")({
	component: RouteComponent,
});

function RouteComponent() {
	const { communityName } = Route.useParams();

	const community = useLoaderData({ from: "/_app/mod/$communityName" });

	return (
		<div>
			<AppPageTitle>Mods & Members</AppPageTitle>
			<CommunityMembersTabs
				defaultValue="moderators"
				communityName={communityName}
			/>
			<div className="flex justify-end w-full mb-4">
				<CommunityModInvite community={community} />
			</div>
			<CommunityMembersTable
				communityId={community.id}
				communityRole={COMMUNITY_ROLE.MOD}
			/>
		</div>
	);
}
