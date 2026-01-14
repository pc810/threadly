import type { DialogProps } from "@radix-ui/react-dialog";

export type DialogActionProps = DialogProps & {
	onSuccess?: () => void;
	loading?: boolean;
};

export type ShortcutKey =
	// Modifiers
	| "ctrl"
	| "meta" // Cmd on Mac
	| "shift"
	| "alt"
	// Special keys
	| "delete"
	| "backspace"
	| "enter"
	| "tab"
	| "escape"
	| "space"
	| "up"
	| "down"
	| "left"
	| "right"
	// Letters
	| "a"
	| "b"
	| "c"
	| "d"
	| "e"
	| "f"
	| "g"
	| "h"
	| "i"
	| "j"
	| "k"
	| "l"
	| "m"
	| "n"
	| "o"
	| "p"
	| "q"
	| "r"
	| "s"
	| "t"
	| "u"
	| "v"
	| "w"
	| "x"
	| "y"
	| "z"
	// Numbers
	| "0"
	| "1"
	| "2"
	| "3"
	| "4"
	| "5"
	| "6"
	| "7"
	| "8"
	| "9"
	// Function keys
	| "f1"
	| "f2"
	| "f3"
	| "f4"
	| "f5"
	| "f6"
	| "f7"
	| "f8"
	| "f9"
	| "f10"
	| "f11"
	| "f12";
