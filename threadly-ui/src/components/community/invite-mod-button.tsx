import { Button } from "@/components/ui/button";
import {
	useCommunityInviteAction,
	useHasCommunityInvite,
} from "@/query/community";
import type { Community } from "@/types/community";

type CommunityButtonProps = {
	communityId: Community["id"];
};

export const InviteModButton = (props: CommunityButtonProps) => {
	const { isLoading, data: hasInvite } = useHasCommunityInvite(
		props.communityId,
	);

	const invitationActionMutation = useCommunityInviteAction(props.communityId);

	if (isLoading || !hasInvite) return null;

	return (
		<div className="flex items-center gap-2 h-10 rounded-full bg-background dark:bg-input/30 px-3 py-1.5 text-sm border shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input">
			<span className="text-muted-foreground whitespace-nowrap">
				Mod invite
			</span>

			<Button
				size="sm"
				className="h-7 rounded-full px-3"
				onClick={() => invitationActionMutation.mutate("ACCEPT")}
			>
				Accept
			</Button>

			<Button
				size="sm"
				variant="ghost"
				className="h-7 rounded-full px-3"
				onClick={() => invitationActionMutation.mutate("REJECT")}
			>
				Decline
			</Button>
		</div>
	);
};
