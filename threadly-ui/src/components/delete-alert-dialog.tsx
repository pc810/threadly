import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import type { DialogActionProps } from "@/types/common";

type DeleteAlertDialogProps = DialogActionProps & {
	title?: string;
	description?: string;
};

export const DeleteAlertDialog = ({
	onSuccess,
	loading,
	title,
	description,
	...props
}: DeleteAlertDialogProps) => (
	<Dialog {...props}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{title ?? "Confirm Delete"}</DialogTitle>
				<DialogDescription>
					{description ??
						"Are you sure you want to delete this item? This action cannot be undone."}
				</DialogDescription>
			</DialogHeader>
			<DialogFooter className="flex justify-end gap-2">
				<DialogClose>Cancel</DialogClose>
				<Button variant="destructive" onClick={onSuccess} disabled={loading}>
					{loading ? <Spinner /> : "Delete"}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
