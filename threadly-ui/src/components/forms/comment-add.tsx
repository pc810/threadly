import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useAppForm } from "@/hooks/form";
import { useAuth } from "@/query/auth";
import { useCreateComment } from "@/query/community";
import { Button } from "../ui/button";

type CommentFormValues = {
	content: {
		json: string;
		text: string;
		html: string;
	};
};

const defaultValues: CommentFormValues = {
	content: {
		json: JSON.stringify({
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [],
				},
			],
		}),
		text: "",
		html: "",
	},
};

export type CommentAddFormHandle = {
	focus: () => void;
	isReady: () => boolean;
};
type CommentAddFormProps = {
	communityId: string;
	postId: string;
	parentId: string | null;
	depth: number;

	onCancel?: () => void;
};

export const CommentAddForm = forwardRef<
	CommentAddFormHandle,
	CommentAddFormProps
>(({ communityId, postId, parentId, depth, onCancel }, ref) => {
	const { auth } = useAuth();
	const createCommentMutation = useCreateComment(communityId, postId);

	const form = useAppForm({
		defaultValues,
		onSubmit: async ({ value }) => {
			await createCommentMutation.mutateAsync({
				contentJson: JSON.parse(value.content.json ?? "{}"),
				contentText: value.content.text ?? "",
				contentHtml: value.content.html ?? "",
				parentId: parentId ?? undefined,
				depth,
				communityId,
				postId,
				actorId: auth?.id ?? "",
			});

			form.reset();
		},
	});

	return (
		<form
			className="space-y-4"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.AppField name="content">
				{(field) => (
					<field.RichTextEditor
						ref={ref}
						label=""
						variant="inline"
						// placeholder="Write your comment..."
					/>
				)}
			</form.AppField>

			<form.AppForm>
				<div className="justify-end gap-4 flex">
					<Button variant="secondary" type="button" onClick={onCancel}>
						Cancel
					</Button>
					<form.SubscribeButton label="Comment" />
				</div>
			</form.AppForm>
		</form>
	);
});
