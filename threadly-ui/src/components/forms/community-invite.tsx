import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { UserCombobox } from "@/components/user/combobox";
import { COMMUNITY_ROLE, type InviteUserDTO } from "@/types/community";

export const CommunityInviteForm = ({
	onSuccess,
	isLoading,
}: {
	onSuccess: (payload: InviteUserDTO) => void;
	isLoading: boolean;
}) => {
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

	return (
		<>
			<UserCombobox
				value={selectedUserId}
				onChange={setSelectedUserId}
				options={{ excludeSelf: true }}
			/>
			<Button
				disabled={!selectedUserId}
				onClick={() =>
					selectedUserId &&
					onSuccess({ userId: selectedUserId, role: COMMUNITY_ROLE.MOD })
				}
			>
				{isLoading && <Spinner />}
				Invite
			</Button>
		</>
	);
};
