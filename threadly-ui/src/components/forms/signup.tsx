import { Link } from "@tanstack/react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAppForm } from "@/hooks/form";
import { useSignup } from "@/query/auth";
import { registerUserRequestSchema } from "@/types/auth";

export const SignupForm = () => {
	const signupMutation = useSignup();

	const form = useAppForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await signupMutation.mutateAsync(value);
		},
		validators: {
			onChange: registerUserRequestSchema,
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
			<div className="space-y-2">
				<form.AppField name="name">
					{(field) => (
						<field.TextField
							label="Name"
							placeholder="Full Name"
							autoComplete="name"
							required
						/>
					)}
				</form.AppField>
				<form.AppField name="email">
					{(field) => (
						<field.TextField
							label="Email"
							placeholder="hi@yourcompany.com"
							autoComplete="email"
							type="email"
							required
						/>
					)}
				</form.AppField>
				<form.AppField name="password">
					{(field) => (
						<field.TextField
							label="Password"
							placeholder="Enter password"
							type="password"
							autoComplete="new-password"
							required
						/>
					)}
				</form.AppField>
			</div>
			<form.AppForm>
				<form.SubscribeButton label="Create Account" className="w-full" />
			</form.AppForm>
		</form>
	);
};
