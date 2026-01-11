import { AppWidgetLayout } from "@/components/app-layout";
import { CommunityEditForm } from "@/components/forms/community-edit";
import { useCommunity } from "@/query/community";
import { usePermission } from "@/query/permission";
import type { Community } from "@/types/community";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { CommunityEdit } from "./edit";
import { CommunityStatsList } from "./stats-list";

export const CommunityDetailsWidget = ({
	communityId,
}: {
	communityId: Community["id"];
}) => {
	const { data: community } = useCommunity(communityId);

	const { UPDATE: canUpdateCommunity, isLoading } = usePermission(
		"COMMUNITY",
		communityId,
		["UPDATE"],
		"latency",
	);

	if (!community) return <Skeleton className="w-full h-5" />;
	return (
		<AppWidgetLayout>
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>{community.title}</CardTitle>
						{!isLoading && canUpdateCommunity && (
							<CommunityEdit community={community} />
						)}
					</div>
					<CardDescription>{community.description}</CardDescription>
				</CardHeader>

				<CardContent>
					<CommunityStatsList community={community} />
				</CardContent>
			</Card>
		</AppWidgetLayout>
	);
};
