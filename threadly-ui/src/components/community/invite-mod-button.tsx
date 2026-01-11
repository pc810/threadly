import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
		<div className="flex items-center flex-wrap">
			<div className="self-center px-1">Mod Invite </div>
			<ButtonGroup>
				<Button
					variant="default"
					size="lg"
					className="rounded-full"
					onClick={() => invitationActionMutation.mutate("ACCEPT")}
				>
					Accept
				</Button>
				<Button
					variant="outline"
					className="rounded-full"
					size="lg"
					onClick={() => invitationActionMutation.mutate("REJECT")}
				>
					Reject
				</Button>
			</ButtonGroup>
		</div>
	);
};
