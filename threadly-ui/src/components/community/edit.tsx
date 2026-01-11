import { Edit } from "lucide-react";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Community } from "@/types/community";
import { CommunityEditForm } from "../forms/community-edit";
import { Button } from "../ui/button";

export const CommunityEdit = ({ community }: { community: Community }) => {
	const [open, setOpen] = useState(false);

	const handleOpenChange = (v: boolean) => {
		setOpen(v);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button size="icon-sm" variant="secondary">
					<Edit />
					<div className="sr-only">Edit community</div>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Edit community details wid get</DialogTitle>
				<DialogDescription>
					Briefly describes your community and members. Always appears at the
					top of the sidebar.
				</DialogDescription>

				{open && (
					<CommunityEditForm
						defaultValues={community}
						onSuccess={() => setOpen(false)}
						onClose={() => setOpen(false)}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};
