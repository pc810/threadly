import { useLoaderData, useMatchRoute } from "@tanstack/react-router";
import { CommunityEditForm } from "@/components/forms/community-edit";
import {
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/modal";
import { useUpdateCommunity } from "@/query/community";
import type { UpdateCommunityMetaDTO } from "@/types/community";

export const CommunityEdit = () => {
	const community = useLoaderData({ from: "/_app/r/$communityName" });

	const updateCommunityMutation = useUpdateCommunity(community.id);

	const { closeModal } = useModal();

	if (!community) return null;

	const handleSuccess = async (values: Partial<UpdateCommunityMetaDTO>) => {
		await updateCommunityMutation.mutateAsync(values);
		closeModal();
	};

	return (
		<DialogContent>
			<DialogTitle>Edit community details wid get</DialogTitle>
			<DialogDescription>
				Briefly describes your community and members. Always appears at the top
				of the sidebar.
			</DialogDescription>

			<CommunityEditForm defaultValues={community} onSuccess={handleSuccess} />
		</DialogContent>
	);
};
