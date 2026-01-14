import {
	createContext,
	Fragment,
	type ReactNode,
	useEffect,
	useState,
} from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog } from "@/components/ui/dialog";
import { CommunityAdd } from "./community-add";
import { CommunityEdit } from "./community-edit";
import { Dummy } from "./dummy";

const MODALS = {
	CommunityAdd: { Component: CommunityAdd },
	CommunityEdit: { Component: CommunityEdit },
	Dummy: { Component: Dummy },
} as const;

type ModalKey = keyof typeof MODALS;

interface ModalContextValue {
	openModal: (key: ModalKey) => void;
	closeModal: () => void;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [open, setOpen] = useState(false);
	const [alertOpen, setAlertOpen] = useState(false);

	const [activeKey, setActiveKey] = useState<ModalKey | null>(null);
	const [nextKey, setNextKey] = useState<ModalKey | null>(null);

	useEffect(() => {
		if (!open && nextKey) {
			setActiveKey(nextKey);
			setNextKey(null);
			setOpen(true);
		}
	}, [open, nextKey]);

	const onOpenChange = (v: boolean) => {
		setOpen(v);
		if (!v) setNextKey(null);
	};

	const openModal = (key: ModalKey) => {
		if (open) {
			setAlertOpen(true);
			setNextKey(key);
		} else {
			setOpen(true);
			setActiveKey(key);
		}
	};

	const closeModal = () => {
		setOpen(false);
	};

	const handleAlertConfirm = () => {
		setAlertOpen(false);
		setOpen(false);
	};

	const Modal = (activeKey && MODALS[activeKey].Component) ?? Fragment;

	return (
		<ModalContext.Provider value={{ openModal, closeModal }}>
			{children}

			<Dialog open={open} onOpenChange={onOpenChange}>
				<Modal />
			</Dialog>

			<AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							Current changes will be lost
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleAlertConfirm}>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</ModalContext.Provider>
	);
};
