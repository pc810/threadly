import { isMacOS } from "@tiptap/core";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { Fragment, useId } from "react";
import { kwId } from "@/lib/utils";
import type { ShortcutKey } from "@/types/common";

type KeyboardShortcutProps = React.ComponentProps<"div"> & {
	keys: ShortcutKey[];
};

export const KeyboardShortcut = ({
	keys,
	className,
	...props
}: KeyboardShortcutProps) => {
	const baseId = useId();
	return (
		<div
			className={clsx("flex items-center gap-px text-xs", className)}
			{...props}
		>
			{keys.map((k, index) => {
				const isLast = index === keys.length - 1;
				return (
					<Fragment key={kwId(baseId, index)}>
						{getShortcutKeyIcon(k)}
						{!isLast && <Plus className="size-3" />}
					</Fragment>
				);
			})}
		</div>
	);
};

export function getShortcutKeyIcon(key: ShortcutKey) {
	switch (key) {
		case "ctrl":
			if (isMacOS()) {
				return "⌘";
			} else {
				return "Ctrl";
			}
		case "delete":
			return "Del";
		case "alt":
			if (isMacOS()) {
				return "⌥";
			} else {
				return "Alt";
			}
		case "shift":
			return "⇧";

		case "enter":
			return "Enter";
		case "backspace":
			return "⌫";
		default:
			return key.trim().toUpperCase();
	}
}
