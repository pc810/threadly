import { DialogContent } from "@/components/ui/dialog";
import { useModal } from "@/hooks/modal";
import { useCreateCommunity } from "@/query/community";
import type { CreateCommunityRequest } from "@/types/community";
import { CommunityAddForm } from "../forms/community-add";

export const CommunityAdd = () => {
	const { closeModal } = useModal();

	const createCommunityMutation = useCreateCommunity();

	const handleSuccess = async (payload: CreateCommunityRequest) => {
		await createCommunityMutation.mutateAsync(payload);
		closeModal();
	};

	return (
		<DialogContent>
			<CommunityAddForm
				onSuccess={handleSuccess}
				isLoading={createCommunityMutation.isPending}
			/>
		</DialogContent>
	);
};
