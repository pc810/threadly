import type { DialogProps } from "@radix-ui/react-dialog";

export type DialogActionProps = DialogProps & {
	onSuccess?: () => void;
	loading?: boolean;
};
