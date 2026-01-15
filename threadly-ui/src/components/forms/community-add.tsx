import { formOptions, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAppForm, withForm } from "@/hooks/form";
import { useModal } from "@/hooks/modal";
import { COMMUNITY_TOPICS, COMMUNITY_VISIBILITY } from "@/lib/label";
import {
	CommunityTopic,
	CommunityVisibility,
	type CreateCommunityRequest,
	createCommunityRequestSchema,
} from "@/types/community";

const topicStepSchema = createCommunityRequestSchema.pick({
	topic: true,
});
const metaStepSchema = createCommunityRequestSchema.pick({
	visibility: true,
	isNsfw: true,
});
const aboutStepSchema = createCommunityRequestSchema.pick({
	name: true,
	title: true,
	description: true,
});
const communityAddFormValueSchema = z.object({
	step: z.enum(["topic", "meta", "about"]),

	...topicStepSchema.shape,
	...metaStepSchema.shape,
	...aboutStepSchema.shape,
});
type CommunityAddFormValue = z.infer<typeof communityAddFormValueSchema>;

const defaultValues: Partial<CommunityAddFormValue> = {
	step: "topic",
	topic: CommunityTopic.GAMES,
	visibility: CommunityVisibility.PUBLIC,
	isNsfw: false,
	name: "",
	title: "",
	description: "",
};

const communityAddFormOptions = formOptions({
	defaultValues,
	validators: {
		onSubmit: ({ formApi, value }) => {
			if (value.step === "topic")
				return formApi.parseValuesWithSchema(topicStepSchema);
			else if (value.step === "meta")
				return formApi.parseValuesWithSchema(metaStepSchema);
			else if (value.step === "about")
				return formApi.parseValuesWithSchema(createCommunityRequestSchema);
		},
	},
});

export const CommunityAddForm = ({
	onSuccess,
}: {
	onSuccess?: (values: CreateCommunityRequest) => Promise<void>;
	isLoading?: boolean;
}) => {
	const { closeModal } = useModal();

	const form = useAppForm({
		...communityAddFormOptions,
		onSubmit: async ({ value, formApi }) => {
			if (value.step === "topic") formApi.setFieldValue("step", "meta");
			else if (value.step === "meta") formApi.setFieldValue("step", "about");
			else if (value.step === "about") {
				toast.info("submitted form");
				console.log(value);
				await onSuccess?.(createCommunityRequestSchema.parse(value));
			}
		},
	});

	const step = useStore(form.store, (state) => state.values.step);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			{step === "topic" && (
				<DialogHeader>
					<DialogTitle>What will your community be about?</DialogTitle>
					<DialogDescription>
						Choose a topic to help other discover your community
					</DialogDescription>
				</DialogHeader>
			)}
			{step === "meta" && (
				<DialogHeader>
					<DialogTitle>What kind of community is this?</DialogTitle>
					<DialogDescription>
						Decide who can view and contribute in your community. Only public
						communities show up in search. Important: Once set, you will need to
						submit a request to change your community type.
					</DialogDescription>
				</DialogHeader>
			)}
			{step === "about" && (
				<DialogHeader>
					<DialogTitle>Tell us about your community</DialogTitle>
					<DialogDescription>
						A name and description help people understand what your community is
						all about.
					</DialogDescription>
				</DialogHeader>
			)}
			<div className="space-y-4 py-4">
				{step === "topic" && <TopicStep form={form} />}
				{step === "meta" && <MetaStep form={form} />}
				{step === "about" && <AboutStep form={form} />}
			</div>
			<DialogFooter>
				<Button
					type="button"
					variant="secondary"
					onClick={(e) => {
						e.preventDefault();
						if (step === "topic") {
							closeModal();
						} else if (step === "meta") {
							form.setFieldValue("step", "topic");
						} else if (step === "about") {
							form.setFieldValue("step", "meta");
						}
					}}
				>
					{step === "topic" ? "Reset" : "Back"}
				</Button>

				{step === "topic" || step === "meta" ? (
					<Button>Next</Button>
				) : (
					<form.AppForm>
						<form.SubscribeButton label="Create Community" className="w-full" />
					</form.AppForm>
				)}
			</DialogFooter>
		</form>
	);
};

const TopicStep = withForm({
	...communityAddFormOptions,
	render: function Render({ form }) {
		return (
			<form.AppField name="topic">
				{(field) => (
					<field.Select
						values={Object.entries(COMMUNITY_TOPICS).map(([_, topic]) => ({
							label: `${topic.icon} ${topic.label}`,
							value: topic.value,
						}))}
						label="Topic"
					/>
				)}
			</form.AppField>
		);
	},
});

const MetaStep = withForm({
	...communityAddFormOptions,
	render: function Render({ form }) {
		return (
			<>
				<form.AppField name="visibility">
					{(field) => (
						<field.Select values={COMMUNITY_VISIBILITY} label="Visibility" />
					)}
				</form.AppField>
				<form.AppField name="isNsfw">
					{(field) => <field.Checkbox label="Mark as NSFW (18+)" />}
				</form.AppField>
			</>
		);
	},
});

const AboutStep = withForm({
	...communityAddFormOptions,
	render: function Render({ form }) {
		return (
			<>
				<form.AppField name="name">
					{(field) => <field.TextField label="Name" />}
				</form.AppField>
				<form.AppField name="title">
					{(field) => <field.TextField label="Title" />}
				</form.AppField>
				<form.AppField name="description">
					{(field) => <field.TextArea label="Description" />}
				</form.AppField>
			</>
		);
	},
});
