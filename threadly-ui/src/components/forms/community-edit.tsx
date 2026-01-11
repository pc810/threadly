import { useAppForm } from "@/hooks/form";
import { pickDirtyValues } from "@/lib/utils";
import { useUpdateCommunity } from "@/query/community";
import { type Community, updateCommunityFormSchema } from "@/types/community";

export const CommunityEditForm = ({
	defaultValues,
	onSuccess,
	onClose,
}: {
	defaultValues: Community;
	onSuccess: () => void;
	onClose: () => void;
}) => {
	const updateCommunityMutation = useUpdateCommunity(defaultValues.id);

	const form = useAppForm({
		defaultValues: {
			title: defaultValues.title,
			description: defaultValues.description,
			isNsfw: defaultValues.nsfw,
		},
		onSubmit: async ({ value, formApi }) => {
			const dirty = pickDirtyValues(value, formApi);
			try {
				await updateCommunityMutation.mutateAsync(dirty);
				onSuccess();
			} catch (error) {
				onClose();
			}
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
