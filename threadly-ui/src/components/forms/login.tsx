import { Link } from "@tanstack/react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAppForm } from "@/hooks/form";
import { useLogin } from "@/query/auth";
import { loginRequestSchema } from "@/types/auth";

export const LoginForm = () => {
	const loginMutation = useLogin();

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
			// email: "user@example.com",
			// password: "123456789"
		},
		onSubmit: async ({ value }) => {
			await loginMutation.mutateAsync(value);
		},
		validators: {
			onChange: loginRequestSchema,
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
							placeholder="Enter your password"
							type="password"
							autoComplete="current-password"
							required
						/>
					)}
				</form.AppField>
			</div>
			<div className="flex justify-between gap-2">
				<div className="flex items-center gap-2">
					<Checkbox id={`${form._formId}-remember`} />
					<Label
						htmlFor={`${form._formId}-remember`}
						className="font-normal text-muted-foreground"
					>
						Remember me
					</Label>
				</div>
				<Link className="text-sm underline hover:no-underline" to="/">
					Forgot password?
				</Link>
			</div>
			<form.AppForm>
				<form.SubscribeButton label="Sign in" className="w-full" />
			</form.AppForm>
		</form>
	);
};
