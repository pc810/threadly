import { useStore } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useAppForm } from "@/hooks/form";
import { useCommunity } from "@/query/community";
import { useCreatePost } from "@/query/feed";
import { type PostFormValues, postFormSchema } from "@/types/post";

const defaultValues: PostFormValues = {
	community: "",
	type: "text",
	title: "",
	media: [],
	link: "",
	content: {
		json: JSON.stringify({
			json: {
				type: "doc",
				content: [
					{
						type: "paragraph",
						content: [
							{ text: "user1personal1 ", type: "text" },
							{ text: "post1", type: "text", marks: [{ type: "bold" }] },
						],
					},
				],
			},
		}),
		text: "user1personal1 post1",
		html: "<p>user1personal1 <strong>post1</strong></p>",
	},
};

export const PostAddForm = ({ communityId }: { communityId: string }) => {
	const navigate = useNavigate();

	const createPostMutation = useCreatePost();

	const form = useAppForm({
		defaultValues: {
			...defaultValues,
			community: communityId,
		},
		onSubmit: async ({ value }) => {
			await createPostMutation
				.mutateAsync({
					title: value.title,
					type: value.type.toUpperCase(),
					link: value.link ?? "",
					contentJson: JSON.parse(value.content.json ?? "{}"),
					contentText: value.content.text ?? "",
					contentHtml: value.content.html ?? "",
					communityId: value.community,
				})
				.then(() => form.reset());
		},
		validators: {
			onChange: postFormSchema,
		},
	});

	const selectedCommunityId = useStore(
		form.store,
		(state) => state.values.community,
	);

	const { data: selectedCommunity, isLoading: isLoadingSelectedCommunity } =
		useCommunity(selectedCommunityId);

	useEffect(() => {
		if (form.getFieldValue("community") !== communityId)
			form.setFieldValue("community", communityId);
	}, [communityId, form.setFieldValue, form.getFieldValue]);

	useEffect(() => {
		if (isLoadingSelectedCommunity) return;

		if (selectedCommunity)
			navigate({
				to: "/r/$communityName/submit",
				params: { communityName: selectedCommunity.name },
			});
	}, [selectedCommunity, isLoadingSelectedCommunity, navigate]);

	return (
		<form
			className="space-y-5"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.AppField name="community">
				{(field) => <field.CommunityCombobox label="Title" />}
			</form.AppField>
			<form.AppField name="title">
				{(field) => (
					<field.TextField label="Title" placeholder="Enter a title..." />
				)}
			</form.AppField>
			<form.AppField name="type">
				{(field) => (
					<field.Select
						label="Post Type"
						values={[
							{ label: "Text", value: "text" },
							{ label: "Images & Video", value: "media" },
							{ label: "Link", value: "link" },
						]}
						placeholder="Select post type"
					/>
				)}
			</form.AppField>
			<form.Subscribe selector={(state) => [state.values.type]}>
				{([selectedType]) => {
					if (selectedType === "text")
						return (
							<form.AppField name="content">
								{(field) => <field.RichTextEditor label="Content" />}
							</form.AppField>
						);
					if (selectedType === "link")
						return (
							<form.AppField name="link">
								{(field) => (
									<field.TextField label="Link (https://example.com)" />
								)}
							</form.AppField>
						);

					if (selectedType === "media") return <Badge>Not Supported Yet</Badge>;
					return null;
				}}
			</form.Subscribe>
			<form.AppForm>
				<form.SubscribeButton label="Post" className="w-full" />
			</form.AppForm>
		</form>
	);
};
