import { Edit } from "lucide-react";
import { AppWidgetLayout } from "@/components/app-layout";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useModal } from "@/hooks/modal";
import { useCommunity } from "@/query/community";
import { usePermission } from "@/query/permission";
import type { Community } from "@/types/community";
import { CommunityEdit } from "../modals/community-edit";
import { Button } from "../ui/button";
import { CommunityStatsList } from "./stats-list";

export const CommunityDetailsWidget = ({
	communityId,
}: {
	communityId: Community["id"];
}) => {
	const { openModal } = useModal();
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
							<Button
								size="icon-sm"
								variant="secondary"
								onClick={() => openModal("CommunityEdit")}
							>
								<Edit />
								<div className="sr-only">Edit community</div>
							</Button>
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
