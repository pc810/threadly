import { Link } from "@tanstack/react-router";
import { LoginForm } from "../forms/login";
import { SignupForm } from "../forms/signup";
import { AppLogo } from "../icon/app";
import { GoogleIcon } from "../icon/google";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

export function SignUpPage() {
	function signUpWithGoogle() {
		window.location.href = `${process.env.VITE_API_URL}/oauth2/authorization/google`;
	}

	return (
		<div className="grid place-content-center h-svh">
			<Card className="w-full md:w-sm">
				<CardHeader>
					<AppLogo className="mx-auto" />
					<CardTitle className="sm:text-center">Create an account</CardTitle>
					<CardDescription className="sm:text-center">
						Enter your information below to create your account.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<SignupForm />

					<div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
						<span className="text-xs text-muted-foreground">Or</span>
					</div>

					<Button
						variant="outline"
						className="w-full"
						onClick={signUpWithGoogle}
					>
						<GoogleIcon /> Sign up with Google
					</Button>
					<div className="font-normal text-muted-foreground text-center">
						Already have an account?{" "}
						<Link
							className="text-sm underline hover:no-underline text-foreground"
							to="/login"
						>
							Sign in
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
