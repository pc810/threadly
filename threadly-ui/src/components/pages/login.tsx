import { GoogleIcon } from "@/components/icon/google";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "../forms/login";

export function LoginPage() {
	function loginWithGoogle() {
		window.location.href = `${process.env.VITE_API_URL}/oauth2/authorization/google`;
	}

	return (
		<div className="grid place-content-center h-svh">
			<Card className="w-full md:w-sm">
				<CardHeader>
					<div
						className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border mx-auto"
						aria-hidden="true"
					>
						<svg
							className="stroke-zinc-800 dark:stroke-zinc-100"
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 32 32"
							aria-hidden="true"
						>
							<circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
						</svg>
					</div>

					<CardTitle className="sm:text-center">Welcome back</CardTitle>
					<CardDescription className="sm:text-center">
						Enter your credentials to login to your account.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<LoginForm />

					<div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
						<span className="text-xs text-muted-foreground">Or</span>
					</div>

					<Button
						variant="outline"
						className="w-full"
						onClick={loginWithGoogle}
					>
						<GoogleIcon /> Login with Google
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
