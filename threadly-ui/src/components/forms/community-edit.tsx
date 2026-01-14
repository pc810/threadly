import { useAppForm } from "@/hooks/form";
import { pickDirtyValues } from "@/lib/utils";
import {
	type Community,
	type UpdateCommunityMetaDTO,
	updateCommunityFormSchema,
} from "@/types/community";

export const CommunityEditForm = ({
	defaultValues,
	onSuccess,
}: {
	defaultValues: Community;
	onSuccess?: (values: Partial<UpdateCommunityMetaDTO>) => Promise<void>;
}) => {
	const form = useAppForm({
		defaultValues: {
			title: defaultValues.title,
			description: defaultValues.description,
			isNsfw: defaultValues.nsfw,
		},
		onSubmit: async ({ value, formApi }) => {
			const dirty = pickDirtyValues(value, formApi);
			await onSuccess?.(dirty);
		},
		validators: {
			onChange: updateCommunityFormSchema,
		},
	});

	return (
		<form
			className="space-y-5"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.AppField name="title">
				{(field) => (
					<field.TextField label="Title" placeholder="Enter a title..." />
				)}
			</form.AppField>
			<form.AppField name="description">
				{(field) => (
					<field.TextArea
						label="Description"
						placeholder="Describe your community..."
						className="min-h-25"
					/>
				)}
			</form.AppField>
			<form.AppField name="isNsfw">
				{(field) => <field.Checkbox label="Mark as NSFW (18+)" />}
			</form.AppField>

			<form.AppForm>
				<form.SubscribeButton label="Update" className="w-full" />
			</form.AppForm>
		</form>
	);
};
