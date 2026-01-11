import { useStore } from "@tanstack/react-form";
import { CommunityCombobox as AppCommunityCombobox } from "@/components/community/combobox";
import {
	RichTextEditor as AppRichTextEditor,
	EditorContentFormats,
} from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import * as ShadcnSelect from "@/components/ui/select";
import { Slider as ShadcnSlider } from "@/components/ui/slider";
import { Switch as ShadcnSwitch } from "@/components/ui/switch";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { useFieldContext, useFormContext } from "@/hooks/form-context";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Spinner } from "./ui/spinner";

export function SubscribeButton({
	label,
	...props
}: { label: string } & React.ComponentProps<"button">) {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
			{([canSubmit, isSubmitting]) => (
				<Button {...props} type="submit" disabled={!canSubmit}>
					{isSubmitting && <Spinner />}
					{label}
				</Button>
			)}
		</form.Subscribe>
	);
}

export function ResetButton({
	label = "Reset",
	...props
}: { label: string } & React.ComponentProps<"button">) {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button
					{...props}
					type="reset"
					onClick={() => form.reset()}
					disabled={isSubmitting}
				>
					{label}
				</Button>
			)}
		</form.Subscribe>
	);
}

function ErrorMessages({
	errors,
}: {
	errors: Array<string | { message: string }>;
}) {
	return (
		<>
			{errors.map((error) => (
				<FieldError
					className="text-xs"
					key={typeof error === "string" ? error : error.message}
				>
					{typeof error === "string" ? error : error.message}
				</FieldError>
			))}
		</>
	);
}

export function TextField({
	label,
	...props
}: {
	label: string;
} & React.ComponentProps<"input">) {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<Field>
			<FieldLabel htmlFor={label}>{label}</FieldLabel>
			<Input
				{...props}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</Field>
	);
}

export function TextArea({
	label,
	rows = 3,
	...props
}: {
	label: string;
} & React.ComponentProps<"textarea">) {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<Field>
			<FieldLabel htmlFor={label}>{label}</FieldLabel>
			<ShadcnTextarea
				{...props}
				id={label}
				value={field.state.value}
				onBlur={field.handleBlur}
				rows={rows}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</Field>
	);
}

export function Select({
	label,
	values,
	placeholder,
}: {
	label: string;
	values: Array<{ label: string; value: string }>;
	placeholder?: string;
}) {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<Field>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			<ShadcnSelect.Select
				name={field.name}
				value={field.state.value}
				onValueChange={(value) => field.handleChange(value)}
			>
				<ShadcnSelect.SelectTrigger className="w-full">
					<ShadcnSelect.SelectValue placeholder={placeholder} />
				</ShadcnSelect.SelectTrigger>
				<ShadcnSelect.SelectContent>
					<ShadcnSelect.SelectGroup>
						<ShadcnSelect.SelectLabel>{label}</ShadcnSelect.SelectLabel>
						{values.map((value) => (
							<ShadcnSelect.SelectItem key={value.value} value={value.value}>
								{value.label}
							</ShadcnSelect.SelectItem>
						))}
					</ShadcnSelect.SelectGroup>
				</ShadcnSelect.SelectContent>
			</ShadcnSelect.Select>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</Field>
	);
}

export function Slider({ label }: { label: string }) {
	const field = useFieldContext<number>();
	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<Field>
			<FieldLabel htmlFor={label}>{label}</FieldLabel>
			<ShadcnSlider
				id={label}
				onBlur={field.handleBlur}
				value={[field.state.value]}
				onValueChange={(value) => field.handleChange(value[0])}
			/>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</Field>
	);
}

export function Switch({ label }: { label: string }) {
	const field = useFieldContext<boolean>();
	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<Field>
			<div className="flex items-center gap-2">
				<ShadcnSwitch
					id={label}
					onBlur={field.handleBlur}
					checked={field.state.value}
					onCheckedChange={(checked) => field.handleChange(checked)}
				/>
				<FieldLabel htmlFor={label}>{label}</FieldLabel>
			</div>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</Field>
	);
}

export function Checkbox({ label }: { label: string }) {
	const field = useFieldContext<boolean>();
	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<Field>
			<div className="flex flex-row items-center space-x-2">
				<ShadcnCheckbox
					id={label}
					checked={field.state.value}
					onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
				/>
				<FieldLabel htmlFor={label}>{label}</FieldLabel>
			</div>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</Field>
	);
}

export function CommunityCombobox({ label }: { label: string }) {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<Field>
			<FieldLabel htmlFor={label}>{label}</FieldLabel>
			<AppCommunityCombobox
				id={label}
				value={field.state.value}
				onValueChange={(value) => field.handleChange(value)}
			/>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</Field>
	);
}

export function RichTextEditor({ label }: { label: string }) {
	const field = useFieldContext<EditorContentFormats>();
	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<Field>
			<FieldLabel htmlFor={label}>{label}</FieldLabel>
			<AppRichTextEditor
				id={label}
				value={field.state.value.html}
				onChange={(value) => field.handleChange(value)}
			/>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</Field>
	);
}
