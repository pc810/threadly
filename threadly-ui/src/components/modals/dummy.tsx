import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export const Dummy = () => {
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Dummy Modal title</DialogTitle>
				<DialogDescription>Dummy Modal description</DialogDescription>
			</DialogHeader>
			<div>Dummy Modal working</div>
		</DialogContent>
	);
};
