import { createFormHook } from "@tanstack/react-form";

import {
	Checkbox,
	CommunityCombobox,
	ResetButton,
	RichTextEditor,
	Select,
	SubscribeButton,
	TextArea,
	TextField,
} from "@/components/form-components";
import { fieldContext, formContext } from "@/hooks/form-context";

export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		Checkbox,
		CommunityCombobox,
		RichTextEditor,
		Select,
		TextArea,
		TextField,
	},
	formComponents: {
		SubscribeButton,
		ResetButton,
	},
	fieldContext,
	formContext,
});
