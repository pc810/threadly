import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { GoogleIcon } from "@/components/icon/google";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/query/auth";
import { UserDTO } from "@/types/user";
import { LoginForm } from "../forms/login";
import { AppLogo } from "../icon/app";

export function LoginPage() {
	function loginWithGoogle() {
		window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;
	}

	return (
		<div className="grid place-content-center h-svh">
			<Card className="w-full md:w-sm">
				<CardHeader>
					<AppLogo className="mx-auto" />
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
					<div className="font-normal text-muted-foreground text-center">
						New to threadly?{" "}
						<Link
							className="text-sm underline hover:no-underline text-foreground"
							to="/signup"
						>
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export function LoginSuccesPage({ auth }: { auth: UserDTO }) {
	const [time, setTime] = useState(
		Number(import.meta.env.VITE_APP_REDIRECT_TIME),
	);

	const navigate = useNavigate();

	useEffect(() => {
		if (auth) {
			const intervalId = setInterval(() => {
				setTime((prev) => {
					if (prev - 1 === -1) {
						clearInterval(intervalId);
						navigate({ to: "/" });
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			return () => clearInterval(intervalId);
		}
	}, [auth, navigate]);

	if (!auth) return <Navigate to="/login" />;

	return (
		<div className="grid place-content-center h-svh">
			<Card className="w-full md:w-sm text-center">
				<CardHeader className="text-center space-y-2">
					<AppLogo className="mx-auto" isFull />
					<CheckCircle2 className="mx-auto text-success size-14" />
					<CardTitle>Welcome {auth?.name}</CardTitle>
				</CardHeader>

				<CardContent className="text-center space-y-2">
					<p className="text-sm">Successfully Signed Up</p>
					<div>Redirecting in {time} Sec</div>
				</CardContent>
			</Card>
		</div>
	);
}
