import { Plus } from "lucide-react";
import { useState } from "react";
import { CommunityInviteForm } from "@/components/forms/community-invite";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useCommunityInvite } from "@/query/community";
import type { Community, InviteUserDTO } from "@/types/community";

export const CommunityModInvite = ({ community }: { community: Community }) => {
	const [open, setOpen] = useState(false);

	const handleOpenChange = (v: boolean) => {
		setOpen(v);
	};
	const { mutateAsync: inviteUserToCommunity, isPending } = useCommunityInvite(
		community.id,
	);

	const handleInviteUser = async (payload: InviteUserDTO) => {
		await inviteUserToCommunity(payload);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button size="lg" onClick={() => setOpen(true)} disabled={isPending}>
					<Plus /> Invite Mod
				</Button>
			</DialogTrigger>
			<DialogContent
				className="md:w-sm"
				onOpenAutoFocus={(e) => e.preventDefault()}
				onInteractOutside={(e) => e.preventDefault()}
			>
				<DialogTitle>Invite Mod</DialogTitle>
				<DialogDescription>
					Invite users for mod role in your community
				</DialogDescription>

				<CommunityInviteForm
					isLoading={isPending}
					onSuccess={handleInviteUser}
				/>
			</DialogContent>
		</Dialog>
	);
};
